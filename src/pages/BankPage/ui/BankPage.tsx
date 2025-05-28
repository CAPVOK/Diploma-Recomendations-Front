// src/features/question/ui/BankPage/BankPage.tsx
import React, { useEffect, useState } from "react";
import {
  IQuestion,
  questionApi,
  QuestionCardTeacher,
  QuestionLibrary,
} from "@/entities/question";
import { CreateQuestionModal } from "@/features/question/CreateQuestion";
import { DeleteQuestionModal } from "@/features/question/DeleteQuestion";
import { RoutesEnum } from "@/shared/lib/consts";
import { useMutation } from "@/shared/lib/hooks";
import { Stack, Breadcrumbs, Anchor, Group, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { EditQuestionModal } from "@/features/question/EditQuestion";
import { PageLayout } from "@/widgets/PageLayout";

export const BankPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [isCreateModalOpened, setCreateModalOpened] = useState(false);
  const [isEditModalOpened, setEditModalOpened] = useState(false);
  const [isDeleteModalOpened, setDeleteModalOpened] = useState(false);

  const [getQuestionsHandler, { data: questions }] = useMutation<
    IQuestion[],
    void
  >(questionApi.getQuestions);

  useEffect(() => {
    getQuestionsHandler();
  }, [getQuestionsHandler]);

  return (
    <PageLayout
      title="Банк вопросов"
      headerRest={
        <Breadcrumbs>
          <Anchor component={Link} to={RoutesEnum.Home}>
            Курсы
          </Anchor>
          <Anchor component={Link} to={RoutesEnum.Bank}>
            Банк вопросов
          </Anchor>
        </Breadcrumbs>
      }
    >
      <QuestionLibrary
        questions={questions || []}
        manageButtons={
          <Button onClick={() => setCreateModalOpened(true)}>
            Создать вопрос
          </Button>
        }
        renderQuestions={(questions) => (
          <Stack>
            {questions.map((question) => (
              <QuestionCardTeacher
                key={question.id}
                question={question}
                manageButtons={
                  <Group gap="xs">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setEditModalOpened(true);
                      }}
                    >
                      Изменить
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      onClick={() => {
                        setSelectedQuestion(question);
                        setDeleteModalOpened(true);
                      }}
                    >
                      Удалить
                    </Button>
                  </Group>
                }
              />
            ))}
          </Stack>
        )}
      />

      <CreateQuestionModal
        onCreate={getQuestionsHandler}
        opened={isCreateModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />

      <DeleteQuestionModal
        id={selectedQuestion?.id ?? -1}
        opened={isDeleteModalOpened}
        onSuccess={getQuestionsHandler}
        onClose={() => setDeleteModalOpened(false)}
      />

      <EditQuestionModal
        question={selectedQuestion ?? undefined}
        opened={isEditModalOpened}
        onClose={() => setEditModalOpened(false)}
        onSuccess={getQuestionsHandler}
      />
    </PageLayout>
  );
};

export default BankPage;
