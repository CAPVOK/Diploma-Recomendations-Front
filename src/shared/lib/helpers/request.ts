// shared/api/request.ts
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

import { IBaseErrorResponse } from "../types/common";

type Method = "get" | "post" | "put" | "delete";

interface IRequestOptions<Req> {
  method: Method;
  url: string;
  api: AxiosInstance; // publicApi или privateApi
  data?: Req;
  defaultErrorMessage?: string; // если сервер не вернёт message
}

/**
 * Универсальная функция запроса.
 * @template Res — тип поля data в ответе
 * @template Req — тип передаваемого тела (для get/ delete обычно void)
 */
async function apiRequest<Res, Req = void>(
  options: IRequestOptions<Req>
): Promise<Res> {
  const {
    method,
    url,
    data,
    api, // по умолчанию publicApi
    defaultErrorMessage = "Сетевая ошибка",
  } = options;

  try {
    // В зависимости от метода вызываем соответствующий axios-метод:
    const response: AxiosResponse<Res> = await api[method]<
      Res,
      AxiosResponse<Res>,
      Req
    >(
      url,
      // @ts-expect-error — для методов get/delete data будет undefined, axios их проигнорирует
      data
    );
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<IBaseErrorResponse>;
    const message = axiosErr.response?.data?.Message ?? defaultErrorMessage;
    throw new Error(message);
  }
}

// Удобные обёртки
const getRequest = <Res>(
  api: AxiosInstance,
  url: string,
  opts?: {
    defaultErrorMessage?: string;
  }
) =>
  apiRequest<Res, void>({
    method: "get",
    url,
    api,
    defaultErrorMessage: opts?.defaultErrorMessage,
  });

const postRequest = <Res, Req = unknown>(
  api: AxiosInstance,
  url: string,
  data: Req,
  opts?: {
    defaultErrorMessage?: string;
  }
) =>
  apiRequest<Res, Req>({
    method: "post",
    url,
    data,
    api,
    defaultErrorMessage: opts?.defaultErrorMessage,
  });

const putRequest = <Res, Req = unknown>(
  api: AxiosInstance,
  url: string,
  data: Req,
  opts?: {
    defaultErrorMessage?: string;
  }
) =>
  apiRequest<Res, Req>({
    method: "put",
    url,
    data,
    api,
    defaultErrorMessage: opts?.defaultErrorMessage,
  });

const deleteRequest = <Res, Req = unknown>(
  api: AxiosInstance,
  url: string,
  data?: Req,
  opts?: {
    defaultErrorMessage?: string;
  }
) =>
  apiRequest<Res, Req>({
    method: "delete",
    url,
    data,
    api,
    defaultErrorMessage: opts?.defaultErrorMessage,
  });

export const request = {
  delete: deleteRequest,
  put: putRequest,
  post: postRequest,
  get: getRequest,
};
