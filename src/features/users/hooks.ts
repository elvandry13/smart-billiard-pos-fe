import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUserApi, deleteUserApi, listUsersApi, updateUserApi } from './api';

import type { CreateUserRequest, UpdateUserRequest, UserListParams } from './types';

export const usersQueryKey = ['users'] as const;

export const getUsersQueryKey = (params?: UserListParams) => {
  return params ? [...usersQueryKey, params] : usersQueryKey;
};

export const useUsersQuery = (params?: UserListParams) => {
  return useQuery({
    queryKey: getUsersQueryKey(params),
    queryFn: () => listUsersApi(params),
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createUserApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateUserRequest }) =>
      updateUserApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteUserApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
    },
  });
};
