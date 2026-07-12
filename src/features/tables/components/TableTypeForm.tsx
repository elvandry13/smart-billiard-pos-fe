import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createTableTypeSchema, type CreateTableTypeFormData } from '../schemas';

import type { TableType } from '../types';
import type { ApiError } from '@/lib/errors';

interface TableTypeFormProps {
  tableType?: TableType;
  onSubmit: (data: CreateTableTypeFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
}

export const TableTypeForm: React.FC<TableTypeFormProps> = ({
  tableType,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
}) => {
  const isEditing = !!tableType;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTableTypeFormData>({
    resolver: zodResolver(createTableTypeSchema),
    defaultValues: {
      name: tableType?.name ?? '',
      description: tableType?.description ?? '',
    },
  });

  useEffect(() => {
    if (tableType) {
      reset({
        name: tableType.name,
        description: tableType.description,
      });
    }
  }, [tableType, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        setError(field as keyof CreateTableTypeFormData, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: CreateTableTypeFormData) => {
    await onSubmit(data);
  };

  const submitDisabled = isLoading || isSubmitting;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="tt-name" className="block text-sm font-medium text-gray-700">
          Nama Tipe Meja <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="tt-name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan nama tipe meja"
          disabled={submitDisabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="tt-description" className="block text-sm font-medium text-gray-700">
          Deskripsi
        </label>
        <textarea
          {...register('description')}
          id="tt-description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Deskripsi tipe meja (opsional)"
          disabled={submitDisabled}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
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