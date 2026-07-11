import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createOutletApi, deleteOutletApi, listOutletsApi, updateOutletApi } from './api';

import type { CreateOutletRequest, OutletListParams, UpdateOutletRequest } from './types';

export const outletsQueryKey = ['outlets'] as const;

export const getOutletsQueryKey = (params?: OutletListParams) => {
  return params ? [...outletsQueryKey, params] : outletsQueryKey;
};

export const useOutletsQuery = (params?: OutletListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getOutletsQueryKey(params),
    queryFn: () => listOutletsApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateOutletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOutletRequest) => createOutletApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outletsQueryKey });
    },
  });
};

export const useUpdateOutletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateOutletRequest }) =>
      updateOutletApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outletsQueryKey });
    },
  });
};

export const useDeleteOutletMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteOutletApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: outletsQueryKey });
    },
  });
};
