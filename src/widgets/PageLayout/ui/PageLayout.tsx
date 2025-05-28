import { Stack, Title, Text, Box } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";

interface IPageLayoutProps extends PropsWithChildren {
  title: string;
  description?: string;
  headerRest?: ReactNode;
}

export const PageLayout = ({
  title,
  description,
  children,
  headerRest,
}: IPageLayoutProps) => {
  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Stack gap={"xs"}>
          <Title order={1} lh={1}>
            {title}
          </Title>
          {description && <Text size="md">{description}</Text>}
        </Stack>
        {headerRest}
      </Stack>
      <Box flex={1}>{children}</Box>
    </Stack>
  );
};
