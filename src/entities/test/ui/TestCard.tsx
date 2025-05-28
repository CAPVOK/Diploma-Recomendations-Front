import {
  Card,
  Group,
  Text,
  Button,
  Stack,
  StyleProp,
  DefaultMantineColor,
  Badge,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { getRoute } from "@/shared/lib/helpers";
import { RoutesEnum } from "@/shared/lib/consts";
import { ITest, ResultStatusEnum, TestStatusEnum } from "@/entities/test";
import { UserRoleEnum } from "@/entities/user";
import { VisibleForRole } from "@/shared/ui";

interface TestCardProps {
  test: ITest;
  courseData: {
    id: number;
    name: string;
  };
  onEdit: (t: ITest) => void;
  onDelete: (t: ITest) => void;
  onToggleStatus: (t: ITest) => void;
  toggleLoading: boolean;
}

const getDeadlineColor = (deadline: string): StyleProp<DefaultMantineColor> => {
  const now = Date.now();
  const diff = new Date(deadline).getTime() - now;
  const days = diff / (1000 * 60 * 60 * 24);
  if (days <= 1) return "red";
  if (days <= 3) return "yellow";
  return "dark";
};

const getStatusColor = (status: string): DefaultMantineColor => {
  if (status === "DRAFT") return "gray";
  if (status === "PROGRESS") return "green";
  return "red";
};

const getResultStatusLabel = (status: ResultStatusEnum): string => {
  switch (status) {
    case ResultStatusEnum.New:
      return "Не начат";
    case ResultStatusEnum.InProgress:
      return "В процессе";
    case ResultStatusEnum.Ended:
      return "Завершён";
    default:
      return "Неизвестно";
  }
};

const getResultStatusColor = (status: ResultStatusEnum): string => {
  switch (status) {
    case ResultStatusEnum.New:
      return "gray";
    case ResultStatusEnum.InProgress:
      return "yellow";
    case ResultStatusEnum.Ended:
      return "green";
    default:
      return "red";
  }
};

export const TestCard: React.FC<TestCardProps> = ({
  test,
  courseData,
  onEdit,
  onDelete,
  onToggleStatus,
  toggleLoading,
}) => {
  const isDraft = test.status === "DRAFT";
  return (
    <Card withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text fw={500}>{test.name}</Text>
          <Text size="sm">{test.description}</Text>
          <Text size="sm" c={getDeadlineColor(test.deadline)}>
            {new Date(test.deadline).toLocaleString()}
          </Text>
          <VisibleForRole role={UserRoleEnum.Teacher}>
            <Badge mt="xs" variant="filled" color={getStatusColor(test.status)}>
              {isDraft
                ? "Черновик"
                : test.status === "PROGRESS"
                ? "Идёт"
                : "Завершён"}
            </Badge>
          </VisibleForRole>
          <VisibleForRole role={UserRoleEnum.Student}>
            <Badge
              mt="xs"
              variant="filled"
              color={getResultStatusColor(test.result.status)}
            >
              {getResultStatusLabel(test.result.status)}{" "}
              {test.result.status == ResultStatusEnum.Ended &&
              (test.result.progress || test.result.progress === 0)
                ? test.result.progress + "%"
                : undefined}
            </Badge>
          </VisibleForRole>
        </Stack>

        <Stack gap="xs">
          <VisibleForRole role={UserRoleEnum.Student}>
            {test.result.status !== ResultStatusEnum.Ended && (
              <Button
                size="xs"
                variant="outline"
                component={Link}
                to={getRoute(RoutesEnum.TestById, test.id)}
                state={{
                  from: {
                    id: getRoute(RoutesEnum.CourseById, courseData.id),
                    name: courseData.name,
                  },
                }}
              >
                Пройти
              </Button>
            )}
          </VisibleForRole>

          <VisibleForRole role={UserRoleEnum.Teacher}>
            {test.status == TestStatusEnum.Draft && (
              <Button size="xs" variant="outline" onClick={() => onEdit(test)}>
                Редактировать
              </Button>
            )}
            <Button
              size="xs"
              color="red"
              variant="outline"
              onClick={() => onDelete(test)}
            >
              Удалить
            </Button>
            {test.status !== "ENDED" && (
              <Button
                size="xs"
                variant="outline"
                color={isDraft ? "green" : "yellow"}
                loading={toggleLoading}
                onClick={() => onToggleStatus(test)}
              >
                {isDraft ? "Открыть" : "Закрыть"}
              </Button>
            )}
          </VisibleForRole>
        </Stack>
      </Group>
    </Card>
  );
};
