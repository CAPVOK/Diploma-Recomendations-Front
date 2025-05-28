import React, { useEffect, useRef } from "react";
import { Box, Button, Divider, Flex, Group, Modal, Stack } from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { ModalTitle } from "@/shared/ui";
import { ITest, ITestWithQuestions, testApi } from "@/entities/test";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { IEditTestSchema } from "../model";
import { EditTestFormProvider } from "./EditTestModal.context";
import { EditTestModalProperties } from "./EditTestModalProperties";
import { useMutation } from "@/shared/lib/hooks";
import { toDatetimeLocalString } from "@/shared/lib/helpers";
import { EditTestModalAllQuestions } from "./EditTestModalAllQuestions";
import { EditTestModalSelectedQuestions } from "./EditTestModalSelectedQuestions";

interface EditTestModalProps extends Pick<ModalProps, "opened" | "onClose"> {
  onSuccess?: () => void;
  testData: ITest | undefined;
}

export const EditTestModal: React.FC<EditTestModalProps> = ({
  opened,
  onClose,
  onSuccess,
  testData,
}) => {
  // Храним исходный список вопросов, чтобы вычислить diff
  const initialQuestionsRef = useRef<ITestWithQuestions["questions"]>([]);

  const form = useForm<IEditTestSchema>({
    initialValues: {
      name: "",
      description: "",
      deadline: "", // yyyy-MM-ddTHH:mm
      questions: [],
    },
    validate: {
      name: (v) => (v.trim() ? null : "Название обязательно"),
      deadline: (v) => (v ? null : "Укажите дедлайн"),
      questions: (q) => (q.length ? null : "Минимум один вопрос"),
    },
  });

  // Заполняем форму при открытии
  useEffect(() => {
    if (!opened) return;

    form.reset();
    (async () => {
      if (!testData) return;

      const { questions } = await testApi.getTestById({ id: testData.id });

      initialQuestionsRef.current = questions;

      const formData = {
        name: testData.name,
        description: testData.description,
        deadline: toDatetimeLocalString(new Date(testData.deadline)),
        questions,
      };
      console.log(testData.deadline, toDatetimeLocalString(new Date(testData.deadline)));
      form.setInitialValues(formData);
      form.setValues(formData);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, testData]);

  // Мутация
  const [editTest, { isLoading }] = useMutation(
    async (values: IEditTestSchema) => {
      if (!testData) throw new Error("Нет данных теста");

      // 1. Обновляем сам тест
      const updated = await testApi.updateTest({
        testId: testData.id,
        name: values.name.trim(),
        description: values.description.trim(),
        deadline: new Date(values.deadline).toISOString(),
      });

      // 2. Вычисляем diff вопросов
      const prevIds = new Set(initialQuestionsRef.current.map((q) => q.id));
      const nextIds = new Set(values.questions.map((q) => q.id));

      const toDetach = initialQuestionsRef.current
        .filter((q) => !nextIds.has(q.id))
        .map((q) => q.id);
      const toAttach = values.questions
        .filter((q) => !prevIds.has(q.id))
        .map((q) => q.id);

      // 3. Отвязываем
      await Promise.all(
        toDetach.map((questionId) =>
          testApi.detachQuestionFromTest({
            testId: updated.id,
            questionId,
          })
        )
      );

      // 4. Прикрепляем новые
      await Promise.all(
        toAttach.map((questionId) =>
          testApi.attachQuestionToTest({
            testId: updated.id,
            questionId,
          })
        )
      );

      return updated;
    },
    {
      onSuccess: () => {
        notifications.show({ message: "Тест обновлён", color: "green" });
        onSuccess?.();
      },
      onError: (err) => {
        notifications.show({
          title: "Ошибка при сохранении",
          message: err?.message || "Не удалось обновить тест",
          color: "red",
        });
      },
      onFinally: () => onClose(),
    }
  );

  // Сабмит формы
  const handleSubmit = (values: IEditTestSchema) => {
    editTest(values);
  };

  return (
    <>
      <Modal.Root opened={opened} onClose={onClose} fullScreen>
        <Modal.Overlay />
        <Modal.Content
          styles={{ content: { display: "flex", flexDirection: "column" } }}
        >
          <Modal.Header>
            <Modal.Title>
              <ModalTitle>Изменить тест</ModalTitle>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body flex={1}>
            <EditTestFormProvider form={form}>
              <form
                onSubmit={form.onSubmit(handleSubmit)}
                style={{ height: "100%" }}
              >
                <Stack h={"100%"} gap={0}>
                  <Divider mb="md" />

                  <Flex
                    direction={{ base: "column", md: "row" }}
                    align="flex-start"
                    gap={"md"}
                    flex={1}
                  >
                    <Stack w={"100%"} h={"100%"} visibleFrom="md">
                      <EditTestModalProperties />
                      <EditTestModalSelectedQuestions />
                    </Stack>
                    <Box w={"100%"} h={"100%"} visibleFrom="md">
                      <EditTestModalAllQuestions />
                    </Box>

                    <Stack w={"100%"} hiddenFrom="md">
                      <EditTestModalProperties />
                      <EditTestModalSelectedQuestions />
                    </Stack>
                    <Box w={"100%"} hiddenFrom="md">
                      <EditTestModalAllQuestions />
                    </Box>
                  </Flex>

                  <Group mt="md" justify="flex-end">
                    <Button
                      variant="default"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      disabled={!form.isValid()}
                    >
                      Изменить
                    </Button>
                  </Group>
                </Stack>
              </form>
            </EditTestFormProvider>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default EditTestModal;
