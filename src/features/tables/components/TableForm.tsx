import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createTableSchema, type CreateTableFormData } from '../schemas';
import type { Table, TableType } from '../types';
import type { ApiError } from '@/lib/errors';

interface TableFormProps {
  table?: Table;
  tableTypes: TableType[];
  tableTypesLoading?: boolean;
  onSubmit: (data: CreateTableFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  apiError?: ApiError | null;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'available', label: 'Tersedia' },
  { value: 'occupied', label: 'Terpakai' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Reserved' },
];

export const TableForm: React.FC<TableFormProps> = ({
  table,
  tableTypes,
  tableTypesLoading = false,
  onSubmit,
  onCancel,
  isLoading = false,
  apiError,
}) => {
  const isEditing = !!table;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTableFormData>({
    resolver: zodResolver(createTableSchema),
    defaultValues: {
      table_type: table?.table_type ? String(table.table_type) : '',
      name: table?.name ?? '',
      status: table?.status ?? 'available',
    },
  });

  useEffect(() => {
    if (table) {
      reset({
        table_type: table.table_type ? String(table.table_type) : '',
        name: table.name,
        status: table.status,
      });
    }
  }, [table, reset]);

  useEffect(() => {
    if (apiError?.fieldErrors) {
      for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
        setError(field as keyof CreateTableFormData, {
          type: 'server',
          message: messages[0],
        });
      }
    }
  }, [apiError, setError]);

  const handleFormSubmit = async (data: CreateTableFormData) => {
    await onSubmit(data);
  };

  const submitDisabled = isLoading || isSubmitting || tableTypesLoading;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="t-table-type" className="block text-sm font-medium text-gray-700">
          Tipe Meja <span className="text-red-500">*</span>
        </label>
        <select
          {...register('table_type')}
          id="t-table-type"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          <option value="">Pilih tipe meja</option>
          {tableTypes.map((tt) => (
            <option key={tt.id} value={tt.id}>
              {tt.name}
            </option>
          ))}
        </select>
        {errors.table_type && (
          <p className="mt-1 text-sm text-red-600">{errors.table_type.message}</p>
        )}
        {tableTypesLoading && (
          <p className="mt-1 text-sm text-gray-500">Memuat data tipe meja...</p>
        )}
      </div>

      <div>
        <label htmlFor="t-name" className="block text-sm font-medium text-gray-700">
          Nama Meja <span className="text-red-500">*</span>
        </label>
        <input
          {...register('name')}
          type="text"
          id="t-name"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          placeholder="Masukkan nama meja"
          disabled={submitDisabled}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="t-status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status')}
          id="t-status"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          disabled={submitDisabled}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
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