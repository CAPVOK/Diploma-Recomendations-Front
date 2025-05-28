import { courseApi, getUserCoursesThunk } from "@/entities/course";
import { useAppDispatch, useAppSelector } from "@/shared/config/store";
import { useMutation } from "@/shared/lib/hooks";
import { ConfirmationModal } from "@/shared/ui";
import { ModalTitle } from "@/shared/ui/ModalTitle";
import {
  Button,
  Text,
  ScrollArea,
  Modal,
  useModalsStack,
  Group,
  Card,
  Radio,
  Stack,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";

interface IEnrollCourseModalProps {
  opened: boolean;
  onClose: () => void;
}

export const EnrollCourseModal: React.FC<IEnrollCourseModalProps> = ({
  opened,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  // вытягиваем курсы из стора
  const userCourses = useAppSelector((s) => s.course.userCourses) || [];
  const allCourses = useAppSelector((s) => s.course.allCourses) || [];

  // определяем только ещё не записанные курсы
  const available = allCourses.filter(
    (c) => !userCourses.find((uc) => uc.id === c.id)
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // инициализируем стек с двумя модалями: список доступных и подтверждение
  const stack = useModalsStack(["select", "confirm"]);

  useEffect(() => {
    if (!opened) {
      setSelectedId(null);
    }
  }, [opened]);

  const [enrollHandler, { isLoading }] = useMutation(courseApi.enrollCourse, {
    onSuccess: () => {
      dispatch(getUserCoursesThunk());
      notifications.show({
        message: "Запись на курс прошла успешно",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось записаться на курс",
        message: error.message || undefined,
        color: "red",
      });
    },
    onFinally: () => {
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!selectedId) return;
    enrollHandler({ id: selectedId });
  };

  return (
    <Modal.Stack>
      {/* 1) Выбор курса */}
      <Modal
        {...stack.register("select")}
        onClose={onClose}
        opened={opened}
        title={<ModalTitle>Записаться на курс</ModalTitle>}
        size="lg"
        centered
      >
        {available.length === 0 ? (
          <Text c="dimmed">Нет доступных курсов для записи.</Text>
        ) : (
          <ScrollArea style={{ height: 300 }}>
            <Stack gap="sm">
              {available.map((course) => (
                <Card
                  key={course.id}
                  withBorder
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedId(course.id)}
                >
                  <Group align="center" wrap="nowrap">
                    <Radio
                      checked={selectedId === course.id}
                      onChange={() => setSelectedId(course.id)}
                    />
                    <Stack gap={0}>
                      <Text fw={500}>{course.name}</Text>
                      <Text size="sm">{course.description}</Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>
          </ScrollArea>
        )}
        <Group mt="md" justify="flex-end">
          <Button
            variant="default"
            onClick={() => {
              stack.closeAll();
              onClose();
            }}
          >
            Отмена
          </Button>
          <Button
            disabled={!selectedId}
            onClick={() => selectedId && stack.open("confirm")}
          >
            Далее
          </Button>
        </Group>
      </Modal>

      {/* 2) Подтверждение */}
      <ConfirmationModal
        isLoading={isLoading}
        {...stack.register("confirm")}
        body="Вы уверены, что хотите записаться на этот курс?"
        title="Подтверждение записи"
        onReject={() => stack.close("confirm")}
        onSubmit={() => {
          handleSubmit();
          stack.closeAll();
          onClose();
        }}
      />
    </Modal.Stack>
  );
};
