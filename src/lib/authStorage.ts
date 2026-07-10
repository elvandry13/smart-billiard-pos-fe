const ACCESS_TOKEN_KEY = 'smart_billiard_pos_access_token';
const REFRESH_TOKEN_KEY = 'smart_billiard_pos_refresh_token';

export const authStorage = {
  getAccessToken: () => window.localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => window.localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: ({ access, refresh }: { access: string; refresh: string }) => {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};