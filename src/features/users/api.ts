import { apiClient } from '@/lib/apiClient';

import type {
  CreateUserRequest,
  User,
  UserListParams,
  UserListResponse,
  UpdateUserRequest,
} from './types';

export const listUsersApi = (params?: UserListParams): Promise<UserListResponse> => {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  if (params?.search) {
    searchParams.set('search', params.search);
  }

  if (params?.ordering) {
    searchParams.set('ordering', params.ordering);
  }

  if (params?.role) {
    searchParams.set('role', params.role);
  }

  if (params?.tenant) {
    searchParams.set('tenant', String(params.tenant));
  }

  if (params?.outlet) {
    searchParams.set('outlet', String(params.outlet));
  }

  if (params?.is_active !== undefined) {
    searchParams.set('is_active', String(params.is_active));
  }

  const queryString = searchParams.toString();
  const path = queryString ? `/users/?${queryString}` : '/users/';

  return apiClient<UserListResponse>(path);
};

export const getUserApi = (id: number | string): Promise<User> => {
  return apiClient<User>(`/users/${id}/`);
};

export const createUserApi = (payload: CreateUserRequest): Promise<User> => {
  return apiClient<User>('/users/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateUserApi = (id: number | string, payload: UpdateUserRequest): Promise<User> => {
  return apiClient<User>(`/users/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const deleteUserApi = (id: number | string): Promise<void> => {
  return apiClient<void>(`/users/${id}/`, {
    method: 'DELETE',
  });
};
