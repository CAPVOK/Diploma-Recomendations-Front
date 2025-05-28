import React, { useEffect } from "react";
import { Box, Button, Divider, Flex, Group, Modal, Stack } from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { ModalTitle } from "@/shared/ui";
import { testApi } from "@/entities/test";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { ICreateTestSchema } from "../model";
import { CreateTestFormProvider } from "./CreateTestModal.context";
import { CreateTestModalProperties } from "./CreateTestModalProperties";
import { useMutation } from "@/shared/lib/hooks";
import { CreateTestModalAllQuestions } from "./CreateTestModalAllQuestions";
import { CreateTestModalSelectedQuestions } from "./CreateTestModalSelectedQuestions";

interface CreateTestModalProps extends Pick<ModalProps, "opened" | "onClose"> {
  onSuccess?: () => void;
  courseId: number;
}

export const CreateTestModal: React.FC<CreateTestModalProps> = ({
  opened,
  onClose,
  onSuccess,
  courseId,
}) => {
  const form = useForm<ICreateTestSchema>({
    initialValues: {
      name: "",
      description: "",
      deadline: "", // yyyy-MM-ddTHH:mm
      questions: [],
    },
    validate: {
      name: (value) => (value.trim() ? null : "Название обязательно"),
      deadline: (value) => (value ? null : "Укажите дедлайн"),
      questions: (value) => (value.length ? null : "Минимум один вопрос"),
    },
  });

  useEffect(() => {
    if (opened) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const [createHandler, { isLoading }] = useMutation(
    async (values: ICreateTestSchema) => {
      return testApi
        .createTest({
          name: values.name.trim(),
          description: values.description.trim(),
          deadline: new Date(values.deadline).toISOString(),
          courseId,
        })
        .then((newTest) => {
          return Promise.all(
            values.questions.map((q) =>
              testApi.attachQuestionToTest({
                testId: newTest.id,
                questionId: q.id,
              })
            )
          );
        });
    },
    {
      onSuccess: () => {
        onSuccess?.();
        notifications.show({
          message: "Тест успешно создан",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Ошибка при создании теста",
          message: error?.message ?? "Не удалось создать тест",
          color: "red",
        });
      },
      onFinally: () => {
        onClose();
      },
    }
  );

  const handleSubmit = async (values: ICreateTestSchema) => {
    createHandler(values);
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
              <ModalTitle>Создать тест</ModalTitle>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body flex={1}>
            <CreateTestFormProvider form={form}>
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
                      <CreateTestModalProperties />
                      <CreateTestModalSelectedQuestions />
                    </Stack>
                    <Box w={"100%"} h={"100%"} visibleFrom="md">
                      <CreateTestModalAllQuestions />
                    </Box>

                    <Stack w={"100%"} hiddenFrom="md">
                      <CreateTestModalProperties />
                      <CreateTestModalSelectedQuestions />
                    </Stack>
                    <Box w={"100%"} hiddenFrom="md">
                      <CreateTestModalAllQuestions />
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
                      Создать
                    </Button>
                  </Group>
                </Stack>
              </form>
            </CreateTestFormProvider>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
};

export default CreateTestModal;
