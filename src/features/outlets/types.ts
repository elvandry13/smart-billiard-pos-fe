import type { PaginatedResponse } from '@/types/api';
import type { ScopedEntitySummary } from '@/features/profile/types';

export interface Outlet {
  id: number | string;
  code: string;
  tenant: ScopedEntitySummary;
  name: string;
  address?: string | null;
  timezone?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OutletListParams {
  page?: number;
  search?: string;
  ordering?: string;
  tenant?: number | string;
  is_active?: boolean;
}

export interface CreateOutletRequest {
  code: string;
  tenant: number | string;
  name: string;
  address?: string | null;
  timezone?: string | null;
  is_active?: boolean;
}

export interface UpdateOutletRequest {
  code?: string;
  tenant?: number | string;
  name?: string;
  address?: string | null;
  timezone?: string | null;
  is_active?: boolean;
}

export type OutletListResponse = PaginatedResponse<Outlet>;
