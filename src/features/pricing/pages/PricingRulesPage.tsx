import React, { useState, useEffect } from 'react';

import {
  usePricingRulesQuery,
  useCreatePricingRuleMutation,
  useUpdatePricingRuleMutation,
  useDeletePricingRuleMutation,
} from '../hooks';
import { PricingRuleForm } from '../components/PricingRuleForm';
import type { PricingRule, CreatePricingRuleRequest, UpdatePricingRuleRequest } from '../types';
import type { CreatePricingRuleFormData } from '../schemas';

import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';
import { formatMoney } from '@/lib/formatters';

const DAY_TYPE_LABEL: Record<string, string> = {
  weekday: 'Weekday',
  weekend: 'Weekend',
  specific_day: 'Hari Tertentu',
};

export const PricingRulesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dayTypeFilter, setDayTypeFilter] = useState<string>('');
  const [isActiveFilter, setIsActiveFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingPricingRule, setEditingPricingRule] = useState<PricingRule | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<PricingRule | undefined>();
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, dayTypeFilter, isActiveFilter]);

  const {
    data,
    isLoading,
    isError,
    error: rawError,
    refetch,
  } = usePricingRulesQuery({
    page,
    search: debouncedSearch || undefined,
    day_type: (dayTypeFilter as PricingRule['day_type']) || undefined,
    is_active: isActiveFilter === '' ? undefined : isActiveFilter === 'true',
  });

  const createMutation = useCreatePricingRuleMutation();
  const updateMutation = useUpdatePricingRuleMutation();
  const deleteMutation = useDeletePricingRuleMutation();

  const list = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  const totalItems = data?.count ?? 0;
  const showPagination = totalPages > 1;

  const handleOpenCreate = () => {
    setEditingPricingRule(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (pr: PricingRule) => {
    setEditingPricingRule(pr);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPricingRule(undefined);
    setFormApiError(null);
  };

  const handleSubmit = async (formData: CreatePricingRuleFormData) => {
    try {
      setFormApiError(null);
      if (editingPricingRule) {
        const payload: UpdatePricingRuleRequest = {
          name: formData.name,
          day_type: formData.day_type,
          specific_date: formData.specific_date || null,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          price_per_minute: formData.price_per_minute,
          is_active: formData.is_active,
        };
        await updateMutation.mutateAsync({ id: editingPricingRule.id, payload });
      } else {
        const payload: CreatePricingRuleRequest = {
          name: formData.name,
          day_type: formData.day_type,
          specific_date: formData.specific_date || null,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          price_per_minute: formData.price_per_minute,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Pricing rule form submit error:', err);
      }
    }
  };

  const handleDeleteConfirm = (pr: PricingRule) => {
    setDeleteTarget(pr);
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
    ? `Apakah Anda yakin ingin menghapus aturan harga "${deleteTarget.name}"?`
    : '';

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Aturan Harga"
        description="Kelola aturan harga berdasarkan tipe hari dan waktu"
      />

      {isLoading ? (
        <LoadingState message="Memuat data aturan harga..." />
      ) : isError ? (
        <ErrorState message={getApiErrorMessage(rawError)} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="max-w-md flex-1">
                <label htmlFor="pr-search" className="sr-only">Cari aturan harga</label>
                <input
                  type="text"
                  id="pr-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div className="w-40 shrink-0">
                <label htmlFor="pr-day-type-filter" className="sr-only">Filter tipe hari</label>
                <select
                  id="pr-day-type-filter"
                  value={dayTypeFilter}
                  onChange={(e) => setDayTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                >
                  <option value="">Semua Tipe</option>
                  {Object.entries(DAY_TYPE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="w-32 shrink-0">
                <label htmlFor="pr-active-filter" className="sr-only">Filter status</label>
                <select
                  id="pr-active-filter"
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
              Tambah Aturan
            </button>
          </div>

          {list.length === 0 ? (
            <EmptyState
              title="Belum ada aturan harga"
              description={search || dayTypeFilter || isActiveFilter ? 'Tidak ditemukan aturan harga yang sesuai dengan filter.' : 'Mulai dengan menambahkan aturan harga pertama.'}
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
                        Tipe Hari
                      </th>
                      <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                        Waktu
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Harga/Menit
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
                    {list.map((pr) => (
                      <tr key={pr.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {pr.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {DAY_TYPE_LABEL[pr.day_type] || pr.day_type}
                          {pr.day_type === 'specific_day' && pr.specific_date && (
                            <span className="text-gray-500 ml-1">({pr.specific_date})</span>
                          )}
                        </td>
                        <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell">
                          {pr.start_time && pr.end_time
                            ? `${pr.start_time} - ${pr.end_time}`
                            : '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {formatMoney(pr.price_per_minute)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              pr.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {pr.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={() => handleOpenEdit(pr)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(pr)}
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
                  {editingPricingRule ? 'Edit Aturan Harga' : 'Tambah Aturan Harga'}
                </h3>
                <PricingRuleForm
                  pricingRule={editingPricingRule}
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
        title="Hapus Aturan Harga"
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
