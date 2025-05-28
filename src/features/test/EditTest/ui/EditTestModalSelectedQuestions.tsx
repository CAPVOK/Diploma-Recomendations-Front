import { Button, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core";

import { IQuestion, QuestionCardTeacherSmall } from "@/entities/question";
import { useEditTestFormContext } from "./EditTestModal.context";

export const EditTestModalSelectedQuestions = () => {
  const form = useEditTestFormContext();

  const selectedQuestions = form.values.questions;

  const toggleQuestion = (q: IQuestion, attach: boolean) => {
    if (attach) {
      form.insertListItem("questions", q);
    } else {
      form.setValues((prev) => ({
        ...prev,
        questions: selectedQuestions.filter((s) => s.id !== q.id),
      }));
    }
  };

  return (
    <>
      <Stack>
        <Text fw={500}>Выбранные вопросы ({selectedQuestions.length})</Text>
        {selectedQuestions.length ? (
          <Paper p="sm" shadow="none">
            <ScrollArea.Autosize mah={380}>
              <Stack gap="xs">
                {selectedQuestions.map((q) => (
                  <QuestionCardTeacherSmall
                    key={q.id}
                    question={q}
                    manageButtons={
                      <Button
                        size="xs"
                        variant="subtle"
                        color="red"
                        onClick={() => toggleQuestion(q, false)}
                      >
                        Убрать
                      </Button>
                    }
                  />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          </Paper>
        ) : (
          <Group justify="center">
            <Text c="gray">Нет вопросов</Text>
          </Group>
        )}
      </Stack>
    </>
  );
};
