import type { PaginatedResponse } from '@/types/api';
import type { Role } from '@/types/auth';
import type { ScopedEntitySummary } from '@/features/profile/types';

export interface User {
  id: number | string;
  username: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
  tenant?: ScopedEntitySummary | null;
  outlet?: ScopedEntitySummary | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active: boolean;
  date_joined?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserListParams {
  page?: number;
  search?: string;
  ordering?: string;
  role?: Role;
  tenant?: number | string;
  outlet?: number | string;
  is_active?: boolean;
}

export interface CreateUserRequest {
  username: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
  password: string;
  tenant?: number | string | null;
  outlet?: number | string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string | null;
  phone?: string | null;
  role?: Role;
  tenant?: number | string | null;
  outlet?: number | string | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
}

export type UserListResponse = PaginatedResponse<User>;
