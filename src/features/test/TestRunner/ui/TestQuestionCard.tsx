// src/features/test-runner/ui/QuestionCard.tsx
import { IQuestion, IQuestionTypeEnum, TAnswer } from "@/entities/question";
import {
  Button,
  Checkbox,
  Group,
  NumberInput,
  Radio,
  RadioGroup,
  Stack,
  TextInput,
  Text,
} from "@mantine/core";
import { useState } from "react";

interface ITestQuestionCardProps {
  question: IQuestion;
  onAnswer: (value: TAnswer) => void;
  disabled: boolean;
}

export const TestQuestionCard: React.FC<ITestQuestionCardProps> = ({
  question,
  onAnswer,
  disabled,
}) => {
  const [value, setValue] = useState<TAnswer>("");

  const variants = Object.entries(question.variants || {}).map(([k, v]) => ({
    value: k,
    label: v,
  }));

  const submit = () => onAnswer(value);

  return (
    <Stack gap="sm">
      <Text fw={500} size="lg">
        {question.title}
      </Text>

      {question.type === IQuestionTypeEnum.Single && (
        <RadioGroup
          value={value as string}
          onChange={setValue as (v: string) => void}
        >
          <Stack gap="sm">
            {variants.map((v) => (
              <Radio key={v.value} {...v} size="md" />
            ))}
          </Stack>
        </RadioGroup>
      )}

      {question.type === IQuestionTypeEnum.Multiple && (
        <Checkbox.Group
          value={(value as string[]) || []}
          onChange={setValue as (v: string[]) => void}
        >
          <Stack>
            {variants.map((v) => (
              <Checkbox key={v.value} value={v.value} label={v.label} />
            ))}
          </Stack>
        </Checkbox.Group>
      )}

      {question.type === IQuestionTypeEnum.Text && (
        <TextInput
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
        />
      )}

      {question.type === IQuestionTypeEnum.Number && (
        <NumberInput value={value as number} onChange={setValue} />
      )}

      <Group>
        <Button onClick={submit} disabled={disabled}>
          Ответить
        </Button>
      </Group>
    </Stack>
  );
};
