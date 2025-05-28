// src/utils/userAnswers.ts

const STORAGE_KEY = "userAnswers";

/**
 * Записывает в localStorage ответ пользователя на вопрос:
 *   addQuestionToStorage("alice", 42, 100, 1)
 *
 * @param userName     Уникальный идентификатор пользователя
 * @param testId       ID теста
 * @param questionId   ID вопроса
 * @param isCorrect    1 – правильно, 0 – неправильно
 */
export function addQuestionToStorage(
  userName: string,
  testId: number,
  questionId: number,
  isCorrect: number
): void {
  // Считываем уже существующие данные
  const raw = localStorage.getItem(STORAGE_KEY);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = raw ? JSON.parse(raw) : {};

  // Убеждаемся, что есть структура для этого userName и testId
  if (!data[userName]) data[userName] = {};
  if (!data[userName][testId]) data[userName][testId] = {};

  // Сохраняем результат
  data[userName][testId][questionId] = Boolean(isCorrect);

  // Записываем обратно
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Получить все ответы по пользователю и тесту
 *
 * @param userName  Уникальный идентификатор пользователя
 * @param testId    ID теста
 * @returns         Объект { questionId: boolean, ... }
 */
export function getAnswersForTest(
  userName: string,
  testId: number
): Record<number, boolean> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = JSON.parse(raw) as Record<string, any>;
  const testMap = data[userName]?.[testId];
  if (!testMap) return {};

  return Object.entries(testMap).reduce<Record<number, boolean>>(
    (acc, [qid, ok]) => {
      acc[Number(qid)] = Boolean(ok);
      return acc;
    },
    {}
  );
}

/**
 * Очистить все ответы по пользователю и тесту
 *
 * @param userName  Уникальный идентификатор пользователя
 * @param testId    ID теста
 */
export function clearAnswersForTest(userName: string, testId: number): void {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = JSON.parse(raw) as Record<string, any>;
  if (data[userName] && data[userName][testId]) {
    delete data[userName][testId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
