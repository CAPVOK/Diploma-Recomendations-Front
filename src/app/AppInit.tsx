import { useEffect } from "react";

import { useAppDispatch } from "@/shared/config/store";
import { getMeThunk } from "@/entities/user";

export const AppInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // при старте приложения пробуем восстановить сессию
    dispatch(getMeThunk());
  }, [dispatch]);

  return <></>;
};
