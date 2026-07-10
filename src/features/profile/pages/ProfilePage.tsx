import { useState } from 'react';

import { useProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../hooks';
import { getApiErrorMessage } from '@/lib/errors';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { getRoleBadgeLabel } from '@/lib/navigation';

import { ProfileForm } from '../components/ProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

import type { ChangePasswordFormValues, UpdateProfileFormValues } from '../schemas';

// User icon SVG
const UserIcon = () => (
  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

// Key icon SVG
const KeyIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
    />
  </svg>
);

export function ProfilePage() {
  const profileQuery = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useChangePasswordMutation();

  const [profileError, setProfileError] = useState<string | undefined>();
  const [profileSuccess, setProfileSuccess] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleUpdateProfile = async (values: UpdateProfileFormValues) => {
    setProfileError(undefined);
    setProfileSuccess(undefined);

    try {
      await updateProfileMutation.mutateAsync({
        email: values.email ? values.email : null,
        phone: values.phone ? values.phone : null,
        first_name: values.first_name ? values.first_name : null,
        last_name: values.last_name ? values.last_name : null,
      });
      setProfileSuccess('Profil berhasil diperbarui.');
    } catch (error) {
      setProfileError(getApiErrorMessage(error));
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues) => {
    setPasswordError(undefined);

    try {
      await changePasswordMutation.mutateAsync({
        old_password: values.old_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
    } catch (error) {
      setPasswordError(getApiErrorMessage(error));
      throw error;
    }
  };

  if (profileQuery.isLoading) {
    return <LoadingState message="Memuat profil..." />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(profileQuery.error)}
        onRetry={() => profileQuery.refetch()}
      />
    );
  }

  const profile = profileQuery.data;
  if (!profile) {
    return <ErrorState message="Profil tidak ditemukan." />;
  }

  const displayName =
    profile.first_name || profile.last_name
      ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
      : profile.username;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-600">Kelola informasi akun dan password Anda.</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* User Summary Header */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <UserIcon />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-950">{displayName}</h2>
            <p className="text-sm text-slate-600">@{profile.username}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {getRoleBadgeLabel(profile.role)}
            </span>
            {profile.tenant?.name && (
              <p className="mt-1 text-xs text-slate-500">{profile.tenant.name}</p>
            )}
            {profile.outlet?.name && (
              <p className="text-xs text-slate-500">{profile.outlet.name}</p>
            )}
          </div>
        </div>

        {/* Profile Form Section */}
        <div className="mb-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-700">
            Informasi Akun
          </h3>
          <ProfileForm
            defaultValues={{
              email: profile.email ?? '',
              phone: profile.phone ?? '',
              first_name: profile.first_name ?? '',
              last_name: profile.last_name ?? '',
            }}
            errorMessage={profileError}
            successMessage={profileSuccess}
            isSubmitting={updateProfileMutation.isPending}
            onSubmit={handleUpdateProfile}
          />
        </div>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Ubah Password
          </h3>
          {!showPasswordModal && (
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              <KeyIcon />
              Ubah Password
            </button>
          )}
        </div>

        {showPasswordModal ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-4 text-sm text-slate-600">
              Password baru minimal 8 karakter dan harus berbeda dari password lama.
            </p>
            {passwordError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {passwordError}
              </div>
            )}
            <ChangePasswordForm
              isSubmitting={changePasswordMutation.isPending}
              onSubmit={handleChangePassword}
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Klik tombol "Ubah Password" untuk memperbarui password akun Anda.
          </p>
        )}
      </div>
    </div>
  );
}
