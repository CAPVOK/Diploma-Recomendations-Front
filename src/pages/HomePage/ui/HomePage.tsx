import React, { useEffect, useState } from "react";
import {
  Title,
  Button,
  Group,
  Text,
  Stack,
  Anchor,
  Portal,
  Paper,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/shared/config/store";
import {
  getAllCoursesThunk,
  getUserCoursesThunk,
  ICourse,
} from "@/entities/course";
import { usePermissions } from "@/shared/lib/hooks";
import { PageLoader } from "@/widgets/PageLoader";
import { EnrollCourseModal } from "@/features/course/EnrollCourse";

import { CreateCourseModal } from "@/features/course/CreateCourse";
import { Link } from "react-router-dom";
import { getRoute } from "@/shared/lib/helpers";
import { RoutesEnum } from "@/shared/lib/consts";
import { EditCourseModal } from "@/features/course/EditCourse";
import { DeleteCourseModal } from "@/features/course/DeleteCourse";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isStudent, isTeacher } = usePermissions();

  // курсы пользователя из Redux
  const userCourses = useAppSelector((state) => state.course.userCourses);
  const allCourses = useAppSelector((state) => state.course.allCourses);

  useEffect(() => {
    dispatch(getAllCoursesThunk());
    dispatch(getUserCoursesThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const [isEnrollModalOpen, setEnrollModalOpen] = useState(false);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  if (userCourses === null || allCourses === null) {
    return <PageLoader />;
  }

  const dispayCourses = isStudent ? userCourses : allCourses;

  return (
    <>
      <Portal target={"#header-portal"}>
        <Stack gap="xs">
          <Title order={1} lh={1}>
            Курсы
          </Title>
          <Anchor component={Link} to={RoutesEnum.Bank}>
            К Банку вопросов
          </Anchor>
        </Stack>
      </Portal>

      <Group justify="flex-end" mb="sm">
        {isStudent && (
          <Button onClick={() => setEnrollModalOpen(true)}>
            Записаться на курс
          </Button>
        )}
        {isTeacher && (
          <>
            <Button variant="filled" onClick={() => setCreateModalOpen(true)}>
              Создать курс
            </Button>
          </>
        )}
      </Group>
      {dispayCourses.length === 0 ? (
        <Text c="dimmed">Курсов пока нет.</Text>
      ) : (
        <Stack>
          {dispayCourses.map((course) => (
            <Paper shadow="xs" radius="md" p="xl" withBorder key={course.id}>
              <Group align="flex-start" justify="space-between" wrap="nowrap">
                <Stack gap={0}>
                  <Anchor
                    component={Link}
                    to={getRoute(RoutesEnum.CourseById, course.id)}
                    fw={500}
                  >
                    {course.name}
                  </Anchor>
                  <Text size="sm">{course.description}</Text>
                </Stack>
                {isTeacher && (
                  <Stack>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setSelectedCourse(course);
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
                        setSelectedCourse(course);
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

      {/* Модалка записи */}
      <EnrollCourseModal
        opened={isEnrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />

      {/* Модалка создания */}
      <CreateCourseModal
        opened={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {!!selectedCourse && isEditModalOpen && (
        <EditCourseModal
          opened={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          courseData={selectedCourse}
        />
      )}

      {!!selectedCourse && isDeleteModalOpen && (
        <DeleteCourseModal
          id={selectedCourse.id}
          opened={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </>
  );
};
export default HomePage;
