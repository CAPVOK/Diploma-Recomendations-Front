import React, { PropsWithChildren } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { UserRoleEnum } from "@/entities/user";
import { RoutesEnum } from "@/shared/lib/consts";
import { useAppSelector } from "@/shared/config/store";

interface IProtectedRouteProps {
  /** Доступ только авторизованным (true) */
  requireAuth?: boolean;
  /** Доступ только НЕавторизованным (true) — гостевые страницы */
  guestOnly?: boolean;
  /** Список ролей, которым разрешён доступ */
  allowedRoles?: UserRoleEnum[];
  /** Куда редиректить, если условие не выполнено */
  redirectTo: string;
  /** Куда редиректить, если пользователь авторизован, но нет нужной роли */
  unauthorizedRedirect?: string;
}

export const ProtectedRoute: React.FC<
  PropsWithChildren<IProtectedRouteProps>
> = ({
  children,
  requireAuth = false,
  guestOnly = false,
  allowedRoles,
  redirectTo,
  unauthorizedRedirect = RoutesEnum.Home,
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const role = user?.role;

  // 1) Если требуем гостевой доступ, но юзер уже аутентифицирован
  if (guestOnly && isAuthenticated) {
    console.log("ProtectedRoute: case 1");
    return <Navigate to={redirectTo} replace />;
  }

  // 2) Если требуем аутентификацию, но юзер не аутентифицирован
  if (requireAuth && !isAuthenticated) {
    console.log("ProtectedRoute: case 2");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3) Если указаны роли, но роль пользователя не среди них
  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    console.log("ProtectedRoute: case 3");
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  // 4) Всё ок — рендерим вложенные маршруты
  return children ? <>{children}</> : <Outlet />;
};
