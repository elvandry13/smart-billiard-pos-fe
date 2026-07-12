import type { PaginatedResponse } from '@/types/api';
import type { TableStatus } from '@/types/domain';

export interface TableType {
  id: number | string;
  outlet?: number | string;
  name: string;
  description?: string | null;
  created_at?: string;
}

export interface Table {
  id: number | string;
  outlet?: number | string;
  table_type: number | string;
  name: string;
  status: TableStatus;
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
}

export interface UpdateTableTypeRequest {
  name?: string;
  description?: string | null;
}

export interface CreateTableRequest {
  name: string;
  table_type: number | string;
  status?: TableStatus;
}

export interface UpdateTableRequest {
  name?: string;
  table_type?: number | string;
  status?: TableStatus;
}

export type TableTypeListResponse = PaginatedResponse<TableType>;
export type TableListResponse = PaginatedResponse<Table>;
