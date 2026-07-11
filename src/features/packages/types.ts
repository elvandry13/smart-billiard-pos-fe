import type { PaginatedResponse } from '@/types/api';
import type { DayType } from '@/types/domain';

export type PackageType = 'fixed' | 'duration' | 'time_window';

export interface Package {
  id: number | string;
  name: string;
  type: PackageType;
  duration_minutes?: number | null;
  fixed_price?: string | null;
  price_per_minute?: string | null;
  valid_day_type?: DayType | null;
  specific_date?: string | null;
  valid_start_time?: string | null;
  valid_end_time?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PackageListParams {
  page?: number;
  search?: string;
  ordering?: string;
  type?: PackageType;
  valid_day_type?: DayType;
  is_active?: boolean;
}

export interface CreatePackageRequest {
  name: string;
  type: PackageType;
  duration_minutes?: number | null;
  fixed_price?: string | null;
  price_per_minute?: string | null;
  valid_day_type?: DayType | null;
  specific_date?: string | null;
  valid_start_time?: string | null;
  valid_end_time?: string | null;
  is_active?: boolean;
}

export interface UpdatePackageRequest {
  name?: string;
  type?: PackageType;
  duration_minutes?: number | null;
  fixed_price?: string | null;
  price_per_minute?: string | null;
  valid_day_type?: DayType | null;
  specific_date?: string | null;
  valid_start_time?: string | null;
  valid_end_time?: string | null;
  is_active?: boolean;
}

export type PackageListResponse = PaginatedResponse<Package>;
