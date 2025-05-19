import { Text } from "@mantine/core";
import { PropsWithChildren } from "react";

export const ModalTitle = ({ children }: PropsWithChildren) => {
  return <Text fw={500}>{children}</Text>;
};
