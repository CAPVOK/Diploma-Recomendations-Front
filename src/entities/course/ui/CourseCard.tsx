import { RoutesEnum } from "@/shared/lib/consts";
import { getRoute } from "@/shared/lib/helpers";
import { Group, Stack, Anchor, Text, Card } from "@mantine/core";
import { Link } from "react-router-dom";
import { ICourse } from "../model";

import { ReactNode } from "react";

interface ICourseCardProps {
  course: ICourse;
  manageButtons: ReactNode;
}

export const CourseCard = ({ course, manageButtons }: ICourseCardProps) => {
  return (
    <Card /* shadow="xs" radius="md" p="xl" */ withBorder>
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
        {manageButtons}
      </Group>
    </Card>
  );
};
