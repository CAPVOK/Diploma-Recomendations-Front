import { Button, Group, Stack } from "@mantine/core";

import { IQuestion, TAnswer } from "@/entities/question";

import { QuestionNavigator } from "./QuestionNavigator";
import { useState } from "react";
import { useTestRunner } from "../lib";
import { TestQuestionCard } from "./TestQuestionCard";

interface Props {
  testId: number;
  questions: IQuestion[];
  onFinish: (progress: number) => void; // навигация назад, показ модалки и т.д.
}

export const TestRunner: React.FC<Props> = ({
  testId,
  questions,
  onFinish,
}) => {
  const runner = useTestRunner({ testId, questions, onFinish });
  const q = questions[runner.current];
  const [answerPending, setAnswerPending] = useState(false);

  const alreadyAnswered = runner.answeredIds.includes(q.id);

  const handleAnswer = async (val: TAnswer) => {
    if (alreadyAnswered) return;
    setAnswerPending(true);
    await runner.answerQuestion(q, val);
    setAnswerPending(false);
    runner.next();
  };

  return (
    <Stack>
      <QuestionNavigator
        questions={questions}
        current={runner.current}
        answers={runner.answers}
        setCurrent={runner.setCurrent}
      />

      <TestQuestionCard
        key={q.id}
        question={q}
        onAnswer={handleAnswer}
        disabled={answerPending || alreadyAnswered}
      />

      <Group justify="space-between">
        <Group>
          <Button
            variant="light"
            onClick={runner.prev}
            disabled={runner.current === 0}
          >
            ← Назад
          </Button>
          <Button
            variant="light"
            onClick={runner.next}
            disabled={runner.current === questions.length - 1}
          >
            Вперёд →
          </Button>
        </Group>
        <Button
          color="green"
          disabled={!runner.canFinish}
          onClick={runner.finish}
        >
          Завершить
        </Button>
      </Group>
    </Stack>
  );
};
