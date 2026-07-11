import { apiClient } from '@/lib/apiClient';

import type {
  CreateOutletRequest,
  Outlet,
  OutletListParams,
  OutletListResponse,
  UpdateOutletRequest,
} from './types';

export const listOutletsApi = (params?: OutletListParams): Promise<OutletListResponse> => {
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

  if (params?.tenant) {
    searchParams.set('tenant', String(params.tenant));
  }

  if (params?.is_active !== undefined) {
    searchParams.set('is_active', String(params.is_active));
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/outlets/?${queryString}` : '/outlets/';

  return apiClient<OutletListResponse>(path);
};

export const getOutletApi = (id: number | string): Promise<Outlet> => {
  return apiClient<Outlet>(`/outlets/${id}/`);
};

export const createOutletApi = (payload: CreateOutletRequest): Promise<Outlet> => {
  return apiClient<Outlet>('/outlets/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateOutletApi = (id: number | string, payload: UpdateOutletRequest): Promise<Outlet> => {
  return apiClient<Outlet>(`/outlets/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteOutletApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/outlets/${id}/`, {
    method: 'DELETE',
  });
};
