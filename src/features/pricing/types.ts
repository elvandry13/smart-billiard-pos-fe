import type { PaginatedResponse } from '@/types/api';
import type { DayType, AdditionalFeeType } from '@/types/domain';

export interface PricingRule {
  id: number | string;
  name: string;
  day_type: DayType;
  specific_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  price_per_minute: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdditionalFee {
  id: number | string;
  name: string;
  type: AdditionalFeeType;
  value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PricingRuleListParams {
  page?: number;
  search?: string;
  ordering?: string;
  day_type?: DayType;
  is_active?: boolean;
}

export interface AdditionalFeeListParams {
  page?: number;
  search?: string;
  ordering?: string;
  type?: AdditionalFeeType;
  is_active?: boolean;
}

export interface CreatePricingRuleRequest {
  name: string;
  day_type: DayType;
  specific_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  price_per_minute: string;
  is_active?: boolean;
}

export interface UpdatePricingRuleRequest {
  name?: string;
  day_type?: DayType;
  specific_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  price_per_minute?: string;
  is_active?: boolean;
}

export interface CreateAdditionalFeeRequest {
  name: string;
  type: AdditionalFeeType;
  value: string;
  is_active?: boolean;
}

export interface UpdateAdditionalFeeRequest {
  name?: string;
  type?: AdditionalFeeType;
  value?: string;
  is_active?: boolean;
}

export type PricingRuleListResponse = PaginatedResponse<PricingRule>;
export type AdditionalFeeListResponse = PaginatedResponse<AdditionalFee>;
