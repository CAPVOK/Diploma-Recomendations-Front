import { privateApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";
import { ITest, ITestWithQuestions } from "../types/test.types";

export const testApi = {
  getTestById: ({ id }: { id: number }) =>
    request.get<ITestWithQuestions>(privateApi, `/test/${id}`, {
      defaultErrorMessage: "Не удалось получить информацию по тесту",
    }),

  createTest: ({
    courseId,
    ...data
  }: {
    courseId: number;
    deadline: string;
    description: string;
    name: string;
  }) =>
    request.post<
      ITest,
      { deadline: string; description: string; name: string }
    >(privateApi, `/test/${courseId}`, data),

  updateTest: ({
    testId,
    ...data
  }: {
    testId: number;
    deadline: string;
    description: string;
    name: string;
  }) =>
    request.put<ITest, { deadline: string; description: string; name: string }>(
      privateApi,
      `/test/${testId}`,
      data
    ),

  deleteTest: ({ id }: { id: number }) =>
    request.delete<void>(privateApi, `/test/${id}`),

  attachQuestionToTest: ({
    questionId,
    testId,
  }: {
    questionId: number;
    testId: number;
  }) =>
    request.post<void, { questionID: number }>(
      privateApi,
      `/test/${testId}/question`,
      {
        questionID: questionId,
      }
    ),

  detachQuestionToTest: ({
    questionId,
    testId,
  }: {
    questionId: number;
    testId: number;
  }) =>
    request.delete<void, { questionID: number }>(
      privateApi,
      `/test/${testId}/question`,
      {
        questionID: questionId,
      }
    ),
};
