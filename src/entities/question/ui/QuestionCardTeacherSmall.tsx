import { Card, Stack, Group, Title, Text } from "@mantine/core";
import { IQuestion } from "../model";
import { ReactNode } from "react";

interface IQuestionCardTeacherProps {
  question: IQuestion;
  manageButtons?: ReactNode;
}

export const QuestionCardTeacherSmall: React.FC<IQuestionCardTeacherProps> = ({
  question,
  manageButtons,
}) => {
  const { title, type, variants, answer } = question;

  // Helper to determine correct variants
  const correctAnswers = () => {
    if (type === "MULTIPLE" && Array.isArray(answer)) {
      return answer;
    }
    if (type === "SINGLE" && typeof answer === "string") {
      return [answer];
    }
    return [];
  };

  return (
    <Card radius="md" p="md">
      <Stack gap={0}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Title order={4} flex={"1 0 0"}>
            {title}
          </Title>
          {manageButtons}
        </Group>

        {/* Variants list */}
        {(type === "SINGLE" || type === "MULTIPLE") && (
          <Stack gap={0}>
            {Object.entries(variants).map(([key, label]) => {
              const isCorrect = correctAnswers().includes(key);
              return (
                <Text
                  key={key}
                  fw={isCorrect ? 600 : 400}
                  c={isCorrect ? "green" : "black"}
                >
                  {key.toUpperCase()}. {label}
                </Text>
              );
            })}
          </Stack>
        )}

        {/* Show correct answer for TEXT or NUMBER */}
        {(type === "TEXT" || type === "NUMBER") && (
          <Text c="green" inline fw={500}>
            Ответ: {String(answer)}
          </Text>
        )}
      </Stack>
    </Card>
  );
};
