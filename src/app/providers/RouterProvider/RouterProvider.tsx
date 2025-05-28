// src/app/providers/RouterProvider/router.ts
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RoutesEnum } from "@/shared/lib/consts";

import { ProtectedRoute } from "./ProtectedRoute";
import { lazy } from "react";
import { AppLayout } from "@/widgets/AppLayout";
import { UserRoleEnum } from "@/entities/user";

const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const CoursePage = lazy(() => import("@/pages/CoursePage"));
const BankPage = lazy(() => import("@/pages/BankPage"));
const TestPage = lazy(() => import("@/pages/TestPage"));

const appRouter = createBrowserRouter([
  {
    children: [
      // ————— Гостевые страницы (только для НЕавторизованных)
      {
        element: <ProtectedRoute guestOnly redirectTo={RoutesEnum.Home} />,
        children: [
          { path: RoutesEnum.Login, element: <LoginPage /> },
          { path: RoutesEnum.Register, element: <RegisterPage /> },
        ],
      },

      // ————— Приватные страницы (только для авторизованных)
      {
        element: (
          <ProtectedRoute requireAuth redirectTo={RoutesEnum.Login}>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <HomePage /> },
          { path: RoutesEnum.CourseById, element: <CoursePage /> },
        ],
      },
      {
        element: (
          <ProtectedRoute
            requireAuth
            redirectTo={RoutesEnum.Home}
            unauthorizedRedirect={RoutesEnum.Home}
            allowedRoles={[UserRoleEnum.Teacher]}
          >
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [{ path: RoutesEnum.Bank, element: <BankPage /> }],
      },
      {
        element: (
          <ProtectedRoute
            requireAuth
            redirectTo={RoutesEnum.Home}
            unauthorizedRedirect={RoutesEnum.Home}
            allowedRoles={[UserRoleEnum.Student]}
          >
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [{ path: RoutesEnum.TestById, element: <TestPage /> }],
      },
    ],
  },
  // любой несуществующий путь
  { path: "*", element: <NotFoundPage /> },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={appRouter} />;
};
