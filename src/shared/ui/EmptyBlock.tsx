import { Center, Stack, Text } from "@mantine/core";
import { PropsWithChildren } from "react";

interface IEmptyBlockProps extends PropsWithChildren {
  message?: string;
  title?: string;
}

export const EmptyBlock = ({ children, message, title }: IEmptyBlockProps) => {
  return (
    <Center>
      <Stack gap="xs" align="center">
        {title && <Text>{title}</Text>}
        {message && <Text>{message}</Text>}
        {children}
      </Stack>
    </Center>
  );
};
