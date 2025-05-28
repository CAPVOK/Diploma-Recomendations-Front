import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  courseApi,
  setAllCoursesReducer,
  setUserCoursesReducer,
} from "@/entities/course";
import { userApi } from "@/entities/user";

export const getAllCoursesThunk = createAsyncThunk<void>(
  "course/getAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await courseApi.getCourses();
      // сохраняем
      dispatch(setAllCoursesReducer(data));
    } catch {
      dispatch(setAllCoursesReducer([]));
      return rejectWithValue("Не удалось получить курсы");
    }
  }
);

export const getUserCoursesThunk = createAsyncThunk<void>(
  "course/getUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const data = await userApi.getMe();
      // сохраняем
      dispatch(setUserCoursesReducer(data.courses));
    } catch {
      dispatch(setUserCoursesReducer([]));
      return rejectWithValue("Не удалось получить курсы");
    }
  }
);
