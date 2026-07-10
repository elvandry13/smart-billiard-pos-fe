import type { AuthTokens, TokenRefreshPair } from '@/types/auth';

export type { AuthTokens, Role, TokenRefreshPair } from '@/types/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse extends AuthTokens {
  user?: unknown;
  detail?: string;
  [key: string]: unknown;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse extends TokenRefreshPair {
  refresh?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface LogoutRequest {
  refresh: string;
}
