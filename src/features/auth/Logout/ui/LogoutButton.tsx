import { Button } from "@mantine/core";
import { useLogout } from "../lib";

export const LogoutButton = () => {
  const { logout } = useLogout();
  return (
    <Button
      variant="outline"
      color="red"
      size="xs"
      onClick={logout}
    >
      Выйти
    </Button>
  );
};
