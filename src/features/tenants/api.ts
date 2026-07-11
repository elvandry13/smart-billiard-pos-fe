import { apiClient } from '@/lib/apiClient';

import type {
  CreateTenantRequest,
  Tenant,
  TenantListParams,
  TenantListResponse,
  UpdateTenantRequest,
} from './types';

export const listTenantsApi = (params?: TenantListParams): Promise<TenantListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.ordering) {
    searchParams.set('ordering', params.ordering);
  }

  if (params?.is_active !== undefined) {
    searchParams.set('is_active', String(params.is_active));
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/tenants/?${queryString}` : '/tenants/';

  return apiClient<TenantListResponse>(path);
};

export const getTenantApi = (id: number | string): Promise<Tenant> => {
  return apiClient<Tenant>(`/tenants/${id}/`);
};

export const createTenantApi = (payload: CreateTenantRequest): Promise<Tenant> => {
  return apiClient<Tenant>('/tenants/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateTenantApi = (id: number | string, payload: UpdateTenantRequest): Promise<Tenant> => {
  return apiClient<Tenant>(`/tenants/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteTenantApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/tenants/${id}/`, {
    method: 'DELETE',
  });
};
