import { IUser } from "@/entities/user";

export interface IAuthUserData {
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
  user: IUser;
}
