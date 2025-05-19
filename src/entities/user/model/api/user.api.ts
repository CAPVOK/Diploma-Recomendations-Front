import { privateApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";
import { IGetUserRes } from "../types/user.types";

export const userApi = {
  getMe: () =>
    request.get<IGetUserRes>(privateApi, "/user/me", {
      defaultErrorMessage: "Ошибка при получении данных пользователя",
    }),
};
