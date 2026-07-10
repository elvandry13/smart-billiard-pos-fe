export type Role = 'super_admin' | 'owner' | 'admin' | 'officer';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TokenRefreshPair {
  access: string;
}
