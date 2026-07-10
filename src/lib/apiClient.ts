export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export interface ApiClientConfig extends RequestInit {
  token?: string;
}

export async function apiClient<T>(path: string, config: ApiClientConfig = {}): Promise<T> {
  const { token, headers, ...requestConfig } = config;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestConfig,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}