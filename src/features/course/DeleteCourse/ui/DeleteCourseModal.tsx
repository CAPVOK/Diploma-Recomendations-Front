import { courseApi, getAllCoursesThunk } from "@/entities/course";
import { useAppDispatch } from "@/shared/config/store";
import { useMutation } from "@/shared/lib/hooks";
import { ConfirmationModal, IConfirmationModalProps } from "@/shared/ui";

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
