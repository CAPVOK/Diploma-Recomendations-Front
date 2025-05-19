// src/features/test/ui/CreateTestModal/CreateTestModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Box,
  Text,
} from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { ModalTitle } from "@/shared/ui";
import { ITest, testApi } from "@/entities/test";
import { useMutation } from "@/shared/lib/hooks";
import { notifications } from "@mantine/notifications";
import { toDatetimeLocalString } from "@/shared/lib/helpers";

interface EditTestModalProps extends Pick<ModalProps, "opened" | "onClose"> {
  onSucess: () => void;
  test: ITest | null;
}

export const EditTestModal: React.FC<EditTestModalProps> = ({
  opened,
  onClose,
  onSucess,
  test,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(""); // формат yyyy-MM-ddTHH:mm
  const [error, setError] = useState<string | null>(null);

  // Сбрасываем поля при закрытии
  useEffect(() => {
    if (!opened) {
      setName("");
      setDescription("");
      setDeadline("");
      setError(null);
    }
  }, [opened]);

  useEffect(() => {
    if (opened && test) {
      setName(test.name);
      setDescription(test.description);
      setDeadline(toDatetimeLocalString(new Date(test.deadline)));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const [editHandler, { isLoading }] = useMutation(testApi.updateTest, {
    onSuccess: () => {
      onSucess?.();
      notifications.show({
        message: "Тест успешно изменен",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось изменить тест",
        message: error.message || undefined,
        color: "red",
      });
    },
    onFinally: () => {
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Название теста обязательно");
      return;
    }
    if (!deadline) {
      setError("Укажите дедлайн");
      return;
    }
    // Дата в формате ISO
    const isoDeadline = new Date(deadline).toISOString();
    editHandler({
      testId: test?.id || -1,
      name: name.trim(),
      description: description.trim(),
      deadline: isoDeadline,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<ModalTitle>Изменить тест</ModalTitle>}
      size="lg"
      centered
    >
      <Box>
        {error && (
          <Text c="red" mb="sm">
            {error}
          </Text>
        )}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextInput
            required
            label="Название теста"
            placeholder="Введите название"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            mb="md"
          />

          <Textarea
            label="Описание"
            placeholder="Краткое описание"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            mb="md"
          />

          <TextInput
            required
            label="Дедлайн"
            type="datetime-local"
            placeholder="Дата и время"
            value={deadline}
            onChange={(e) => setDeadline(e.currentTarget.value)}
            mb="md"
          />

          <Group mt="md" justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isLoading}>
              Изменить
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
};
