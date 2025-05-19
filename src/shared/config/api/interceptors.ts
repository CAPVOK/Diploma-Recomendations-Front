import {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { authApi } from "@/entities/auth";
import { RoutesEnum } from "@/shared/lib/consts";
import { jwtStorage } from "@/shared/lib/helpers";

let isRefreshing = false;
let failedQueue: Array<() => void> = [];

export const setupInterceptors = (instance: AxiosInstance) => {
  // Request interceptor
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = jwtStorage.getAccessToken();
    if (token) {
      // Гарантированно создаём AxiosHeaders из существующих config.headers
      const headers = AxiosHeaders.from(config.headers ?? {});
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalReq = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Если 401 и есть рефреш-токен — пробуем обновить
      if (
        error.response?.status === 401 &&
        !originalReq._retry &&
        jwtStorage.getRefreshToken()
      ) {
        if (isRefreshing) {
          return new Promise((resolve) =>
            failedQueue.push(() => resolve(instance(originalReq)))
          );
        }

        originalReq._retry = true;
        isRefreshing = true;

        try {
          const token = jwtStorage.getRefreshToken();
          if (!token) {
            throw Error;
          }
          const { accessToken, refreshToken: newRefresh } =
            await authApi.refreshToken({
              refreshToken: token,
            });
          jwtStorage.setTokens(accessToken, newRefresh);

          // Обновляем заголовок по-умолчанию и для оригинального запроса
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalReq.headers = AxiosHeaders.from(
            originalReq.headers ?? {}
          ).set("Authorization", `Bearer ${accessToken}`);

          // Повторяем все отложенные запросы
          failedQueue.forEach((cb) => cb());
          failedQueue = [];
          return instance(originalReq);
        } catch (e) {
          jwtStorage.clear();
          window.location.href = RoutesEnum.Login;
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
