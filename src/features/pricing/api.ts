import { apiClient } from '@/lib/apiClient';

import type {
  PricingRule,
  PricingRuleListParams,
  PricingRuleListResponse,
  CreatePricingRuleRequest,
  UpdatePricingRuleRequest,
  AdditionalFee,
  AdditionalFeeListParams,
  AdditionalFeeListResponse,
  CreateAdditionalFeeRequest,
  UpdateAdditionalFeeRequest,
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

export const listPricingRulesApi = async (params?: PricingRuleListParams): Promise<PricingRuleListResponse> => {
  const response = await apiClient<PricingRuleListResponse | PricingRule[]>(`/pricing-rules/${buildQuery(params as Record<string, unknown>)}`);
  return normalizeListResponse(response);
};

export const getPricingRuleApi = (id: number | string): Promise<PricingRule> => {
  return apiClient<PricingRule>(`/pricing-rules/${id}/`);
};

export const createPricingRuleApi = (payload: CreatePricingRuleRequest): Promise<PricingRule> => {
  return apiClient<PricingRule>('/pricing-rules/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updatePricingRuleApi = (id: number | string, payload: UpdatePricingRuleRequest): Promise<PricingRule> => {
  return apiClient<PricingRule>(`/pricing-rules/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deletePricingRuleApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/pricing-rules/${id}/`, {
    method: 'DELETE',
  });
};

export const listAdditionalFeesApi = async (params?: AdditionalFeeListParams): Promise<AdditionalFeeListResponse> => {
  const response = await apiClient<AdditionalFeeListResponse | AdditionalFee[]>(`/additional-fees/${buildQuery(params as Record<string, unknown>)}`);
  return normalizeListResponse(response);
};

export const getAdditionalFeeApi = (id: number | string): Promise<AdditionalFee> => {
  return apiClient<AdditionalFee>(`/additional-fees/${id}/`);
};

export const createAdditionalFeeApi = (payload: CreateAdditionalFeeRequest): Promise<AdditionalFee> => {
  return apiClient<AdditionalFee>('/additional-fees/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateAdditionalFeeApi = (id: number | string, payload: UpdateAdditionalFeeRequest): Promise<AdditionalFee> => {
  return apiClient<AdditionalFee>(`/additional-fees/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteAdditionalFeeApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/additional-fees/${id}/`, {
    method: 'DELETE',
  });
};
