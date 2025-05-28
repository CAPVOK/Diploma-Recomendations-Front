import { Stack, Textarea, TextInput, StackProps } from "@mantine/core";
import { useEditTestFormContext } from "./EditTestModal.context";

interface IEditTestModalPropertiesProps {
  containerProps?: StackProps;
}

export const EditTestModalProperties = ({
  containerProps,
}: IEditTestModalPropertiesProps) => {
  const form = useEditTestFormContext();

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
