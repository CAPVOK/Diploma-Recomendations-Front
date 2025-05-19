// src/features/question/ui/BankPage/BankPage.tsx
import React, { useEffect, useState } from "react";
import {
  IQuestion,
  questionApi,
  QuestionCardTeacher,
} from "@/entities/question";
import { CreateQuestionModal } from "@/features/question/CreateQuestion";
import { DeleteQuestionModal } from "@/features/question/DeleteQuestion";
import { RoutesEnum } from "@/shared/lib/consts";
import { useMutation } from "@/shared/lib/hooks";
import { EmptyBlock } from "@/shared/ui";
import { PageLoader } from "@/widgets/PageLoader";
import {
  Portal,
  Stack,
  Title,
  Breadcrumbs,
  Anchor,
  Group,
  Button,
  Select,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { EditQuestionModal } from "@/features/question/EditQuestion";

const questionTypeOptions = [
  { value: "SINGLE", label: "Один ответ" },
  { value: "MULTIPLE", label: "Несколько ответов" },
  { value: "TEXT", label: "Текстовый ответ" },
  { value: "NUMBER", label: "Числовой ответ" },
];

export const BankPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
    null
  );
  const [isCreateModalOpened, setCreateModalOpened] = useState(false);
  const [isEditModalOpened, setEditModalOpened] = useState(false);
  const [isDeleteModalOpened, setDeleteModalOpened] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const [getQuestionsHandler, { data: questions }] = useMutation<
    IQuestion[],
    void
  >(questionApi.getQuestions);

  useEffect(() => {
    getQuestionsHandler();
  }, [getQuestionsHandler]);

  // Filter questions by selected type
  const filteredQuestions = questions
    ? questions.filter((q) => (filterType ? q.type === filterType : true))
    : [];

  return (
    <>
      <Portal target="#header-portal">
        <Stack gap="xs">
          <Title order={1} lh={1}>
            Банк вопросов
          </Title>
          <Breadcrumbs>
            <Anchor component={Link} to={RoutesEnum.Home} c="gray">
              Курсы
            </Anchor>
            <Anchor component={Link} to={RoutesEnum.Bank} c="gray">
              Банк вопросов
            </Anchor>
          </Breadcrumbs>
        </Stack>
      </Portal>

      <Group justify="space-between" mb="md">
        <Select
          data={questionTypeOptions}
          value={filterType}
          onChange={(val) => setFilterType(val ?? "")}
          placeholder="Все типы"
          clearable
        />
        <Button onClick={() => setCreateModalOpened(true)}>
          Создать вопрос
        </Button>
      </Group>

      {questions === null ? (
        <PageLoader />
      ) : !filteredQuestions.length ? (
        <EmptyBlock message="Вопросов нет, создайте новый" />
      ) : (
        <Stack>
          {filteredQuestions.map((question) => (
            <QuestionCardTeacher
              question={question}
              key={question.id}
              manageButtons={
                <Group>
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
    </>
  );
};

export default BankPage;
