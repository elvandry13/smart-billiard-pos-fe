import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { updateProfileSchema, type UpdateProfileFormValues } from '../schemas';

interface ProfileFormProps {
  defaultValues?: {
    email?: string | null;
    phone?: string | null;
    first_name?: string | null;
    last_name?: string | null;
  };
  errorMessage?: string;
  successMessage?: string;
  isSubmitting?: boolean;
  onSubmit: (values: UpdateProfileFormValues) => void | Promise<void>;
}

export function ProfileForm({
  defaultValues,
  errorMessage,
  successMessage,
  isSubmitting = false,
  onSubmit,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      first_name: defaultValues?.first_name ?? '',
      last_name: defaultValues?.last_name ?? '',
    },
  });

  // Reset form when defaultValues change (e.g., after successful update)
  const handleReset = () => {
    reset({
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      first_name: defaultValues?.first_name ?? '',
      last_name: defaultValues?.last_name ?? '',
    });
  };

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      onReset={handleReset}
      noValidate
    >
      {errorMessage ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="alert"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="first_name">
            Nama Depan
          </label>
          <input
            id="first_name"
            type="text"
            autoComplete="given-name"
            className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            placeholder="Masukkan nama depan"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.first_name)}
            aria-describedby={errors.first_name ? 'first_name-error' : undefined}
            {...register('first_name')}
          />
          {errors.first_name ? (
            <p className="mt-2 text-sm text-red-600" id="first_name-error">
              {String(errors.first_name.message ?? '')}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="last_name">
            Nama Belakang
          </label>
          <input
            id="last_name"
            type="text"
            autoComplete="family-name"
            className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            placeholder="Masukkan nama belakang"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.last_name)}
            aria-describedby={errors.last_name ? 'last_name-error' : undefined}
            {...register('last_name')}
          />
          {errors.last_name ? (
            <p className="mt-2 text-sm text-red-600" id="last_name-error">
              {String(errors.last_name.message ?? '')}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Masukkan email"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-red-600" id="email-error">
            {String(errors.email.message ?? '')}
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="phone">
          Nomor Telepon
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          placeholder="Masukkan nomor telepon"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          {...register('phone')}
        />
        {errors.phone ? (
          <p className="mt-2 text-sm text-red-600" id="phone-error">
            {String(errors.phone.message ?? '')}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-brand-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
        <button
          type="reset"
          className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          disabled={isSubmitting}
        >
          Batal
        </button>
      </div>
    </form>
  );
}
