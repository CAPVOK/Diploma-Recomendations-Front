import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { logoutReducer } from "@/entities/auth";
import { RoutesEnum } from "@/shared/lib/consts";
import { jwtStorage } from "@/shared/lib/helpers";
import { useAppDispatch } from "@/shared/config/store";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    jwtStorage.clear();
    dispatch(logoutReducer());
    navigate(RoutesEnum.Login, { replace: true });
  }, [dispatch, navigate]);

  return { logout };
};
