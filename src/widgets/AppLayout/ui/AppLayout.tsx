import { LogoutButton } from "@/features/auth/Logout";
import { Box, Container, Divider, Group } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";

export const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <Container>
      <Group justify="space-between" py="lg" align="start">
        <Box id={"header-portal"}></Box>
        <LogoutButton />
      </Group>
      <Divider mb="lg" />
      {children ? children : <Outlet />}
    </Container>
  );
};
