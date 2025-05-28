import { Card, Stack, Group, Title, Badge, Divider, Text } from "@mantine/core";
import { IQuestion } from "../model";
import { ReactNode } from "react";

interface IQuestionCardTeacherProps {
  question: IQuestion;
  manageButtons?: ReactNode;
}

export const QuestionCardTeacher: React.FC<IQuestionCardTeacherProps> = ({
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
    <Card>
      <Stack gap="sm">
        <Stack gap="xs">
          <Group justify="space-between">
            <Badge variant="outline" color="blue">
              {type}
            </Badge>
            {manageButtons}
          </Group>
          <Title order={4}>{title}</Title>
        </Stack>

        <Divider />

        {/* Variants list */}
        {(type === "SINGLE" || type === "MULTIPLE") && (
          <Stack gap={4}>
            {Object.entries(variants || {}).map(([key, label]) => {
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

        {/* Show correct answer role TEXT or NUMBER */}
        {(type === "TEXT" || type === "NUMBER") && (
          <Text c="green" inline fw={500}>
            Ответ: {String(answer)}
          </Text>
        )}
      </Stack>
    </Card>
  );
};
