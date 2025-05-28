// src/pages/TestPage/TestPage.tsx
import { ResultStatusEnum, testApi } from "@/entities/test";
import { RoutesEnum } from "@/shared/lib/consts";
import { useMutation } from "@/shared/lib/hooks";
import { PageLayout } from "@/widgets/PageLayout";
import { PageLoader } from "@/widgets/PageLoader";
import { Anchor, Breadcrumbs, Button, Center } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { TestRunner } from "@/features/test/TestRunner/ui/TestRunner";

const TestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  /* загрузка теста */
  const [getTest, { data: testData, isLoading }] = useMutation(
    testApi.getTestById
  );
  const [started, setStarted] = useState(false);

  /* useEffect(() => {
    if (!testData) return;
    if (testData.result.status === ResultStatusEnum.InProgress) {
      setStarted(true);
    }
  }, [testData]); */

  useEffect(() => {
    if (id) getTest({ id: +id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !testData) return <PageLoader />;

  const handleBegin = async () => {
    await testApi.beginTest({ id: +id! });
    setStarted(true);
  };
  const handleContinue = () => {
    setStarted(true);
  };

  const handleFinish = (progress: number) => {
    notifications.show({
      title: "Тест завершён",
      message: `Ваш результат: ${progress}%`,
      color: "green",
    });
    navigate(state.from?.id ?? RoutesEnum.Home, { replace: true });
    setStarted(false);
  };

  const isTestInProgress =
    testData.result.status === ResultStatusEnum.InProgress;

  return (
    <PageLayout
      title={`Тест: ${testData.name}`}
      description={testData.description}
      headerRest={
        <Breadcrumbs>
          <Anchor component={Link} to={RoutesEnum.Home}>
            Курсы
          </Anchor>
          {state?.from && (
            <Anchor component={Link} to={state.from?.id}>
              {state.from?.name}
            </Anchor>
          )}
          <Anchor>{testData.name}</Anchor>
        </Breadcrumbs>
      }
    >
      {!started ? (
        <Center mt={"20vh"}>
          <Button
            size="lg"
            onClick={isTestInProgress ? handleContinue : handleBegin}
          >
            {isTestInProgress ? "Продолжить" : "Пройти тест"}
          </Button>
        </Center>
      ) : (
        <TestRunner
          testId={+id!}
          questions={testData.questions}
          onFinish={handleFinish}
        />
      )}
    </PageLayout>
  );
};

export default TestPage;
