import { Group, Select, TextInput } from "@mantine/core";
import { TestStatusEnum } from "@/entities/test";
import React from "react";

export interface TestFilterBarProps {
  search: string;
  status: TestStatusEnum | null;
  onSearchChange: (s: string) => void;
  onStatusChange: (s: TestStatusEnum | null) => void;
}

export const TestFilterBar: React.FC<TestFilterBarProps> = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}) => (
  <Group>
    <Select
      placeholder="Все статусы"
      data={[
        { value: TestStatusEnum.Draft, label: "Черновики" },
        { value: TestStatusEnum.Progress, label: "Идёт" },
        { value: TestStatusEnum.Ended, label: "Завершённые" },
      ]}
      value={status}
      onChange={(v) => onStatusChange(v as TestStatusEnum | null)}
      clearable
    />
    <TextInput
      placeholder="Поиск по названию…"
      value={search}
      onChange={(e) => onSearchChange(e.currentTarget.value)}
    />
  </Group>
);
