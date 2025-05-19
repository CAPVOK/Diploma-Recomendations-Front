// features/auth/model/auth.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import { userApi } from "../api/user.api";
import { setUserCoursesReducer } from "@/entities/course";
import { logoutReducer, setCredentialsReducer } from "@/entities/auth";
import { jwtStorage } from "@/shared/lib/helpers";

// Попытка восстановить авторизацию при старте
export const getMeThunk = createAsyncThunk<void>(
  "user/restore",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = jwtStorage.getAccessToken();
      if (!token) {
        jwtStorage.clear();
        dispatch(logoutReducer());
        return;
      }

      const data = await userApi.getMe();
      // сохраняем
      dispatch(setUserCoursesReducer(data.courses));
      dispatch(setCredentialsReducer({ user: data }));
    } catch {
      dispatch(setUserCoursesReducer([]));
      jwtStorage.clear();
      dispatch(logoutReducer());
      return rejectWithValue("Не удалось восстановить сессию");
    }
  }
);
