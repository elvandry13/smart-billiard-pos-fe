import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPricingRuleApi,
  deletePricingRuleApi,
  listPricingRulesApi,
  updatePricingRuleApi,
  createAdditionalFeeApi,
  deleteAdditionalFeeApi,
  listAdditionalFeesApi,
  updateAdditionalFeeApi,
} from './api';

import type {
  CreatePricingRuleRequest,
  PricingRuleListParams,
  UpdatePricingRuleRequest,
  CreateAdditionalFeeRequest,
  AdditionalFeeListParams,
  UpdateAdditionalFeeRequest,
} from './types';

export const pricingRulesQueryKey = ['pricing-rules'] as const;

export const getPricingRulesQueryKey = (params?: PricingRuleListParams) => {
  return params ? [...pricingRulesQueryKey, params] : pricingRulesQueryKey;
};

export const usePricingRulesQuery = (params?: PricingRuleListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getPricingRulesQueryKey(params),
    queryFn: () => listPricingRulesApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreatePricingRuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePricingRuleRequest) => createPricingRuleApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRulesQueryKey });
    },
  });
};

export const useUpdatePricingRuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdatePricingRuleRequest }) =>
      updatePricingRuleApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRulesQueryKey });
    },
  });
};

export const useDeletePricingRuleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deletePricingRuleApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pricingRulesQueryKey });
    },
  });
};

export const additionalFeesQueryKey = ['additional-fees'] as const;

export const getAdditionalFeesQueryKey = (params?: AdditionalFeeListParams) => {
  return params ? [...additionalFeesQueryKey, params] : additionalFeesQueryKey;
};

export const useAdditionalFeesQuery = (params?: AdditionalFeeListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getAdditionalFeesQueryKey(params),
    queryFn: () => listAdditionalFeesApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateAdditionalFeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdditionalFeeRequest) => createAdditionalFeeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalFeesQueryKey });
    },
  });
};

export const useUpdateAdditionalFeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateAdditionalFeeRequest }) =>
      updateAdditionalFeeApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalFeesQueryKey });
    },
  });
};

export const useDeleteAdditionalFeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteAdditionalFeeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: additionalFeesQueryKey });
    },
  });
};
