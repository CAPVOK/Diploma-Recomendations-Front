// src/widgets/TestList.tsx
import React from "react";
import { Stack, Text } from "@mantine/core";
import { ITest, TestCard } from "@/entities/test";

interface TestListProps {
  tests: ITest[];
  courseData: {
    id: number;
    name: string;
  };
  onEdit: (t: ITest) => void;
  onDelete: (t: ITest) => void;
  onToggleStatus: (t: ITest) => void;
  toggleLoading: boolean;
}

export const TestList: React.FC<TestListProps> = ({
  tests,
  courseData,
  onEdit,
  onDelete,
  onToggleStatus,
  toggleLoading,
}) => {
  if (!tests.length) {
    return <Text c="dimmed">Тестов пока нет.</Text>;
  }

  return (
    <Stack gap="md">
      {tests.map((t) => (
        <TestCard
          key={t.id}
          test={t}
          courseData={courseData}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          toggleLoading={toggleLoading}
        />
      ))}
    </Stack>
  );
};
