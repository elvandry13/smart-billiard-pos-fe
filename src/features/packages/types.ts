import type { PaginatedResponse } from '@/types/api';

export type PackageType = 'per_minute' | 'fixed_duration' | 'open_loss' | 'happy_hour';

export type ValidDayType = 'all' | 'weekday' | 'weekend' | 'specific_day';

export interface Package {
  id: number | string;
  outlet: number;
  name: string;
  type: PackageType;
  duration_minutes?: number | null;
  fixed_price?: string | null;
  price_per_minute?: string | null;
  valid_day_type?: ValidDayType | null;
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
  valid_day_type?: ValidDayType;
  is_active?: boolean;
}

export interface CreatePackageRequest {
  name: string;
  type: PackageType;
  duration_minutes?: number | null;
  fixed_price?: string | null;
  price_per_minute?: string | null;
  valid_day_type?: ValidDayType | null;
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
  valid_day_type?: ValidDayType | null;
  specific_date?: string | null;
  valid_start_time?: string | null;
  valid_end_time?: string | null;
  is_active?: boolean;
}

export type PackageListResponse = PaginatedResponse<Package>;
