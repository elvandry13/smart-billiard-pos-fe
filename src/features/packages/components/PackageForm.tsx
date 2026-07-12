import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createPackageSchema, PACKAGE_TYPE_OPTIONS, VALID_DAY_TYPE_OPTIONS, type CreatePackageFormData } from '../schemas';
import type { Package } from '../types';
import type { ApiError } from '@/lib/errors';

interface PackageFormProps {
  pkg?: Package;
  onSubmit: (data: CreatePackageFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
}

export const PackageForm: React.FC<PackageFormProps> = ({
  pkg,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
}) => {
  const isEditing = !!pkg;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: pkg?.name ?? '',
      type: pkg?.type ?? 'per_minute',
      duration_minutes: pkg?.duration_minutes ?? null,
      fixed_price: pkg?.fixed_price ?? null,
      price_per_minute: pkg?.price_per_minute ?? null,
      valid_day_type: pkg?.valid_day_type ?? 'all',
      specific_date: pkg?.specific_date ?? null,
      valid_start_time: pkg?.valid_start_time ?? null,
      valid_end_time: pkg?.valid_end_time ?? null,
      is_active: pkg?.is_active ?? true,
    },
  });

  const packageType = watch('type');
  const validDayType = watch('valid_day_type');

  useEffect(() => {
    if (pkg) {
      reset({
        name: pkg.name,
        type: pkg.type,
        duration_minutes: pkg.duration_minutes ?? null,
        fixed_price: pkg.fixed_price ?? null,
        price_per_minute: pkg.price_per_minute ?? null,
        valid_day_type: pkg.valid_day_type ?? 'all',
        specific_date: pkg.specific_date ?? null,
        valid_start_time: pkg.valid_start_time ?? null,
        valid_end_time: pkg.valid_end_time ?? null,
        is_active: pkg.is_active,
      });
    }
  }, [pkg, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        setError(field as keyof CreatePackageFormData, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: CreatePackageFormData) => {
    await onSubmit(data);
  };

  const submitDisabled = isLoading || isSubmitting;

  const showDurationField = packageType === 'fixed_duration';
  const showFixedPriceField = packageType === 'fixed_duration' || packageType === 'open_loss' || packageType === 'happy_hour';
  const showPricePerMinuteField = packageType === 'per_minute';

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="pkg-name" className="block text-sm font-medium text-gray-700">
          Nama Paket <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="pkg-name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan nama paket"
          disabled={submitDisabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="pkg-type" className="block text-sm font-medium text-gray-700">
          Tipe Paket <span className="text-red-500">*</span>
        </label>
        <select
          {...register('type')}
          id="pkg-type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          {PACKAGE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {showDurationField && (
        <div>
          <label htmlFor="pkg-duration" className="block text-sm font-medium text-gray-700">
            Durasi (Menit)
          </label>
          <input
            {...register('duration_minutes', { valueAsNumber: true })}
            type="number"
            id="pkg-duration"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Contoh: 60"
            disabled={submitDisabled}
          />
          {errors.duration_minutes && (
            <p className="mt-1 text-sm text-red-600">{errors.duration_minutes.message}</p>
          )}
        </div>
      )}

      {showFixedPriceField && (
        <div>
          <label htmlFor="pkg-fixed-price" className="block text-sm font-medium text-gray-700">
            Harga Tetap (Rp)
          </label>
          <input
            {...register('fixed_price')}
            type="text"
            id="pkg-fixed-price"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Contoh: 50000"
            disabled={submitDisabled}
          />
          {errors.fixed_price && (
            <p className="mt-1 text-sm text-red-600">{errors.fixed_price.message}</p>
          )}
        </div>
      )}

      {showPricePerMinuteField && (
        <div>
          <label htmlFor="pkg-price-per-minute" className="block text-sm font-medium text-gray-700">
            Harga per Menit (Rp)
          </label>
          <input
            {...register('price_per_minute')}
            type="text"
            id="pkg-price-per-minute"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            placeholder="Contoh: 500"
            disabled={submitDisabled}
          />
          {errors.price_per_minute && (
            <p className="mt-1 text-sm text-red-600">{errors.price_per_minute.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="pkg-valid-day-type" className="block text-sm font-medium text-gray-700">
          Hari Berlaku
        </label>
        <select
          {...register('valid_day_type')}
          id="pkg-valid-day-type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          {VALID_DAY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.valid_day_type && (
          <p className="mt-1 text-sm text-red-600">{errors.valid_day_type.message}</p>
        )}
      </div>

      {validDayType === 'specific_day' && (
        <div>
          <label htmlFor="pkg-specific-date" className="block text-sm font-medium text-gray-700">
            Tanggal Spesifik
          </label>
          <input
            {...register('specific_date')}
            type="date"
            id="pkg-specific-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          />
          {errors.specific_date && (
            <p className="mt-1 text-sm text-red-600">{errors.specific_date.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="pkg-start-time" className="block text-sm font-medium text-gray-700">
            Jam Mulai
          </label>
          <input
            {...register('valid_start_time')}
            type="time"
            id="pkg-start-time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          />
          {errors.valid_start_time && (
            <p className="mt-1 text-sm text-red-600">{errors.valid_start_time.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pkg-end-time" className="block text-sm font-medium text-gray-700">
            Jam Selesai
          </label>
          <input
            {...register('valid_end_time')}
            type="time"
            id="pkg-end-time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          />
          {errors.valid_end_time && (
            <p className="mt-1 text-sm text-red-600">{errors.valid_end_time.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          {...register('is_active')}
          type="checkbox"
          id="pkg-is-active"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={submitDisabled}
        />
        <label htmlFor="pkg-is-active" className="ml-2 text-sm text-gray-700">
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
