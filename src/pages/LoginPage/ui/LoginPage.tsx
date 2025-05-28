import { Container } from "@mantine/core";

import { LoginForm } from "@/features/auth/Login";

const LoginPage = () => {
  return (
    <Container size="md" py="xl">
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
