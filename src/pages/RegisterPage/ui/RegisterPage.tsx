import { Container } from "@mantine/core";

import { RegisterForm } from "@/features/auth/Register";

const RegisterPage = () => {
  return (
    <Container size="md" py="xl">
      <RegisterForm />
    </Container>
  );
};

export default RegisterPage;
