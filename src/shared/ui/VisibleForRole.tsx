import { UserRoleEnum } from "@/entities/user";
import { PropsWithChildren } from "react";

import { useAppSelector } from "../config/store";

interface IVisibleForRoleProps extends PropsWithChildren {
  role: UserRoleEnum;
}

export const VisibleForRole = ({ children, role }: IVisibleForRoleProps) => {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  return userRole === role ? <>{children}</> : null;
};
