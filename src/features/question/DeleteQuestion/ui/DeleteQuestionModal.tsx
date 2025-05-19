import { questionApi } from "@/entities/question";

import { useMutation } from "@/shared/lib/hooks";
import { ConfirmationModal, IConfirmationModalProps } from "@/shared/ui";
import { notifications } from "@mantine/notifications";

interface IDeleteQuestionModalProps
  extends Pick<IConfirmationModalProps, "opened" | "onClose"> {
  id: number;
  onSuccess?: () => void;
}

export const DeleteQuestionModal = ({
  id,
  onSuccess,
  ...restModalProps
}: IDeleteQuestionModalProps) => {
  const [deleteHandler, { isLoading }] = useMutation(
    questionApi.deleteQuestion,
    {
      onSuccess: () => {
        onSuccess?.();
        notifications.show({
          message: "Вопрос удален успешно",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Не удалось удалить вопрос",
          message: error.message || undefined,
          color: "red",
        });
      },
      onFinally: () => {
        restModalProps.onClose();
      },
    }
  );

  const handleSubmit = () => {
    deleteHandler({ id });
  };

  return (
    <ConfirmationModal
      {...restModalProps}
      title="Удалить вопрос"
      onSubmit={handleSubmit}
      onReject={restModalProps.onClose}
      body="Вы уверены, что хотите удалить вопрос?"
      isLoading={isLoading}
      danger
    />
  );
};
