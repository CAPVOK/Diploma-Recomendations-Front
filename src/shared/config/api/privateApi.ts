import axios from "axios";

import { setupInterceptors } from "./interceptors";

export const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(privateApi);
