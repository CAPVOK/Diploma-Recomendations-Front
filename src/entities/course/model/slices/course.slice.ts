import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICourse } from "../types/course.types";

interface ICourseState {
  userCourses: ICourse[] | null;
  allCourses: ICourse[] | null;
}

const initialState: ICourseState = {
  userCourses: null,
  allCourses: null,
};

export const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setUserCoursesReducer: (state, action: PayloadAction<ICourse[]>) => {
      state.userCourses = action.payload;
    },
    setAllCoursesReducer: (state, action: PayloadAction<ICourse[]>) => {
      state.allCourses = action.payload;
    },
  },
});

export const { setUserCoursesReducer, setAllCoursesReducer } =
  courseSlice.actions;
