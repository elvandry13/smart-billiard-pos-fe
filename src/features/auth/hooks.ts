import { useMutation, useQueryClient } from '@tanstack/react-query';

import { profileQueryKey } from '@/features/profile/hooks';
import { authStorage } from '@/lib/authStorage';

import { loginApi, logoutApi } from './api';

import type { LoginRequest, LoginResponse } from './types';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (tokens) => {
      authStorage.setTokens(tokens);
      void queryClient.invalidateQueries({ queryKey: profileQueryKey });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      const refreshToken = authStorage.getRefreshToken();

      if (!refreshToken) {
        return;
      }

      await logoutApi({ refresh: refreshToken });
    },
    onSettled: () => {
      authStorage.clearTokens();
      queryClient.removeQueries({ queryKey: profileQueryKey });
    },
  });
};
