import { useLogout } from "@/features/auth/Logout";
import { RoutesEnum } from "@/shared/lib/consts";
import { AppShell, Burger, Button, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { IconSchool } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const [opened, { toggle }] = useDisclosure();

  const { logout } = useLogout();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Group gap="xs" align="center">
              <IconSchool size={28} />
              <Text size="lg" fw={700}>
                КодОпрос
              </Text>
            </Group>
            <Group ml="xl" gap={0} visibleFrom="sm">
              <Button
                variant="transparent"
                component={Link}
                to={RoutesEnum.Home}
                c="dark"
              >
                Курсы
              </Button>
              <Button variant="transparent" c="red" onClick={logout}>
                Выйти
              </Button>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar py="md" px={4}>
        <Stack>
          <Button
            variant="light"
            component={Link}
            to={RoutesEnum.Home}
            onClick={toggle}
            c="dark"
          >
            Курсы
          </Button>
          <Button
            variant="light"
            c="dark"
            color="red"
            onClick={() => {
              logout();
              toggle();
            }}
          >
            Выйти
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children ? children : <Outlet />}</AppShell.Main>
    </AppShell>
  );
  /* return (
    <Container>
      <Group justify="space-between" py="lg" align="start">
        <Box id={"header-portal"}></Box>
        <LogoutButton />
      </Group>
      <Divider mb="lg" />
      {children ? children : <Outlet />}
    </Container>
  ); */
};
