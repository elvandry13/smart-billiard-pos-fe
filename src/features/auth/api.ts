import { apiClient } from '@/lib/apiClient';

import type {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './types';

export const loginApi = (payload: LoginRequest): Promise<LoginResponse> => {
  return apiClient<LoginResponse>('/auth/login/', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: JSON.stringify(payload),
  });
};

export const refreshTokenApi = (payload: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  return apiClient<RefreshTokenResponse>('/auth/refresh/', {
    method: 'POST',
    auth: false,
    skipRefresh: true,
    body: JSON.stringify(payload),
  });
};

export const logoutApi = (payload: LogoutRequest): Promise<void> => {
  return apiClient<void>('/auth/logout/', {
    method: 'POST',
    skipRefresh: true,
    body: JSON.stringify(payload),
  });
};