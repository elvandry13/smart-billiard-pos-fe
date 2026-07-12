import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTableTypeApi,
  deleteTableTypeApi,
  listTableTypesApi,
  updateTableTypeApi,
  createTableApi,
  deleteTableApi,
  listTablesApi,
  updateTableApi,
} from './api';

import type {
  CreateTableTypeRequest,
  TableTypeListParams,
  UpdateTableTypeRequest,
  CreateTableRequest,
  TableListParams,
  UpdateTableRequest,
} from './types';

export const tableTypesQueryKey = ['table-types'] as const;

export const getTableTypesQueryKey = (params?: TableTypeListParams) => {
  return params ? [...tableTypesQueryKey, params] : tableTypesQueryKey;
};

export const useTableTypesQuery = (params?: TableTypeListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getTableTypesQueryKey(params),
    queryFn: () => listTableTypesApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateTableTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTableTypeRequest) => createTableTypeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableTypesQueryKey });
    },
  });
};

export const useUpdateTableTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTableTypeRequest }) =>
      updateTableTypeApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableTypesQueryKey });
    },
  });
};

export const useDeleteTableTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTableTypeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tableTypesQueryKey });
    },
  });
};

export const tablesQueryKey = ['tables'] as const;

export const getTablesQueryKey = (params?: TableListParams) => {
  return params ? [...tablesQueryKey, params] : tablesQueryKey;
};

export const useTablesQuery = (params?: TableListParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: getTablesQueryKey(params),
    queryFn: () => listTablesApi(params),
    enabled: options?.enabled ?? true,
  });
};

export const useCreateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTableRequest) => createTableApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesQueryKey });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateTableRequest }) =>
      updateTableApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesQueryKey });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTableApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tablesQueryKey });
    },
  });
};