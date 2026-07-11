import type { PaginatedResponse } from '@/types/api';

export interface Tenant {
  id: number | string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TenantListParams {
  page?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export interface CreateTenantRequest {
  name: string;
  is_active?: boolean;
}

export interface UpdateTenantRequest {
  name?: string;
  is_active?: boolean;
}

export type TenantListResponse = PaginatedResponse<Tenant>;
