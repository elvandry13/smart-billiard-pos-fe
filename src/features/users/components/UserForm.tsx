import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createUserSchema, updateUserSchema, adminRoleOptions, superAdminRoleOptions } from '../schemas';
import type { CreateUserFormData } from '../schemas';

import type { User } from '../types';
import type { ApiError } from '@/lib/errors';
import type { Role } from '@/types/auth';
import type { Tenant } from '@/features/tenants/types';
import type { Outlet } from '@/features/outlets/types';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
  currentUserRole?: Role;
  tenants?: Tenant[];
  outlets?: Outlet[];
  tenantsLoading?: boolean;
  outletsLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
  currentUserRole,
  tenants = [],
  outlets = [],
  tenantsLoading = false,
  outletsLoading = false,
}) => {
  const isEditing = !!user;
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isAdmin = currentUserRole === 'admin';
  const roleOptions = isSuperAdmin ? superAdminRoleOptions : adminRoleOptions;

  const schema = isEditing ? updateUserSchema : createUserSchema;
  type FormDataType = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      role: user?.role ?? (isAdmin ? 'officer' : 'admin'),
      password: '',
      tenant: user?.tenant?.id ?? null,
      outlet: user?.outlet?.id ?? null,
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      is_active: user?.is_active ?? true,
    },
  });

  const selectedRoleId = watch('role');

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email ?? '',
        phone: user.phone ?? '',
        role: user.role,
        password: '',
        tenant: user.tenant?.id ?? null,
        outlet: user.outlet?.id ?? null,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        is_active: user.is_active,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      const fieldErrors = apiError.fieldErrors as Record<string, string[]>;
      for (const [field, messages] of Object.entries(fieldErrors)) {
        setError(field as keyof FormDataType, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: FormDataType) => {
    await onSubmit(data as CreateUserFormData);
  };

  const submitDisabled = isLoading || isSubmitting;

  const showTenantSelect = isSuperAdmin;
  const showOutletSelect = isSuperAdmin || (isAdmin && selectedRoleId !== 'super_admin');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username <span className="text-red-500">*</span>
        </label>
        <input
          {...register('username')}
          type="text"
          id="username"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan username"
          disabled={submitDisabled}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            Nama Depan
          </label>
          <input
            {...register('first_name')}
            type="text"
            id="first_name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Nama depan"
            disabled={submitDisabled}
          />
          {errors.first_name && (
            <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Nama Belakang
          </label>
          <input
            {...register('last_name')}
            type="text"
            id="last_name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Nama belakang"
            disabled={submitDisabled}
          />
          {errors.last_name && (
            <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="email@example.com"
            disabled={submitDisabled}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            No. Telepon
          </label>
          <input
            {...register('phone')}
            type="text"
            id="phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="08xxxxxxxxxx"
            disabled={submitDisabled}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            {...register('role')}
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password {!isEditing && <span className="text-red-500">*</span>}
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder={isEditing ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
            disabled={submitDisabled}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      {showTenantSelect && (
        <div>
          <label htmlFor="tenant" className="block text-sm font-medium text-gray-700">
            Tenant
          </label>
          <select
            {...register('tenant')}
            id="tenant"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled || tenantsLoading}
          >
            <option value="">Pilih tenant</option>
            {tenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
          {tenantsLoading && (
            <p className="mt-1 text-sm text-gray-500">Memuat data tenant...</p>
          )}
          {errors.tenant && (
            <p className="mt-1 text-sm text-red-600">{errors.tenant.message}</p>
          )}
        </div>
      )}

      {showOutletSelect && (
        <div>
          <label htmlFor="outlet" className="block text-sm font-medium text-gray-700">
            Outlet
          </label>
          <select
            {...register('outlet')}
            id="outlet"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled || outletsLoading}
          >
            <option value="">Pilih outlet</option>
            {outlets.map((outlet) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name}
              </option>
            ))}
          </select>
          {outletsLoading && (
            <p className="mt-1 text-sm text-gray-500">Memuat data outlet...</p>
          )}
          {errors.outlet && (
            <p className="mt-1 text-sm text-red-600">{errors.outlet.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center">
        <input
          {...register('is_active')}
          type="checkbox"
          id="is_active"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={submitDisabled}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Aktif
        </label>
      </div>

      {apiError && !apiError.fieldErrors && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{apiError.message}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitDisabled}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitDisabled}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            isEditing ? 'Perbarui' : 'Simpan'
          )}
        </button>
      </div>
    </form>
  );
};
