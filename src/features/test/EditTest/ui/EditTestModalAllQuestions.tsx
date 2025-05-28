import { Button, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { useQuery } from "@/shared/lib/hooks";
import {
  IQuestion,
  questionApi,
  QuestionCardTeacherSmall,
  QuestionLibrary,
} from "@/entities/question";
import { useEditTestFormContext } from "./EditTestModal.context";

export const EditTestModalAllQuestions = () => {
  const form = useEditTestFormContext();

  const selectedQuestions = form.values.questions;

  const { data: allQuestions } = useQuery(questionApi.getQuestions, undefined);

  const availableQuestions =
    allQuestions?.filter(
      (q) => !selectedQuestions.some((selectedQ) => selectedQ.id === q.id)
    ) || [];

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
    <Stack>
      <Text fw={500}>Все вопросы ({availableQuestions.length})</Text>
      {availableQuestions.length ? (
        <QuestionLibrary
          questions={availableQuestions}
          filtersWithoutGap={true}
          renderQuestions={(questions) => (
            <Paper p="sm" shadow="none">
              <ScrollArea.Autosize mah={590}>
                <Stack gap="xs">
                  {questions.map((q) => (
                    <QuestionCardTeacherSmall
                      question={q}
                      key={q.id}
                      manageButtons={
                        <Button
                          size="xs"
                          variant="subtle"
                          color="blue"
                          onClick={() => toggleQuestion(q, true)}
                        >
                          Добавить
                        </Button>
                      }
                    />
                  ))}
                </Stack>
              </ScrollArea.Autosize>
            </Paper>
          )}
        />
      ) : (
        <Group justify="center">
          <Text c="gray">Нет вопросов</Text>
        </Group>
      )}
    </Stack>
  );
};
