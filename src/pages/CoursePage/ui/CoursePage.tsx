// src/pages/CoursePage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Breadcrumbs,
  Anchor,
  Group,
  Stack,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { PageLayout } from "@/widgets/PageLayout";
import { PageLoader } from "@/widgets/PageLoader";
import { TestFilterBar, TestList } from "@/widgets/TestList";
import { VisibleForRole, ConfirmationModal, ModalTitle } from "@/shared/ui";

import { courseApi } from "@/entities/course";
import { AssigneeEnum, testApi } from "@/entities/test";
import { ITest, TestStatusEnum } from "@/entities/test";
import { UserRoleEnum } from "@/entities/user";
import { EditTestModal } from "@/features/test/EditTest";
import { DeleteTestModal } from "@/features/test/DeleteTest";
import { useMutation, usePermissions } from "@/shared/lib/hooks";
import { CreateTestModal } from "@/features/test/CteateTest";
import { TestRecommendedList } from "@/widgets/TestList/ui/TestRecommendedList";

export const CoursePage: React.FC = () => {
  const { id: courseIdStr } = useParams<{ id: string }>();
  const courseId = Number(courseIdStr);

  const { isStudent } = usePermissions();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestStatusEnum | null>(null);

  const [selectedTest, setSelectedTest] = useState<ITest | null>(null);
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    delete: false,
    toggleStatus: false,
  });

  const [getCourse, { data: courseData }] = useMutation(courseApi.getCourse, {
    onError: () =>
      notifications.show({ message: "Ошибка загрузки курса", color: "red" }),
  });
  const refresh = () => getCourse({ id: courseId });

  const [openTest, { isLoading: isOpen }] = useMutation(testApi.startTest, {
    onSuccess: () => refresh(),
    onError: () =>
      notifications.show({ message: "Не удалось открыть", color: "red" }),
  });

  const [closeTest, { isLoading: isClose }] = useMutation(testApi.stopTest, {
    onSuccess: () => refresh(),
    onError: () =>
      notifications.show({ message: "Не удалось закрыть", color: "red" }),
  });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // 1) сортируем: сначала самые свежие по createdAt
  // 2) фильтруем по статусу и названию
  const tests = useMemo(() => {
    if (!courseData) return [];

    return [...(courseData.tests || [])]
      .filter((t) => {
        // если пользователь — студент, показываем только открытые тесты
        if (isStudent && t.status !== TestStatusEnum.Progress) {
          return false;
        }
        if (t.assignee !== AssigneeEnum.Teacher) {
          return false;
        }

        // фильтрация по статусу
        if (statusFilter !== null && t.status !== statusFilter) {
          return false;
        }

        // фильтрация по строке поиска
        if (!t.name.toLowerCase().includes(search.trim().toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData?.tests, search, statusFilter, isStudent]);

  const recomendedTests = useMemo(() => {
    if (!courseData) return [];

    return [...(courseData.tests || [])]
      .filter((t) => {
        if (!isStudent) {
          return false;
        }
        if (t.assignee === AssigneeEnum.Teacher) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseData?.tests, search, statusFilter, isStudent]);

  if (!courseData) return <PageLoader />;

  const toggleLoading = isOpen || isClose;

  const handleToggle = (t: ITest) => {
    if (t.status === TestStatusEnum.Draft) openTest({ id: t.id });
    else closeTest({ id: t.id });
    setModals((m) => ({ ...m, toggleStatus: false }));
  };

  return (
    <PageLayout
      title={`Курс: ${courseData.name}`}
      description={courseData.description}
      headerRest={
        <Breadcrumbs>
          <Anchor component={Link} to="/">
            Курсы
          </Anchor>
          <Anchor>{courseData.name}</Anchor>
        </Breadcrumbs>
      }
    >
      <VisibleForRole role={UserRoleEnum.Teacher}>
        <Group justify="space-between" mb="md">
          <TestFilterBar
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />
          <Button onClick={() => setModals((m) => ({ ...m, create: true }))}>
            Создать тест
          </Button>
        </Group>
      </VisibleForRole>

      {!!recomendedTests.length && (
        <Stack mb="xl">
          <Title order={3}>Рекомендации</Title>
          <TestRecommendedList
            tests={recomendedTests}
            courseData={courseData}
          />
        </Stack>
      )}

      <Stack>
        <Title order={3}>Основные тесты</Title>
        <TestList
          tests={tests}
          courseData={courseData}
          onEdit={(t) => {
            setSelectedTest(t);
            setModals((m) => ({ ...m, edit: true }));
          }}
          onDelete={(t) => {
            setSelectedTest(t);
            setModals((m) => ({ ...m, delete: true }));
          }}
          onToggleStatus={(t) => {
            setSelectedTest(t);
            setModals((m) => ({ ...m, toggleStatus: true }));
          }}
          toggleLoading={toggleLoading}
        />
      </Stack>

      {/* Модалки */}
      <CreateTestModal
        courseId={courseId}
        opened={modals.create}
        onClose={() => setModals((m) => ({ ...m, create: false }))}
        onSuccess={refresh}
      />

      <EditTestModal
        testData={selectedTest || undefined}
        opened={modals.edit}
        onClose={() => setModals((m) => ({ ...m, edit: false }))}
        onSuccess={refresh}
      />

      <DeleteTestModal
        id={selectedTest?.id ?? -1}
        opened={modals.delete}
        onClose={() => setModals((m) => ({ ...m, delete: false }))}
        onSuccess={refresh}
      />

      <ConfirmationModal
        opened={modals.toggleStatus}
        isLoading={toggleLoading}
        title={
          <ModalTitle>{`${
            selectedTest?.status === TestStatusEnum.Draft
              ? "Открыть"
              : "Закрыть"
          } тест?`}</ModalTitle>
        }
        body={`Вы уверены, что хотите ${
          selectedTest?.status === TestStatusEnum.Draft ? "открыть" : "закрыть"
        } этот тест?`}
        onSubmit={() => selectedTest && handleToggle(selectedTest)}
        onClose={() => setModals((m) => ({ ...m, toggleStatus: false }))}
      />
    </PageLayout>
  );
};

export default CoursePage;
