import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { profileQueryKey, useProfileQuery } from '@/features/profile/hooks';
import { AUTH_SESSION_EXPIRED_EVENT } from '@/lib/apiClient';
import { authStorage } from '@/lib/authStorage';
import { getApiErrorMessage } from '@/lib/errors';
import type { UserProfile } from '@/features/profile/types';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  user: UserProfile | null;
}

export function useAuthState(): AuthState {
  const queryClient = useQueryClient();
  const hasToken = authStorage.hasRefreshToken();
  const { data: user, isLoading, isError, error } = useProfileQuery({ enabled: hasToken });
  const errorMessage = isError ? getApiErrorMessage(error) : null;

  useEffect(() => {
    const handleSessionExpired = () => {
      queryClient.removeQueries({ queryKey: profileQueryKey });
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [queryClient]);

  return {
    isAuthenticated: Boolean(user),
    isLoading: isLoading,
    isError,
    errorMessage,
    user: user ?? null,
  };
}

export function useAuthGuard() {
  const { isAuthenticated, isLoading, isError, errorMessage } = useAuthState();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);
  return { isAuthenticated, isLoading, isError, errorMessage };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading, isError, errorMessage } = useAuthGuard();
  return { isAuthenticated, isLoading, isError, errorMessage };
}