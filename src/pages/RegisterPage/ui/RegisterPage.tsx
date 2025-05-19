import { Container } from "@mantine/core";

import { RegisterForm } from "@/features/auth/Register";

const RegisterPage = () => {
  return (
    <Container size="xs" py="xl">
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
