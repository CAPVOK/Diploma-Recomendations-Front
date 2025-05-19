import { request } from "@/shared/lib/helpers";

import {
  ICreateCourseReqData,
  ICreateCourseRes,
  IDeleteCourseReqData,
  IEditCourseDTO,
  IEditCourseReqData,
  IEditCourseRes,
  IGetCourseReqData,
  TDeleteCourseRes,
  TGetCourseRes,
  TGetCoursesRes,
  IEnrollCourseReqData,
  TEnrollCourseRes,
} from "../types/course.dto.types";
import { privateApi } from "@/shared/config/api";

export const courseApi = {
  /**
   * Получить список всех курсов
   */
  getCourses: () =>
    request.get<TGetCoursesRes>(privateApi, "/course", {
      defaultErrorMessage: "Ошибка при получении списка курсов",
    }),

  /**
   * Получить один курс по ID
   */
  getCourse: (data: IGetCourseReqData) =>
    request.get<TGetCourseRes>(privateApi, `/course/${data.id}`, {
      defaultErrorMessage: "Ошибка при получении данных курса",
    }),

  /**
   * Создать новый курс
   */
  createCourse: (dto: ICreateCourseReqData) =>
    request.post<ICreateCourseRes, ICreateCourseReqData>(
      privateApi,
      "/course",
      dto,
      {
        defaultErrorMessage: "Ошибка при создании курса",
      }
    ),

  /**
   * Редактировать существующий курс
   */
  editCourse: ({ id, ...dto }: IEditCourseReqData) =>
    request.put<IEditCourseRes, IEditCourseDTO>(
      privateApi,
      `/course/${id}`,
      dto,
      {
        defaultErrorMessage: "Ошибка при обновлении курса",
      }
    ),

  /**
   * Удалить курс по ID
   */
  deleteCourse: ({ id }: IDeleteCourseReqData) =>
    request.delete<TDeleteCourseRes>(privateApi, `/course/${id}`, {
      defaultErrorMessage: "Ошибка при удалении курса",
    }),

  /**
    Записаться на курс
   */
  enrollCourse: ({ id }: IEnrollCourseReqData) =>
    request.post<TEnrollCourseRes>(privateApi, `/course/${id}/enroll`, {
      defaultErrorMessage: "Ошибка при записи на курс",
    }),
};
