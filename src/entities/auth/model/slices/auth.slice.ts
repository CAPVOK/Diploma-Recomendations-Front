import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUser } from "@/entities/user";

interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentialsReducer: (state, action: PayloadAction<{ user: IUser }>) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
    },
    logoutReducer: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentialsReducer, logoutReducer } = authSlice.actions;
