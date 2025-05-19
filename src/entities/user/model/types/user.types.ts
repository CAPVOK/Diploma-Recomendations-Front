import { ICourse } from "@/entities/course";
import { IBaseEntity } from "@/shared/lib/types/common";

export enum UserRoleEnum {
  Student = "STUDENT",
  Teacher = "TEACHER",
}

export interface IUser extends IBaseEntity {
  username: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: UserRoleEnum;
}

export interface IGetUserRes extends IUser {
  courses: ICourse[];
}
