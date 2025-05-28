import React, { useEffect, useState } from "react";
import { Button, Group, Text, Stack, Anchor } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/shared/config/store";
import {
  CourseCard,
  getAllCoursesThunk,
  getUserCoursesThunk,
  ICourse,
} from "@/entities/course";
import { usePermissions } from "@/shared/lib/hooks";
import { PageLoader } from "@/widgets/PageLoader";
import { EnrollCourseModal } from "@/features/course/EnrollCourse";

import { CreateCourseModal } from "@/features/course/CreateCourse";
import { Link } from "react-router-dom";
import { RoutesEnum } from "@/shared/lib/consts";
import { EditCourseModal } from "@/features/course/EditCourse";
import { DeleteCourseModal } from "@/features/course/DeleteCourse";
import { VisibleForRole } from "@/shared/ui";
import { UserRoleEnum } from "@/entities/user";
import { PageLayout } from "@/widgets/PageLayout";

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { isStudent } = usePermissions();

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
    <PageLayout
      title={"Курсы"}
      headerRest={
        <VisibleForRole role={UserRoleEnum.Teacher}>
          <Anchor component={Link} to={RoutesEnum.Bank}>
            К Банку вопросов
          </Anchor>
        </VisibleForRole>
      }
    >
      <Group justify="flex-end" mb="sm">
        <VisibleForRole role={UserRoleEnum.Student}>
          <Button onClick={() => setEnrollModalOpen(true)}>
            Записаться на курс
          </Button>
        </VisibleForRole>
        <VisibleForRole role={UserRoleEnum.Teacher}>
          <Button variant="filled" onClick={() => setCreateModalOpen(true)}>
            Создать курс
          </Button>
        </VisibleForRole>
      </Group>
      {dispayCourses.length === 0 ? (
        <Text c="dimmed">Курсов пока нет.</Text>
      ) : (
        <Stack>
          {dispayCourses.map((course) => (
            <CourseCard
              course={course}
              key={course.id}
              manageButtons={
                <VisibleForRole role={UserRoleEnum.Teacher}>
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
                </VisibleForRole>
              }
            />
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
    </PageLayout>
  );
};
export default HomePage;
