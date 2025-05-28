import { Button, Group, Modal, ModalProps, Text } from "@mantine/core";
import { ModalTitle } from "./ModalTitle";

export interface IConfirmationModalProps extends ModalProps {
  body: string;
  onReject?: () => void;
  onSubmit: () => void;
  danger?: boolean;
  isLoading: boolean;
}

export const ConfirmationModal = ({
  onSubmit,
  onReject,
  body,
  centered = true,
  title,
  danger = false,
  isLoading,
  ...rest
}: IConfirmationModalProps) => {
  return (
    <Modal
      {...rest}
      centered={centered}
      title={<ModalTitle>{title}</ModalTitle>}
    >
      <Text>{body}</Text>
      <Group mt="md" justify="flex-end">
        <Button
          variant="default"
          onClick={() => {
            onReject?.();
            rest.onClose();
          }}
        >
          Отмена
        </Button>
        <Button
          loading={isLoading}
          onClick={onSubmit}
          color={danger ? "red" : undefined}
        >
          Подтвердить
        </Button>
      </Group>
    </Modal>
  );
};
