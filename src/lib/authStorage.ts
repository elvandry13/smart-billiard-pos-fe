import type { AuthTokens } from '../types/auth';

const ACCESS_TOKEN_KEY = 'smart_billiard_pos_access_token';
const REFRESH_TOKEN_KEY = 'smart_billiard_pos_refresh_token';

const getStorage = (): Storage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

const getItem = (key: string): string | null => getStorage()?.getItem(key) ?? null;

const setItem = (key: string, value: string) => {
  getStorage()?.setItem(key, value);
};

const removeItem = (key: string) => {
  getStorage()?.removeItem(key);
};

export const authStorage = {
  getAccessToken: (): string | null => getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => getItem(REFRESH_TOKEN_KEY),
  hasRefreshToken: (): boolean => Boolean(getItem(REFRESH_TOKEN_KEY)),
  setTokens: ({ access, refresh }: AuthTokens) => {
    setItem(ACCESS_TOKEN_KEY, access);
    setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: () => {
    removeItem(ACCESS_TOKEN_KEY);
    removeItem(REFRESH_TOKEN_KEY);
  },
};