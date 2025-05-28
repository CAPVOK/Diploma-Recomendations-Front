import { IUser } from "@/entities/user";

import { IAuthUserData } from "./auth.types";

export interface IRefreshTokenReqData {
  refreshToken: string;
}
export interface IRefreshTokenResponse extends Omit<IAuthUserData, "user"> {}

export interface ILoginReqData {
  password: string;
  username: string;
}
export interface ILoginResponse extends IAuthUserData {}

export interface IRegisterReqData {
  firstName: string;
  lastName: string;
  password: string;
  patronymic: string;
  username: string;
}
export interface IRegisterResponse extends IUser {}
