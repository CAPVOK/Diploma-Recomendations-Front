import { Button, Container, Group, Text, Title } from "@mantine/core";
import classes from "./NotFound.module.css";
import { Link } from "react-router-dom";
import { RoutesEnum } from "@/shared/lib/consts";

const NotFoundPage = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Вы нашли секретное место.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        К сожалению, это всего лишь страница 404. Возможно, вы ошиблись в адресе
        или страница была перемещена по другому URL.
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          component={Link}
          to={RoutesEnum.Home}
        >
          Вернуться на главную
        </Button>
      </Group>
    </Container>
  );
};

export default NotFoundPage;
