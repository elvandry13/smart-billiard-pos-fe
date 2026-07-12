import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTenantApi, deleteTenantApi, listTenantsApi, updateTenantApi } from './api';

import type { CreateTenantRequest, TenantListParams, UpdateTenantRequest } from './types';

export const tenantsQueryKey = ['tenants'] as const;

export const getTenantsQueryKey = (params?: TenantListParams) => {
  return params ? [...tenantsQueryKey, params] : tenantsQueryKey;
};

export const useTenantsQuery = (params?: TenantListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getTenantsQueryKey(params),
    queryFn: () => listTenantsApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTenantRequest) => createTenantApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
};

export const useUpdateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTenantRequest }) =>
      updateTenantApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
};

export const useDeleteTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTenantApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsQueryKey });
    },
  });
};
