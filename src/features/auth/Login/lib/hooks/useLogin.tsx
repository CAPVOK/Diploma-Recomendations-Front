import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import { authApi, setCredentialsReducer } from "@/entities/auth";
import { RoutesEnum } from "@/shared/lib/consts";
import { jwtStorage } from "@/shared/lib/helpers";
import { executeWithCallbacks } from "@/shared/lib/helpers";

import { ILoginFormSchema } from "../../model";
import { useAppDispatch } from "@/shared/config/store";

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const login = useCallback(
    (values: ILoginFormSchema) => {
      setError(null);
      setLoading(true);

      executeWithCallbacks(authApi.login(values), {
        onSuccess: (data) => {
          jwtStorage.setTokens(data.accessToken, data.refreshToken);
          dispatch(setCredentialsReducer({ user: data.user }));

          const from = location.state?.from || RoutesEnum.Home;
          navigate(from, { replace: true });
        },
        onError: (err) => setError(err.message),
        onFinally: () => setLoading(false),
      });
    },
    [dispatch, navigate, location.state],
  );

  return { login, error, isLoading };
}
