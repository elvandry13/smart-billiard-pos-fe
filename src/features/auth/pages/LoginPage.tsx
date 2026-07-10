import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getProfileApi } from '@/features/profile/api';
import { profileQueryKey, useProfileQuery } from '@/features/profile/hooks';
import { authStorage } from '@/lib/authStorage';
import { getApiErrorMessage } from '@/lib/errors';
import { defaultRouteByRole } from '@/lib/permissions';

import { LoginForm } from '../components/LoginForm';

import type { LoginFormValues } from '../schemas';
import type { UserProfile } from '@/features/profile/types';

import { useLoginMutation } from '../hooks';

type LoginLocationState = {
  from?: {
    pathname?: string;
  };
};

const getRedirectPath = (profile: UserProfile, fallbackPath?: string): string => {
  if (fallbackPath && fallbackPath !== '/login') {
    return fallbackPath;
  }

  return defaultRouteByRole[profile.role];
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const [loginError, setLoginError] = useState<string | undefined>();
  const hasStoredSession = authStorage.hasRefreshToken();
  const profileQuery = useProfileQuery({ enabled: hasStoredSession });
  const locationState = location.state as LoginLocationState | null;
  const requestedPath = locationState?.from?.pathname;

  const handleSubmit = async (values: LoginFormValues) => {
    setLoginError(undefined);

    try {
      await loginMutation.mutateAsync(values);
      const profile = await queryClient.fetchQuery({
        queryKey: profileQueryKey,
        queryFn: getProfileApi,
      });

      navigate(getRedirectPath(profile, requestedPath), { replace: true });
    } catch (error) {
      setLoginError(getApiErrorMessage(error));
    }
  };

  if (profileQuery.data) {
    return <Navigate to={getRedirectPath(profileQuery.data, requestedPath)} replace />;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Login</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          Masuk ke akun Anda
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Gunakan username dan password yang terdaftar untuk mengakses Smart Billiard POS.
        </p>
      </div>

      {profileQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Memeriksa sesi login...
        </div>
      ) : (
        <LoginForm
          errorMessage={loginError}
          isSubmitting={loginMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
