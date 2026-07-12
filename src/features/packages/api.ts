import { apiClient } from '@/lib/apiClient';

import type {
  Package,
  PackageListParams,
  PackageListResponse,
  CreatePackageRequest,
  UpdatePackageRequest,
} from './types';

import type { PaginatedResponse } from '@/types/api';

const buildQuery = (params?: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

const normalizeListResponse = <T>(response: PaginatedResponse<T> | T[]): PaginatedResponse<T> => {
  if (Array.isArray(response)) {
    return {
      count: response.length,
      next: null,
      previous: null,
      results: response,
    };
  }

  return response;
};

export const listPackagesApi = async (params?: PackageListParams): Promise<PackageListResponse> => {
  const response = await apiClient<PackageListResponse | Package[]>(`/packages/${buildQuery(params as Record<string, unknown>)}`);
  return normalizeListResponse(response);
};

export const getPackageApi = (id: number | string): Promise<Package> => {
  return apiClient<Package>(`/packages/${id}/`);
};

export const createPackageApi = (payload: CreatePackageRequest): Promise<Package> => {
  return apiClient<Package>('/packages/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updatePackageApi = (id: number | string, payload: UpdatePackageRequest): Promise<Package> => {
  return apiClient<Package>(`/packages/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deletePackageApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/packages/${id}/`, {
    method: 'DELETE',
  });
};