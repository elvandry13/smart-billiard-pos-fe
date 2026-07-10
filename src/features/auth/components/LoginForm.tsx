import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { loginSchema, type LoginFormValues } from '../schemas';

interface LoginFormProps {
  errorMessage?: string;
  isSubmitting?: boolean;
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
}

export function LoginForm({ errorMessage, isSubmitting = false, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      {errorMessage ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Masukkan username"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? 'username-error' : undefined}
          {...register('username')}
        />
        {errors.username ? (
          <p className="mt-2 text-sm text-red-600" id="username-error">
            {errors.username.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Masukkan password"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          {...register('password')}
        />
        {errors.password ? (
          <p className="mt-2 text-sm text-red-600" id="password-error">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-brand-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Memproses login...' : 'Masuk'}
      </button>
    </form>
  );
}
