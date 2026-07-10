import { authStorage } from './authStorage';
import { ApiError } from './errors';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export interface ApiClientConfig extends RequestInit {
  auth?: boolean;
  skipRefresh?: boolean;
  token?: string;
}

export const AUTH_SESSION_EXPIRED_EVENT = 'smart-billiard-pos:auth-session-expired';

let refreshPromise: Promise<string | null> | null = null;

const buildUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const createHeaders = (headers: HeadersInit | undefined, token: string | null): Headers => {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  return requestHeaders;
};

const notifySessionExpired = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
};

const clearAuthSession = () => {
  authStorage.clearTokens();
  notifySessionExpired();
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    clearAuthSession();
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = fetch(buildUrl('/auth/refresh/'), {
      method: 'POST',
      headers: createHeaders(undefined, null),
      body: JSON.stringify({ refresh: refreshToken }),
    })
      .then(async (response) => {
        const payload = await parseResponseBody(response);

        if (!response.ok) {
          throw new ApiError(response.status, payload);
        }

        const tokens = payload as { access?: unknown; refresh?: unknown } | undefined;

        if (typeof tokens?.access !== 'string') {
          throw new ApiError(response.status, payload, 'Response refresh token tidak valid.');
        }

        const nextRefreshToken = typeof tokens.refresh === 'string' ? tokens.refresh : refreshToken;
        authStorage.setTokens({ access: tokens.access, refresh: nextRefreshToken });

        return tokens.access;
      })
      .catch((error: unknown) => {
        clearAuthSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

async function request<T>(path: string, config: ApiClientConfig, hasRetried: boolean): Promise<T> {
  const { auth = true, skipRefresh = false, token, headers, ...requestConfig } = config;
  const accessToken = auth ? (token ?? authStorage.getAccessToken()) : null;

  const response = await fetch(buildUrl(path), {
    ...requestConfig,
    headers: createHeaders(headers, accessToken),
  });

  const responseBody = await parseResponseBody(response);

  if (response.status === 401 && auth && !skipRefresh && !hasRetried) {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      return request<T>(path, { ...config, token: nextAccessToken }, true);
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, responseBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return responseBody as T;
}

export async function apiClient<T>(path: string, config: ApiClientConfig = {}): Promise<T> {
  return request<T>(path, config, false);
}