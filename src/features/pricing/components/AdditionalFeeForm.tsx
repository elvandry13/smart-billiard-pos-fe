import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createAdditionalFeeSchema, ADDITIONAL_FEE_TYPE_OPTIONS, type CreateAdditionalFeeFormData } from '../schemas';
import type { AdditionalFee } from '../types';
import type { ApiError } from '@/lib/errors';

interface AdditionalFeeFormProps {
  additionalFee?: AdditionalFee;
  onSubmit: (data: CreateAdditionalFeeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
}

export const AdditionalFeeForm: React.FC<AdditionalFeeFormProps> = ({
  additionalFee,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
}) => {
  const isEditing = !!additionalFee;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdditionalFeeFormData>({
    resolver: zodResolver(createAdditionalFeeSchema),
    defaultValues: {
      name: additionalFee?.name ?? '',
      type: additionalFee?.type ?? 'percentage',
      value: additionalFee?.value ?? '',
      is_active: additionalFee?.is_active ?? true,
    },
  });

  const feeType = watch('type');

  useEffect(() => {
    if (additionalFee) {
      reset({
        name: additionalFee.name,
        type: additionalFee.type,
        value: additionalFee.value,
        is_active: additionalFee.is_active,
      });
    }
  }, [additionalFee, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        setError(field as keyof CreateAdditionalFeeFormData, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: CreateAdditionalFeeFormData) => {
    await onSubmit(data);
  };

  const submitDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="af-name" className="block text-sm font-medium text-gray-700">
          Nama Biaya Tambahan <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="af-name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan nama biaya tambahan"
          disabled={submitDisabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="af-type" className="block text-sm font-medium text-gray-700">
          Tipe Biaya <span className="text-red-500">*</span>
        </label>
        <select
          {...register('type')}
          id="af-type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          {ADDITIONAL_FEE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="af-value" className="block text-sm font-medium text-gray-700">
          {feeType === 'percentage' ? 'Persentase (%)' : 'Nominal (Rp)'} <span className="text-red-500">*</span>
        </label>
        <input
          {...register('value')}
          type="text"
          id="af-value"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder={feeType === 'percentage' ? 'Contoh: 10' : 'Contoh: 5000'}
          disabled={submitDisabled}
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          {...register('is_active')}
          type="checkbox"
          id="af-is-active"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          disabled={submitDisabled}
        />
        <label htmlFor="af-is-active" className="ml-2 text-sm text-gray-700">
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
