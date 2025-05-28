import { Stack, Textarea, TextInput, StackProps } from "@mantine/core";
import { useCreateTestFormContext } from "./CreateTestModal.context";

interface ICreateTestModalPropertiesProps {
  containerProps?: StackProps;
}

export const CreateTestModalProperties = ({
  containerProps,
}: ICreateTestModalPropertiesProps) => {
  const form = useCreateTestFormContext();

  return (
    <Stack {...containerProps}>
      <TextInput
        key={form.key("name")}
        {...form.getInputProps("name")}
        required
        label="Название теста"
        placeholder="Введите название"
      />

      <Textarea
        key={form.key("description")}
        {...form.getInputProps("description")}
        label="Описание"
        placeholder="Краткое описание"
      />

      <TextInput
        key={form.key("deadline")}
        {...form.getInputProps("deadline")}
        required
        label="Дедлайн"
        type="datetime-local"
        placeholder="Дата и время"
      />
    </Stack>
  );
};
