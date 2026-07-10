import type { Role } from '@/types/auth';

export interface ScopedEntitySummary {
  id: number | string;
  name?: string | null;
  code?: string | null;
  [key: string]: unknown;
}

export interface UserProfile {
  id: number | string;
  username: string;
  email?: string | null;
  phone?: string | null;
  role: Role;
  tenant?: ScopedEntitySummary | null;
  outlet?: ScopedEntitySummary | null;
  first_name?: string | null;
  last_name?: string | null;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface UpdateProfileRequest {
  email?: string;
  phone?: string | null;
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export type UpdateProfileResponse = UserProfile;