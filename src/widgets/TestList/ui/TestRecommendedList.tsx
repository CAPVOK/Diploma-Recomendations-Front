import React from "react";
import { Stack, Text } from "@mantine/core";
import { ITest, TestRecCard } from "@/entities/test";

interface TestListProps {
  tests: ITest[];
  courseData: {
    id: number;
    name: string;
  };
}

export const TestRecommendedList: React.FC<TestListProps> = ({
  tests,
  courseData,
}) => {
  if (!tests.length) {
    return <Text c="dimmed">Тестов пока нет.</Text>;
  }

  return (
    <Stack gap="md">
      {tests.map((t) => (
        <TestRecCard
          key={t.id}
          test={t}
          courseData={courseData}
        />
      ))}
    </Stack>
  );
};
