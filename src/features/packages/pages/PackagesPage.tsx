import React, { useState, useEffect } from 'react';

import {
  usePackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} from '../hooks';
import { PackageForm } from '../components/PackageForm';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../types';
import type { CreatePackageFormData } from '../schemas';

import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/formatters';

const PACKAGE_TYPE_LABEL: Record<string, string> = {
  per_minute: 'Per Menit',
  fixed_duration: 'Durasi Tetap',
  open_loss: 'Open Loss',
  happy_hour: 'Happy Hour',
};

const VALID_DAY_TYPE_LABEL: Record<string, string> = {
  all: 'Semua Hari',
  weekday: 'Weekday',
  weekend: 'Weekend',
  specific_day: 'Hari Tertentu',
};

export const PackagesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Package | undefined>();
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
  } = usePackagesQuery({
    page,
    search: debouncedSearch || undefined,
    type: (typeFilter as Package['type']) || undefined,
    is_active: isActiveFilter === '' ? undefined : isActiveFilter === 'true',
  });

  const createMutation = useCreatePackageMutation();
  const updateMutation = useUpdatePackageMutation();
  const deleteMutation = useDeletePackageMutation();

  const list = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  const totalItems = data?.count ?? 0;
  const showPagination = totalPages > 1;

  const handleOpenCreate = () => {
    setEditingPackage(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(undefined);
    setFormApiError(null);
  };

  const handleSubmit = async (formData: CreatePackageFormData) => {
    try {
      setFormApiError(null);
      if (editingPackage) {
        const payload: UpdatePackageRequest = {
          name: formData.name,
          type: formData.type,
          duration_minutes: formData.duration_minutes ?? null,
          fixed_price: formData.fixed_price || null,
          price_per_minute: formData.price_per_minute || null,
          valid_day_type: formData.valid_day_type ?? null,
          specific_date: formData.specific_date || null,
          valid_start_time: formData.valid_start_time || null,
          valid_end_time: formData.valid_end_time || null,
          is_active: formData.is_active,
        };
        await updateMutation.mutateAsync({ id: editingPackage.id, payload });
      } else {
        const payload: CreatePackageRequest = {
          name: formData.name,
          type: formData.type,
          duration_minutes: formData.duration_minutes ?? null,
          fixed_price: formData.fixed_price || null,
          price_per_minute: formData.price_per_minute || null,
          valid_day_type: formData.valid_day_type ?? null,
          specific_date: formData.specific_date || null,
          valid_start_time: formData.valid_start_time || null,
          valid_end_time: formData.valid_end_time || null,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Package form submit error:', err);
      }
    }
  };

  const handleDeleteConfirm = (pkg: Package) => {
    setDeleteTarget(pkg);
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
    ? `Apakah Anda yakin ingin menghapus paket "${deleteTarget.name}"?`
    : '';

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Paket"
        description="Kelola paket billing meja billiard"
      />

      {isLoading ? (
        <LoadingState message="Memuat data paket..." />
      ) : isError ? (
        <ErrorState message={getApiErrorMessage(rawError)} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="max-w-md flex-1">
                <label htmlFor="pkg-search" className="sr-only">Cari paket</label>
                <input
                  type="text"
                  id="pkg-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div className="w-40 shrink-0">
                <label htmlFor="pkg-type-filter" className="sr-only">Filter tipe paket</label>
                <select
                  id="pkg-type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Semua Tipe</option>
                  {Object.entries(PACKAGE_TYPE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="w-32 shrink-0">
                <label htmlFor="pkg-active-filter" className="sr-only">Filter status</label>
                <select
                  id="pkg-active-filter"
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
              Tambah Paket
            </button>
          </div>

          {list.length === 0 ? (
            <EmptyState
              title="Belum ada paket"
              description={search || typeFilter || isActiveFilter ? 'Tidak ditemukan paket yang sesuai dengan filter.' : 'Mulai dengan menambahkan paket pertama.'}
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
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Durasi
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Harga
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
                    {list.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {pkg.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {PACKAGE_TYPE_LABEL[pkg.type] || pkg.type}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell">
                          {pkg.duration_minutes ? `${pkg.duration_minutes} menit` : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {pkg.fixed_price ? formatMoney(pkg.fixed_price) : pkg.price_per_minute ? `${formatMoney(pkg.price_per_minute)}/menit` : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              pkg.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {pkg.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleOpenEdit(pkg)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(pkg)}
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
                  {editingPackage ? 'Edit Paket' : 'Tambah Paket'}
                </h3>
                <PackageForm
                  pkg={editingPackage}
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
        title="Hapus Paket"
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
