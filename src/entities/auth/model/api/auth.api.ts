import { publicApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";

import {
  ILoginReqData,
  ILoginResponse,
  IRefreshTokenReqData,
  IRefreshTokenResponse,
  IRegisterReqData,
  IRegisterResponse,
} from "../types/auth.dto";

const register = async (data: IRegisterReqData) => {
  return request.post<IRegisterResponse, IRegisterReqData>(
    publicApi,
    "/auth/register",
    data,
    {
      defaultErrorMessage: "Ошибка регистрации",
    }
  );
};

const login = async (data: ILoginReqData) => {
  return request.post<ILoginResponse, ILoginReqData>(
    publicApi,
    "/auth/login",
    data,
    {
      defaultErrorMessage: "Ошибка авторизации",
    }
  );
};

const refreshToken = async (data: IRefreshTokenReqData) => {
  return request.post<IRefreshTokenResponse, IRefreshTokenReqData>(
    publicApi,
    "/auth/refresh",
    data,
    {
      defaultErrorMessage: "Не удалось обновить токен",
    }
  );
};

export const authApi = {
  refreshToken,
  login,
  register,
};
