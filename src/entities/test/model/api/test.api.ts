import { privateApi } from "@/shared/config/api";
import { request } from "@/shared/lib/helpers";
import { ITest, ITestWithQuestions } from "../types/test.types";

export const testApi = {
  // Получить тест с вопросами
  getTestById: ({ id }: { id: number }) =>
    request.get<ITestWithQuestions>(privateApi, `/test/${id}`, {
      defaultErrorMessage: "Не удалось получить информацию по тесту",
    }),

  // Создать тест (преподаватель)
  createTest: ({
    courseId,
    ...data
  }: {
    courseId: number;
    name: string;
    description: string;
    deadline: string; // ISO-строка
  }) =>
    request.post<
      ITest,
      { name: string; description: string; deadline: string }
    >(privateApi, `/test/${courseId}`, data, {
      defaultErrorMessage: "Не удалось создать тест",
    }),

  // Обновить тест (преподаватель)
  updateTest: ({
    testId,
    ...data
  }: {
    testId: number;
    name: string;
    description: string;
    deadline: string;
  }) =>
    request.put<ITest, { name: string; description: string; deadline: string }>(
      privateApi,
      `/test/${testId}`,
      data,
      { defaultErrorMessage: "Не удалось обновить тест" }
    ),

  // Удалить тест (преподаватель)
  deleteTest: ({ id }: { id: number }) =>
    request.delete<void>(privateApi, `/test/${id}`, {
      defaultErrorMessage: "Не удалось удалить тест",
    }),

  // Прикрепить вопрос
  attachQuestionToTest: ({
    testId,
    questionId,
  }: {
    testId: number;
    questionId: number;
  }) =>
    request.post<void, { questionId: number }>(
      privateApi,
      `/test/${testId}/question`,
      { questionId },
      { defaultErrorMessage: "Не удалось прикрепить вопрос к тесту" }
    ),

  // Открепить вопрос
  detachQuestionFromTest: ({
    testId,
    questionId,
  }: {
    testId: number;
    questionId: number;
  }) =>
    request.delete<void>(privateApi, `/test/delete/${testId}/${questionId}`, {
      defaultErrorMessage: "Не удалось открепить вопрос от теста",
    }),

  // Запустить тест (преподаватель)
  startTest: ({ id }: { id: number }) =>
    request.put<ITest>(privateApi, `/test/${id}/start`, null, {
      defaultErrorMessage: "Не удалось запустить тест",
    }),

  // Остановить тест (преподаватель)
  stopTest: ({ id }: { id: number }) =>
    request.put<ITest>(privateApi, `/test/${id}/stop`, null, {
      defaultErrorMessage: "Не удалось остановить тест",
    }),

  // Приступить к тесту (студент)
  beginTest: ({ id }: { id: number }) =>
    request.post<void>(privateApi, `/test/${id}/begin`, null, {
      defaultErrorMessage: "Не удалось начать тест",
    }),

  // Завершить тест (студент)
  finishTest: ({ id, progress }: { id: number; progress: number }) =>
    request.put<void>(
      privateApi,
      `/test/${id}/finish`,
      { progress },
      { defaultErrorMessage: "Не удалось завершить тест" }
    ),
};
