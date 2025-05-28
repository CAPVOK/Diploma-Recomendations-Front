import { testApi } from "@/entities/test";

import { useMutation } from "@/shared/lib/hooks";
import { ConfirmationModal, IConfirmationModalProps } from "@/shared/ui";
import { notifications } from "@mantine/notifications";

interface IDeleteTestModalProps
  extends Pick<IConfirmationModalProps, "opened" | "onClose"> {
  id: number;
  onSuccess?: () => void;
}

export const DeleteTestModal = ({
  id,
  onSuccess,
  ...restModalProps
}: IDeleteTestModalProps) => {
  const [deleteHandler, { isLoading }] = useMutation(testApi.deleteTest, {
    onSuccess: () => {
      onSuccess?.();
      notifications.show({
        message: "Тест удален успешно",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось удалить тест",
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
      title="Удалить тест"
      onSubmit={handleSubmit}
      onReject={restModalProps.onClose}
      body="Вы уверены, что хотите удалить тест?"
      isLoading={isLoading}
      danger
    />
  );
};
