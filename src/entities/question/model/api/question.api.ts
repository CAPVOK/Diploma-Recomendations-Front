import { privateApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";
import { IQuestion, IQuestionTypeEnum, TAnswer } from "../types/question.types";

export const questionApi = {
  getQuestions: () =>
    request.get<IQuestion[]>(privateApi, "/question", {
      defaultErrorMessage: "Ошибка при получении списка вопросов",
    }),

  getQuestionById: ({ id }: { id: number }) =>
    request.get<unknown>(privateApi, `/question/${id}`, {
      defaultErrorMessage: "Ошибка при получении вопроса",
    }),

  createQuestion: (data: {
    title: string;
    type: IQuestionTypeEnum;
    variants: Record<string, string>;
    answer: TAnswer;
  }) =>
    request.post<
      unknown,
      {
        title: string;
        type: IQuestionTypeEnum;
        variants: Record<string, string>;
        answer: TAnswer;
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
    answer: TAnswer;
  }) =>
    request.put<
      IQuestion,
      {
        title: string;
        type: IQuestionTypeEnum;
        variants: Record<string, string>;
        answer: TAnswer;
      }
    >(privateApi, `/question/${id}`, data),

  deleteQuestion: ({ id }: { id: number }) =>
    request.delete<unknown>(privateApi, `/question/${id}`),

  checkQuestion: ({ id, ...data }: { id: number; answer: TAnswer, testId: number }) =>
    request.post<{ isCorrect: boolean; answer: TAnswer }, { answer: TAnswer }>(
      privateApi,
      `/question/${id}/check`,
      data
    ),
};
