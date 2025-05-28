// src/features/question/ui/CreateQuestionModal/CreateQuestionModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Box,
  Select,
  NumberInput,
  MultiSelect,
  RadioGroup,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import type { ModalProps } from "@mantine/core";
import { IQuestionTypeEnum, questionApi } from "@/entities/question";
import { ModalTitle } from "@/shared/ui";
import { notifications } from "@mantine/notifications";
import { useMutation } from "@/shared/lib/hooks";

interface CreateQuestionModalProps extends ModalProps {
  onCreate?: () => void;
}

export const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  onCreate,
  ...modalProps
}) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<IQuestionTypeEnum>(IQuestionTypeEnum.Single);
  const [variantCount, setVariantCount] = useState<number>(1);
  const [variants, setVariants] = useState<string[]>([""]);
  const [answer, setAnswer] = useState<string | string[] | number>("");
  const [error, setError] = useState<string | null>(null);

  const [createQuestionsHandler, { isLoading }] = useMutation(
    questionApi.createQuestion,
    {
      onSuccess: () => {
        onCreate?.();
        notifications.show({
          message: "Вопрос успешно создан",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Не удалось создать вопрос",
          message: error.message || undefined,
          color: "red",
        });
      },
      onFinally: () => {
        modalProps.onClose();
      },
    }
  );

  useEffect(() => {
    if (!modalProps.opened) {
      setTitle("");
      setType(IQuestionTypeEnum.Single);
      setVariantCount(1);
      setVariants([""]);
      setAnswer("");
      setError(null);
    }
  }, [modalProps.opened]);

  // When variantCount changes, adjust variants array length
  useEffect(() => {
    setVariants((prev) => {
      const arr = [...prev];
      if (variantCount > arr.length) {
        return arr.concat(Array(variantCount - arr.length).fill(""));
      }
      return arr.slice(0, variantCount);
    });
  }, [variantCount]);

  const letterKey = (idx: number) => String.fromCharCode(97 + idx);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Название обязательно");
      return;
    }
    if (
      ((type === IQuestionTypeEnum.Single ||
        type === IQuestionTypeEnum.Multiple) &&
        variants.some((v) => !v.trim())) ||
      !variants.length
    ) {
      setError("Все варианты должны быть заполнены");
      return;
    }
    if (
      Array.isArray(answer)
        ? !answer.length
        : typeof answer === "string"
        ? !answer.trim().length
        : answer === undefined
    ) {
      setError("Ответ обязателен");
      return;
    }
    const variantsObj: Record<string, string> = {};
    variants.forEach((v, i) => {
      variantsObj[letterKey(i)] = v;
    });
    createQuestionsHandler({
      title: title.trim(),
      type,
      variants: variantsObj,
      answer,
    });
  };

  const options = variants.map((_v, i) => letterKey(i));

  return (
    <Modal
      {...modalProps}
      title={<ModalTitle>Создать вопрос</ModalTitle>}
      size="lg"
      centered
    >
      <Box>
        {error && (
          <Text c="red" mb="sm">
            {error}
          </Text>
        )}
        <Stack gap="md">
          <TextInput
            required
            label="Заголовок:"
            placeholder="Текст вопроса"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />

          <RadioGroup
            label="Тип вопроса:"
            value={type}
            onChange={(val) => {
              setType(val as IQuestionTypeEnum);
              setAnswer(val === IQuestionTypeEnum.Multiple ? [] : "");
            }}
          >
            <Stack gap={4} mt={"xs"}>
              <Radio value={IQuestionTypeEnum.Single} label="Один ответ" />
              <Radio
                value={IQuestionTypeEnum.Multiple}
                label="Несколько ответов"
              />
              <Radio value={IQuestionTypeEnum.Text} label="Текстовый ответ" />
              <Radio value={IQuestionTypeEnum.Number} label="Числовой ответ" />
            </Stack>
          </RadioGroup>

          {(type === IQuestionTypeEnum.Single ||
            type === IQuestionTypeEnum.Multiple) && (
            <Group grow>
              <Select
                label="Кол-во вариантов:"
                data={[1, 2, 3, 4].map((n) => ({
                  value: String(n),
                  label: String(n),
                }))}
                value={String(variantCount)}
                onChange={(val) => setVariantCount(Number(val))}
              />
            </Group>
          )}

          {(type === IQuestionTypeEnum.Single ||
            type === IQuestionTypeEnum.Multiple) && (
            <Stack gap="xs">
              {variants.map((v, idx) => (
                <Stack key={idx} gap={0}>
                  <Text size="sm" fw={500}>{`Вариант ${letterKey(idx)}`}</Text>
                  <TextInput
                    placeholder={`Вариант ${letterKey(idx)}`}
                    value={v}
                    onChange={(e) => {
                      const arr = [...variants];
                      arr[idx] = e.currentTarget.value;
                      setVariants(arr);
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          )}

          {type === IQuestionTypeEnum.Single && (
            <>
              <Select
                data={options}
                label="Правильный ответ:"
                placeholder="Выберите"
                value={answer as string}
                onChange={(val) => setAnswer(val as string)}
              />
            </>
          )}

          {type === IQuestionTypeEnum.Multiple && (
            <MultiSelect
              data={options}
              label="Правильные ответы:"
              placeholder="Выберите"
              value={answer as string[]}
              onChange={(val) => setAnswer(val)}
            />
          )}

          {type === IQuestionTypeEnum.Text && (
            <TextInput
              label="Правильный отве:"
              placeholder="Введите ответ"
              value={answer as string}
              onChange={(e) => setAnswer(e.currentTarget.value)}
            />
          )}

          {type === IQuestionTypeEnum.Number && (
            <NumberInput
              label="Правильный ответ"
              placeholder="Введите число"
              value={answer as number}
              onChange={(val) => setAnswer(val ?? 0)}
            />
          )}

          <Group mt="md" justify="flex-end">
            <Button variant="default" onClick={modalProps.onClose}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} loading={isLoading}>
              Создать
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};
