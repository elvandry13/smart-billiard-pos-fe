import { apiClient } from '@/lib/apiClient';

import type {
  CreateTableTypeRequest,
  TableType,
  TableTypeListParams,
  TableTypeListResponse,
  UpdateTableTypeRequest,
  CreateTableRequest,
  Table,
  TableListParams,
  TableListResponse,
  UpdateTableRequest,
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

export const listTableTypesApi = async (params?: TableTypeListParams): Promise<TableTypeListResponse> => {
  const response = await apiClient<TableTypeListResponse | TableType[]>(`/table-types/${buildQuery(params as Record<string, unknown>)}`);
  return normalizeListResponse(response);
};

export const getTableTypeApi = (id: number | string): Promise<TableType> => {
  return apiClient<TableType>(`/table-types/${id}/`);
};

export const createTableTypeApi = (payload: CreateTableTypeRequest): Promise<TableType> => {
  return apiClient<TableType>('/table-types/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateTableTypeApi = (id: number | string, payload: UpdateTableTypeRequest): Promise<TableType> => {
  return apiClient<TableType>(`/table-types/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteTableTypeApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/table-types/${id}/`, {
    method: 'DELETE',
  });
};

export const listTablesApi = async (params?: TableListParams): Promise<TableListResponse> => {
  const response = await apiClient<TableListResponse | Table[]>(`/tables/${buildQuery(params as Record<string, unknown>)}`);
  return normalizeListResponse(response);
};

export const getTableApi = (id: number | string): Promise<Table> => {
  return apiClient<Table>(`/tables/${id}/`);
};

export const createTableApi = (payload: CreateTableRequest): Promise<Table> => {
  return apiClient<Table>('/tables/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateTableApi = (id: number | string, payload: UpdateTableRequest): Promise<Table> => {
  return apiClient<Table>(`/tables/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteTableApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/tables/${id}/`, {
    method: 'DELETE',
  });
};
