import { courseApi, getAllCoursesThunk } from "@/entities/course";
import { useAppDispatch } from "@/shared/config/store";
import { useMutation } from "@/shared/lib/hooks";
import { ModalTitle } from "@/shared/ui";
import {
  Modal,
  Box,
  TextInput,
  Textarea,
  Group,
  Button,
  ModalProps,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

interface ICreateCourseModalProps
  extends Pick<ModalProps, "opened" | "onClose"> {}

export const CreateCourseModal: React.FC<ICreateCourseModalProps> = ({
  opened,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Название обязательно",
    },
  });

  const [createHandler, { isLoading }] = useMutation(courseApi.createCourse, {
    onSuccess: () => {
      dispatch(getAllCoursesThunk());
      notifications.show({
        message: "Курс успешно создан",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось создать курс",
        message: error.message || undefined,
        color: "red",
      });
    },
    onFinally: () => {
      form.reset();
      onClose();
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    createHandler({
      name: values.name,
      description: values.description || undefined,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={<ModalTitle>Новый курс</ModalTitle>}
      size="lg"
      centered
    >
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Название курса"
          placeholder="Введите название"
          {...form.getInputProps("name")}
        />
        <Textarea
          mt="md"
          label="Описание курса"
          placeholder="Введите описание (необязательно)"
          minRows={4}
          {...form.getInputProps("description")}
        />
        <Group mt="md" justify="flex-end">
          <Button
            variant="default"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Отмена
          </Button>
          <Button type="submit" loading={isLoading}>
            Создать
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
