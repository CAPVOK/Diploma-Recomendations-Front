import { ITest } from "@/entities/test";
import { ICourse } from "./course.types";

export type TGetCoursesRes = ICourse[];

export interface ICreateCourseRes extends ICourse {}
export interface ICreateCourseReqData
  extends Pick<ICourse, "name" | "description"> {}

export interface TGetCourseRes extends ICourse {
  tests: ITest[];
}
export interface IGetCourseReqData {
  id: number;
}

export interface IEditCourseRes extends Pick<ICourse, "name" | "description"> {
  id: number;
}
export interface IEditCourseDTO extends Pick<ICourse, "name" | "description"> {}
export interface IEditCourseReqData extends IEditCourseDTO {
  id: number;
}

export type TDeleteCourseRes = null;
export interface IDeleteCourseReqData {
  id: number;
}

export type TEnrollCourseRes = null;
export interface IEnrollCourseReqData {
  id: number;
}
