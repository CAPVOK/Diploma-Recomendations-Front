import { courseApi, getAllCoursesThunk, ICourse } from "@/entities/course";
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

interface IEditCourseModalProps extends Pick<ModalProps, "opened" | "onClose"> {
  courseData: ICourse;
}

export const EditCourseModal: React.FC<IEditCourseModalProps> = ({
  opened,
  onClose,
  courseData,
}) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: courseData.name,
      description: courseData.description,
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Название обязательно",
    },
  });

  const [editHandler, { isLoading }] = useMutation(courseApi.editCourse, {
    onSuccess: () => {
      dispatch(getAllCoursesThunk());
      notifications.show({
        message: "Курс успешно изменен",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось изменить курс",
        message: error.message || undefined,
        color: "red",
      });
    },
    onFinally: () => {
      onClose();
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    editHandler({
      id: courseData.id,
      name: values.name,
      description: values.description,
    });
  };

  const isFormDirty = form.isDirty();

  return (
    <Modal
      opened={opened}
      onClose={() => {
        form.reset();
        onClose();
      }}
      title={<ModalTitle>Изменить курс</ModalTitle>}
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
          <Button type="submit" disabled={!isFormDirty} loading={isLoading}>
            Изменить
          </Button>
        </Group>
      </Box>
    </Modal>
  );
};
