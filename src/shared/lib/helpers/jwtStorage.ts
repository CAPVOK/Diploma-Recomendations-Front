import { localStorageKeys } from "../consts";

export const jwtStorage = {
  getAccessToken: () => localStorage.getItem(localStorageKeys.ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(localStorageKeys.REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem(localStorageKeys.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(localStorageKeys.REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN_KEY);
    localStorage.removeItem(localStorageKeys.REFRESH_TOKEN_KEY);
  },
};
