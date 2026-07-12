import React, { useState, useEffect } from 'react';

import {
  useAdditionalFeesQuery,
  useCreateAdditionalFeeMutation,
  useUpdateAdditionalFeeMutation,
  useDeleteAdditionalFeeMutation,
} from '../hooks';
import { AdditionalFeeForm } from '../components/AdditionalFeeForm';
import type { AdditionalFee, CreateAdditionalFeeRequest, UpdateAdditionalFeeRequest } from '../types';
import type { CreateAdditionalFeeFormData } from '../schemas';

import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/formatters';

const FEE_TYPE_LABEL: Record<string, string> = {
  percentage: 'Persentase',
  fixed: 'Nominal Tetap',
};

export const AdditionalFeesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingAdditionalFee, setEditingAdditionalFee] = useState<AdditionalFee | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<AdditionalFee | undefined>();
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, typeFilter, isActiveFilter]);

  const {
    data,
    isLoading,
    isError,
    error: rawError,
    refetch,
  } = useAdditionalFeesQuery({
    page,
    search: debouncedSearch || undefined,
    type: (typeFilter as AdditionalFee['type']) || undefined,
    is_active: isActiveFilter === '' ? undefined : isActiveFilter === 'true',
  });

  const createMutation = useCreateAdditionalFeeMutation();
  const updateMutation = useUpdateAdditionalFeeMutation();
  const deleteMutation = useDeleteAdditionalFeeMutation();

  const list = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  const totalItems = data?.count ?? 0;
  const showPagination = totalPages > 1;

  const handleOpenCreate = () => {
    setEditingAdditionalFee(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (af: AdditionalFee) => {
    setEditingAdditionalFee(af);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAdditionalFee(undefined);
    setFormApiError(null);
  };

  const handleSubmit = async (formData: CreateAdditionalFeeFormData) => {
    try {
      setFormApiError(null);
      if (editingAdditionalFee) {
        const payload: UpdateAdditionalFeeRequest = {
          name: formData.name,
          type: formData.type,
          value: formData.value,
          is_active: formData.is_active,
        };
        await updateMutation.mutateAsync({ id: editingAdditionalFee.id, payload });
      } else {
        const payload: CreateAdditionalFeeRequest = {
          name: formData.name,
          type: formData.type,
          value: formData.value,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Additional fee form submit error:', err);
      }
    }
  };

  const handleDeleteConfirm = (af: AdditionalFee) => {
    setDeleteTarget(af);
  };

  const handleCloseDelete = () => {
    setDeleteTarget(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    handleCloseDelete();
  };

  const isMutationLoading = createMutation.isPending || updateMutation.isPending;
  const isDeleteLoading = deleteMutation.isPending;

  const deleteMessage = deleteTarget
    ? `Apakah Anda yakin ingin menghapus biaya tambahan "${deleteTarget.name}"?`
    : '';

  const formatValue = (af: AdditionalFee): string => {
    if (af.type === 'percentage') {
      return `${af.value}%`;
    }
    return formatMoney(af.value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Biaya Tambahan"
        description="Kelola biaya tambahan seperti pajak atau service charge"
      />

      {isLoading ? (
        <LoadingState message="Memuat data biaya tambahan..." />
      ) : isError ? (
        <ErrorState message={getApiErrorMessage(rawError)} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="max-w-md flex-1">
                <label htmlFor="af-search" className="sr-only">Cari biaya tambahan</label>
                <input
                  type="text"
                  id="af-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div className="w-40 shrink-0">
                <label htmlFor="af-type-filter" className="sr-only">Filter tipe</label>
                <select
                  id="af-type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Semua Tipe</option>
                  {Object.entries(FEE_TYPE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="w-32 shrink-0">
                <label htmlFor="af-active-filter" className="sr-only">Filter status</label>
                <select
                  id="af-active-filter"
                  value={isActiveFilter}
                  onChange={(e) => setIsActiveFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Semua Status</option>
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Biaya
            </button>
          </div>

          {list.length === 0 ? (
            <EmptyState
              title="Belum ada biaya tambahan"
              description={search || typeFilter || isActiveFilter ? 'Tidak ditemukan biaya tambahan yang sesuai dengan filter.' : 'Mulai dengan menambahkan biaya tambahan pertama.'}
            />
          ) : (
            <>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Nama
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Tipe
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Nilai
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Aksi</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {list.map((af) => (
                      <tr key={af.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {af.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {FEE_TYPE_LABEL[af.type] || af.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {formatValue(af)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              af.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {af.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleOpenEdit(af)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(af)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showPagination && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={handleCloseModal} />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {editingAdditionalFee ? 'Edit Biaya Tambahan' : 'Tambah Biaya Tambahan'}
                </h3>
                <AdditionalFeeForm
                  additionalFee={editingAdditionalFee}
                  onSubmit={handleSubmit}
                  onCancel={handleCloseModal}
                  isLoading={isMutationLoading}
                  apiError={formApiError}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Biaya Tambahan"
        message={deleteMessage}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDelete}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};
