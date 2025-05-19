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
import { useMutation } from "@/shared/lib/hooks";
import { testApi } from "@/entities/test";
import { notifications } from "@mantine/notifications";

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

  const [createHandler, { isLoading }] = useMutation(testApi.createTest, {
    onSuccess: () => {
      onSuccess?.();
      notifications.show({
        message: "Тест успешно создан",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось создать тест",
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
    createHandler({
      name: name.trim(),
      description: description.trim(),
      deadline: isoDeadline,
      courseId,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<ModalTitle>Создать тест</ModalTitle>}
      size="lg"
      centered
    >
      <Box>
        {error && (
          <Text color="red" mb="sm">
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
              Создать
            </Button>
          </Group>
        </Box>
      </Box>
    </Modal>
  );
};
