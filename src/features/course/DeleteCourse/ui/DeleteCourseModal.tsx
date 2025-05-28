import { courseApi, getAllCoursesThunk } from "@/entities/course";
import { useAppDispatch } from "@/shared/config/store";
import { useMutation } from "@/shared/lib/hooks";
import { ConfirmationModal, IConfirmationModalProps } from "@/shared/ui";
import { notifications } from "@mantine/notifications";

interface IDeleteCourseModalProps
  extends Pick<IConfirmationModalProps, "opened" | "onClose"> {
  id: number;
}

export const DeleteCourseModal = ({
  id,
  ...restModalProps
}: IDeleteCourseModalProps) => {
  const dsp = useAppDispatch();

  const [deleteHandler, { isLoading }] = useMutation(courseApi.deleteCourse, {
    onSuccess: () => {
      dsp(getAllCoursesThunk());
      notifications.show({
        message: "Курс удален успешно",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось удалить курс",
        message: error.message || undefined,
        color: "red",
      });
    },
    onFinally: () => {
      restModalProps.onClose();
    },
  });

  const handleSubmit = () => {
    deleteHandler({ id });
  };

  return (
    <ConfirmationModal
      {...restModalProps}
      title="Удалить курс"
      onSubmit={handleSubmit}
      onReject={restModalProps.onClose}
      body="Вы уверены, что хотите удалить курс?"
      isLoading={isLoading}
      danger
    />
  );
};
