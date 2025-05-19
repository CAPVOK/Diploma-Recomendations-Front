import { privateApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";
import { IQuestion, IQuestionTypeEnum } from "../types/question.types";

export const questionApi = {
  getQuestions: () =>
    request.get<IQuestion[]>(privateApi, "/question", {
      defaultErrorMessage: "Ошибка при получении списка вопросов",
    }),

  getQuestionById: ({id}: { id: number }) =>
    request.get<unknown>(privateApi, `/question/${id}`, {
      defaultErrorMessage: "Ошибка при получении вопроса",
    }),

  createQuestion: (data: {
    title: string;
    type: IQuestionTypeEnum;
    variants: Record<string, string>;
    answer: string[] | number | string;
  }) =>
    request.post<
      unknown,
      {
        title: string;
        type: IQuestionTypeEnum;
        variants: Record<string, string>;
        answer: string[] | number | string;
      }
    >(privateApi, "/question", data),

  updateQuestion: ({
    id,
    ...data
  }: {
    id: number;
    title: string;
    type: IQuestionTypeEnum;
    variants: Record<string, string>;
    answer: string[] | number | string;
  }) =>
    request.put<
      IQuestion,
      {
        title: string;
        type: IQuestionTypeEnum;
        variants: Record<string, string>;
        answer: string[] | number | string;
      }
    >(privateApi, `/question/${id}`, data),

  deleteQuestion: ({ id }: { id: number }) =>
    request.delete<unknown>(privateApi, `/question/${id}`),

  checkQuestion: ({ id, ...data }: { id: number; answer: string }) =>
    request.post<unknown, { answer: string }>(
      privateApi,
      `/question/${id}`,
      data
    ),
};
