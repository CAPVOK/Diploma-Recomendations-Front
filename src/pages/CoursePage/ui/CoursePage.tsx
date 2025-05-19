import { courseApi } from "@/entities/course";
import { ITest } from "@/entities/test";
import { CreateTestModal } from "@/features/test/CteateTest";
import { DeleteTestModal } from "@/features/test/DeleteTest";
import { EditTestModal } from "@/features/test/EditTest";
import { RoutesEnum } from "@/shared/lib/consts";
import { getRoute } from "@/shared/lib/helpers";
import { useMutation, usePermissions } from "@/shared/lib/hooks";
import { PageLoader } from "@/widgets/PageLoader";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Paper,
  Portal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const getDeadlineColor = (deadline: string) => {
  const now = new Date();
  const target = new Date(deadline);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return "red";
  if (diffDays <= 3) return "yellow";
  return "gray";
};

const CoursePage: React.FC = () => {
  const { id: courseId } = useParams<{ id: string }>();

  const { isTeacher } = usePermissions();

  const [selectedTest, setSelectedTest] = useState<ITest | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [getCourseHandler, { data: courseData }] = useMutation(
    courseApi.getCourse
  );

  const tests = courseData?.tests;

  useEffect(() => {
    if (courseId !== undefined) {
      getCourseHandler({ id: Number(courseId) });
    }
  }, [courseId, getCourseHandler]);

  if (!courseData) {
    return <PageLoader />;
  }

  return (
    <>
      <Portal target={"#header-portal"}>
        <Stack gap="xs">
          <Title order={1} lh={1}>
            Курс: {courseData.name}
          </Title>
          <Breadcrumbs>
            <Anchor component={Link} to={RoutesEnum.Home} c="gray">
              Курсы
            </Anchor>
            <Anchor
              component={Link}
              to={getRoute(RoutesEnum.CourseById, courseId || -1)}
              c="gray"
            >
              {courseData?.name}
            </Anchor>
          </Breadcrumbs>
        </Stack>
      </Portal>

      <Text size="md" mb={"md"}>
        {courseData.description}
      </Text>

      <Group justify="flex-end" align="center" mb="sm">
        <Button onClick={() => setCreateModalOpen(true)}>Создать тест</Button>
        <CreateTestModal
          courseId={Number(courseId)}
          opened={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => getCourseHandler({ id: Number(courseId) })}
        />
      </Group>

      {tests === undefined || tests.length === 0 ? (
        <Text c="dimmed">Тестов пока нет.</Text>
      ) : (
        <Stack>
          {tests.map((test) => (
            <Paper shadow="xs" radius="md" p="xl" withBorder key={test.id}>
              <Group align="flex-start" justify="space-between" wrap="nowrap">
                <Stack gap={0}>
                  <Text fw={500}>{test.name}</Text>
                  <Text size="sm">{test.description}</Text>
                  <Text size="sm" c={getDeadlineColor(test.deadline)}>
                    {new Date(test.deadline).toLocaleString()}
                  </Text>
                </Stack>
                {isTeacher && (
                  <Stack>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setSelectedTest(test);
                        setEditModalOpen(true);
                      }}
                    >
                      Редактировать
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      variant="outline"
                      onClick={() => {
                        setSelectedTest(test);
                        setDeleteModalOpen(true);
                      }}
                    >
                      Удалить
                    </Button>
                  </Stack>
                )}
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      <EditTestModal
        opened={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSucess={() => getCourseHandler({ id: Number(courseId) })}
        test={selectedTest}
      />

      <DeleteTestModal
        id={selectedTest?.id || -1}
        onClose={() => setDeleteModalOpen(false)}
        opened={isDeleteModalOpen}
        onSuccess={() => getCourseHandler({ id: Number(courseId) })}
      />
    </>
  );
};

export default CoursePage;
