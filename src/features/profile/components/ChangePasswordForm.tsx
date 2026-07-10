import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas';

interface ChangePasswordFormProps {
  isSubmitting?: boolean;
  onSubmit: (values: ChangePasswordFormValues) => void | Promise<void>;
}

// Eye/Show icon SVG
const EyeIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// EyeOff/Hide icon SVG
const EyeOffIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

export function ChangePasswordForm({ isSubmitting = false, onSubmit }: ChangePasswordFormProps) {
  const [showPasswords, setShowPasswords] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const [successMessage, setSuccessMessage] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFormSubmit = async (values: ChangePasswordFormValues) => {
    setSuccessMessage(undefined);
    try {
      await onSubmit(values);
      setSuccessMessage('Password berhasil diubah. Anda dapat menutup modal ini.');
      reset();
    } catch (error) {
      // Handle API validation errors
      if (error && typeof error === 'object' && 'old_password' in error) {
        setError('old_password', {
          type: 'server',
          message: (error as Record<string, string[]>).old_password?.[0] ?? 'Password lama salah',
        });
      } else if (error && typeof error === 'object' && 'new_password' in error) {
        setError('new_password', {
          type: 'server',
          message: (error as Record<string, string[]>).new_password?.[0] ?? 'Password baru tidak valid',
        });
      }
      throw error;
    }
  };

  const inputClassName =
    'mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100';

  return (
    <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {successMessage ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="alert"
        >
          {successMessage}
        </div>
      ) : null}

      {/* Old Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="old_password">
          Password Lama
        </label>
        <div className="relative">
          <input
            id="old_password"
            type={showPasswords.old_password ? 'text' : 'password'}
            autoComplete="current-password"
            className={inputClassName}
            placeholder="Masukkan password lama"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.old_password)}
            aria-describedby={errors.old_password ? 'old_password-error' : undefined}
            {...register('old_password')}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
            onClick={() => toggleShowPassword('old_password')}
            disabled={isSubmitting}
            tabIndex={-1}
          >
            {showPasswords.old_password ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.old_password ? (
          <p className="mt-2 text-sm text-red-600" id="old_password-error">
            {String(errors.old_password.message ?? '')}
          </p>
        ) : null}
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="new_password">
          Password Baru
        </label>
        <div className="relative">
          <input
            id="new_password"
            type={showPasswords.new_password ? 'text' : 'password'}
            autoComplete="new-password"
            className={inputClassName}
            placeholder="Minimal 8 karakter"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.new_password)}
            aria-describedby={errors.new_password ? 'new_password-error' : undefined}
            {...register('new_password')}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
            onClick={() => toggleShowPassword('new_password')}
            disabled={isSubmitting}
            tabIndex={-1}
          >
            {showPasswords.new_password ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.new_password ? (
          <p className="mt-2 text-sm text-red-600" id="new_password-error">
            {String(errors.new_password.message ?? '')}
          </p>
        ) : null}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="confirm_password">
          Konfirmasi Password Baru
        </label>
        <div className="relative">
          <input
            id="confirm_password"
            type={showPasswords.confirm_password ? 'text' : 'password'}
            autoComplete="new-password"
            className={inputClassName}
            placeholder="Masukkan ulang password baru"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.confirm_password)}
            aria-describedby={errors.confirm_password ? 'confirm_password-error' : undefined}
            {...register('confirm_password')}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
            onClick={() => toggleShowPassword('confirm_password')}
            disabled={isSubmitting}
            tabIndex={-1}
          >
            {showPasswords.confirm_password ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirm_password ? (
          <p className="mt-2 text-sm text-red-600" id="confirm_password-error">
            {String(errors.confirm_password.message ?? '')}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-brand-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
        </button>
        <button
          type="reset"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          disabled={isSubmitting}
          onClick={() => reset()}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
