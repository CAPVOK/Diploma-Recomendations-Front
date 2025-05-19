import { combineReducers } from "@reduxjs/toolkit";

import { authSlice } from "@/entities/auth";
import { courseSlice } from "@/entities/course";

export const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [courseSlice.name]: courseSlice.reducer,
});
