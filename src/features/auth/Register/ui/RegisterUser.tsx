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
import { IconAlertCircle } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { authApi } from "@/entities/auth";
import { RoutesEnum } from "@/shared/lib/consts/routes";
import { executeWithCallbacks } from "@/shared/lib/helpers";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    patronymic: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    executeWithCallbacks(authApi.register(formData), {
      onSuccess: () => {
        navigate(RoutesEnum.Login);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mt="md" mb={50}>
        Регистрация
      </Title>

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            required
            label="Имя пользователя"
            placeholder="Введите имя пользователя"
            name="username"
            value={formData.username}
            onChange={handleChange}
            radius="md"
          />

          <TextInput
            required
            label="Имя"
            placeholder="Введите имя"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            radius="md"
          />

          <TextInput
            required
            label="Фамилия"
            placeholder="Введите фамилию"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            radius="md"
          />

          <TextInput
            label="Отчество"
            placeholder="Введите отчество (необязательно)"
            name="patronymic"
            value={formData.patronymic}
            onChange={handleChange}
            radius="md"
          />

          <PasswordInput
            required
            label="Пароль"
            minLength={8}
            placeholder="Введите пароль"
            name="password"
            value={formData.password}
            onChange={handleChange}
            radius="md"
          />

          <Button type="submit" radius="md" fullWidth mt="xl">
            Зарегистрироваться
          </Button>

          <Text ta="center" mt="md">
            Уже есть аккаунт?{" "}
            <Anchor
              component={Link}
              to={RoutesEnum.Login}
              variant="link"
              className="cursor-pointer"
            >
              Войти
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};
