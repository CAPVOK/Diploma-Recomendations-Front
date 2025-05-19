import { Center, Loader } from "@mantine/core";

export const PageLoader = () => {
  return (
    <Center mih="100vh">
      <Loader color="blue" size="xl" type="dots" />
    </Center>
  );
};
