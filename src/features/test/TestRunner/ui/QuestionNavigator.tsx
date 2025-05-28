import { IQuestion } from "@/entities/question";
import { Group, Badge } from "@mantine/core";

interface IQuestionNavigatorProps {
  current: number;
  answers: { questionId: number; isCorrect: boolean }[];
  setCurrent: (index: number) => void;
  questions: IQuestion[];
}

export const QuestionNavigator: React.FC<IQuestionNavigatorProps> = ({
  current,
  answers,
  setCurrent,
  questions,
}) => {
  return (
    <Group gap="md" wrap="wrap">
      {questions.map(({ id: qId }, index) => {
        const answered = answers.find((a) => a.questionId === qId);

        return (
          <Badge
            key={index}
            color={
              answered
                ? answered.isCorrect
                  ? "green"
                  : "red"
                : index === current
                ? "blue"
                : "blue.4"
            }
            variant={index === current ? "filled" : "light"}
            onClick={() => setCurrent(index)}
            style={{ cursor: "pointer" }}
            size="xl"
          >
            {index + 1}
          </Badge>
        );
      })}
    </Group>
  );
};
