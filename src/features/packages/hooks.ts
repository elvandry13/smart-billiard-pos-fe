import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPackageApi,
  deletePackageApi,
  listPackagesApi,
  updatePackageApi,
} from './api';

import type {
  CreatePackageRequest,
  PackageListParams,
  UpdatePackageRequest,
} from './types';

export const packagesQueryKey = ['packages'] as const;

export const getPackagesQueryKey = (params?: PackageListParams) => {
  return params ? [...packagesQueryKey, params] : packagesQueryKey;
};

export const usePackagesQuery = (params?: PackageListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getPackagesQueryKey(params),
    queryFn: () => listPackagesApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreatePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePackageRequest) => createPackageApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packagesQueryKey });
    },
  });
};

export const useUpdatePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdatePackageRequest }) =>
      updatePackageApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packagesQueryKey });
    },
  });
};

export const useDeletePackageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deletePackageApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: packagesQueryKey });
    },
  });
};