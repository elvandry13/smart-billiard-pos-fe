import type { PaginatedResponse } from '@/types/api';
import type { TableStatus } from '@/types/domain';

export interface TableType {
  id: number | string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Table {
  id: number | string;
  table_type: TableType | number | string;
  number: string;
  status: TableStatus;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TableTypeListParams {
  page?: number;
  search?: string;
  ordering?: string;
  is_active?: boolean;
}

export interface TableListParams {
  page?: number;
  search?: string;
  ordering?: string;
  table_type?: number | string;
  status?: TableStatus;
  is_active?: boolean;
}

export interface CreateTableTypeRequest {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateTableTypeRequest {
  name?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface CreateTableRequest {
  table_type: number | string;
  number: string;
  status?: TableStatus;
  is_active?: boolean;
}

export interface UpdateTableRequest {
  table_type?: number | string;
  number?: string;
  status?: TableStatus;
  is_active?: boolean;
}

export type TableTypeListResponse = PaginatedResponse<TableType>;
export type TableListResponse = PaginatedResponse<Table>;
