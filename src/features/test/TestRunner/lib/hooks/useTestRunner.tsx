import { useState } from "react";
import { questionApi, TAnswer } from "@/entities/question";
import { IQuestion } from "@/entities/question";
import { testApi } from "@/entities/test";
import { useAppSelector } from "@/shared/config/store";
import {
  addQuestionToStorage,
  getAnswersForTest,
} from "../helpers/questinoStorage";

interface UseTestRunnerProps {
  testId: number;
  questions: IQuestion[];
  onFinish: (progress: number) => void;
}

export const useTestRunner = ({
  testId,
  questions,
  onFinish,
}: UseTestRunnerProps) => {
  const userData = useAppSelector((state) => state.auth.user);

  const [current, setCurrent] = useState(0);

  /** Подгружаем сохранённые ответы из localStorage */
  const [answers, setAnswers] = useState<
    { questionId: number; isCorrect: boolean }[]
  >(() => {
    const stored = getAnswersForTest(userData!.username, testId);
    return Object.entries(stored).map(([qid, ok]) => ({
      questionId: Number(qid),
      isCorrect: ok,
    }));
  });

  const answeredIds = answers.map((a) => a.questionId);

  const next = () => setCurrent((i) => Math.min(i + 1, questions.length - 1));
  const prev = () => setCurrent((i) => Math.max(i - 1, 0));

  const answerQuestion = async (question: IQuestion, answer: TAnswer) => {
    if (answeredIds.includes(question.id)) return false; // 🔒 уже отвечали

    // Запрашиваем проверку у backend
    const { isCorrect } = await questionApi.checkQuestion({
      id: question.id,
      testId,
      answer,
    });

    // Локально обновляем state + localStorage
    setAnswers((arr) => [
      ...arr.filter((a) => a.questionId !== question.id),
      { questionId: question.id, isCorrect },
    ]);
    addQuestionToStorage(
      userData!.username,
      testId,
      question.id,
      isCorrect ? 1 : 0
    );

    return isCorrect;
  };

  const canFinish = answers.length === questions.length;

  const finish = async () => {
    if (!canFinish) return;
    const correct = answers.filter((a) => a.isCorrect).length;
    const progress = Math.round((correct / questions.length) * 100);
    await testApi.finishTest({ id: testId, progress });

    // Очистили после успешного завершения
    // clearAnswersForTest(userName, testId); // опционально
    onFinish(progress);
  };

  return {
    current,
    setCurrent,
    next,
    prev,
    answers,
    answeredIds,
    canFinish,
    answerQuestion,
    finish,
  };
};
