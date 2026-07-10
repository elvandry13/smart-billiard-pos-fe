import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authStorage } from '@/lib/authStorage';

import { changePasswordApi, getProfileApi, updateProfileApi } from './api';

import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfile,
} from './types';

export const profileQueryKey = ['profile'] as const;

interface UseProfileQueryOptions {
  enabled?: boolean;
}

export const useProfileQuery = (options: UseProfileQueryOptions = {}) => {
  const { enabled = authStorage.hasRefreshToken() } = options;

  return useQuery<UserProfile, Error>({
    queryKey: profileQueryKey,
    queryFn: getProfileApi,
    enabled,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateProfileResponse, Error, UpdateProfileRequest>({
    mutationFn: updateProfileApi,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: changePasswordApi,
  });
};
