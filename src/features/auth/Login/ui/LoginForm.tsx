import {
  Alert,
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

import { RoutesEnum } from "@/shared/lib/consts";

import { useLogin } from "../lib";
import { ILoginFormSchema } from "../model";

export function LoginForm() {
  const form = useForm<ILoginFormSchema>({
    initialValues: { username: "", password: "" },
    validate: {
      username: (v) => (v.trim() ? null : "Введите имя пользователя"),
      password: (v) => (v.trim() ? null : "Введите пароль"),
    },
  });

  const { login, error, isLoading } = useLogin();

  return (
    <Paper radius="md" p="xl" withBorder className="max-w-md mx-auto mt-8">
      <Title order={2} ta="center" mt="md" mb={50}>
        Вход в систему
      </Title>

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(login)}>
        <Stack>
          <TextInput
            required
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            {...form.getInputProps("username")}
            radius="md"
          />

          <PasswordInput
            required
            label="Пароль"
            placeholder="Введите пароль"
            {...form.getInputProps("password")}
            radius="md"
          />

          <Button
            type="submit"
            radius="md"
            fullWidth
            mt="xl"
            loading={isLoading}
          >
            Войти
          </Button>

          <Text ta="center" mt="md">
            Нет аккаунта?{" "}
            <Anchor component={Link} to={RoutesEnum.Register} variant="link">
              Зарегистрироваться
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
