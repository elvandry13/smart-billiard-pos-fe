import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createPricingRuleSchema, DAY_TYPE_OPTIONS, type CreatePricingRuleFormData } from '../schemas';
import type { PricingRule } from '../types';
import type { ApiError } from '@/lib/errors';

interface PricingRuleFormProps {
  pricingRule?: PricingRule;
  onSubmit: (data: CreatePricingRuleFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
}

export const PricingRuleForm: React.FC<PricingRuleFormProps> = ({
  pricingRule,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
}) => {
  const isEditing = !!pricingRule;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePricingRuleFormData>({
    resolver: zodResolver(createPricingRuleSchema),
    defaultValues: {
      name: pricingRule?.name ?? '',
      day_type: pricingRule?.day_type ?? 'weekday',
      specific_date: pricingRule?.specific_date ?? null,
      start_time: pricingRule?.start_time ?? null,
      end_time: pricingRule?.end_time ?? null,
      price_per_minute: pricingRule?.price_per_minute ?? '',
      is_active: pricingRule?.is_active ?? true,
    },
  });

  const dayType = watch('day_type');

  useEffect(() => {
    if (pricingRule) {
      reset({
        name: pricingRule.name,
        day_type: pricingRule.day_type,
        specific_date: pricingRule.specific_date ?? null,
        start_time: pricingRule.start_time ?? null,
        end_time: pricingRule.end_time ?? null,
        price_per_minute: pricingRule.price_per_minute,
        is_active: pricingRule.is_active,
      });
    }
  }, [pricingRule, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        setError(field as keyof CreatePricingRuleFormData, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: CreatePricingRuleFormData) => {
    await onSubmit(data);
  };

  const submitDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="pr-name" className="block text-sm font-medium text-gray-700">
          Nama Aturan Harga <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="pr-name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan nama aturan harga"
          disabled={submitDisabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="pr-day-type" className="block text-sm font-medium text-gray-700">
          Tipe Hari <span className="text-red-500">*</span>
        </label>
        <select
          {...register('day_type')}
          id="pr-day-type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          {DAY_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.day_type && (
          <p className="mt-1 text-sm text-red-600">{errors.day_type.message}</p>
        )}
      </div>

      {dayType === 'specific_day' && (
        <div>
          <label htmlFor="pr-specific-date" className="block text-sm font-medium text-gray-700">
            Tanggal Spesifik <span className="text-red-500">*</span>
          </label>
          <input
            {...register('specific_date')}
            type="date"
            id="pr-specific-date"
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
          <label htmlFor="pr-start-time" className="block text-sm font-medium text-gray-700">
            Jam Mulai
          </label>
          <input
            {...register('start_time')}
            type="time"
            id="pr-start-time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          />
          {errors.start_time && (
            <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pr-end-time" className="block text-sm font-medium text-gray-700">
            Jam Selesai
          </label>
          <input
            {...register('end_time')}
            type="time"
            id="pr-end-time"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            disabled={submitDisabled}
          />
          {errors.end_time && (
            <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="pr-price" className="block text-sm font-medium text-gray-700">
          Harga per Menit (Rp) <span className="text-red-500">*</span>
        </label>
        <input
          {...register('price_per_minute')}
          type="text"
          id="pr-price"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Contoh: 500"
          disabled={submitDisabled}
        />
        {errors.price_per_minute && (
          <p className="mt-1 text-sm text-red-600">{errors.price_per_minute.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register('is_active')}
          type="checkbox"
          id="pr-is-active"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={submitDisabled}
        />
        <label htmlFor="pr-is-active" className="ml-2 text-sm text-gray-700">
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
