import React, { useState, useEffect } from 'react';

import {
  useTableTypesQuery,
  useCreateTableTypeMutation,
  useUpdateTableTypeMutation,
  useDeleteTableTypeMutation,
  useTablesQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} from '../hooks';
import { TableTypeForm } from '../components/TableTypeForm';
import { TableForm } from '../components/TableForm';
import type { TableType, CreateTableTypeRequest, UpdateTableTypeRequest } from '../types';
import type { Table, CreateTableRequest, UpdateTableRequest } from '../types';
import type { CreateTableTypeFormData } from '../schemas';
import type { CreateTableFormData } from '../schemas';

import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';

const STATUS_LABEL: Record<string, string> = {
  available: 'Tersedia',
  occupied: 'Terpakai',
  maintenance: 'Maintenance',
  reserved: 'Reserved',
};

const STATUS_COLOR: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  occupied: 'bg-blue-100 text-blue-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  reserved: 'bg-purple-100 text-purple-800',
};

type EntityTab = 'table-types' | 'tables';

export const TablesPage: React.FC = () => {
  const [tab, setTab] = useState<EntityTab>('table-types');

  const [ttSearch, setTtSearch] = useState('');
  const [ttDebouncedSearch, setTtDebouncedSearch] = useState('');
  const [ttPage, setTtPage] = useState(1);

  const [tSearch, setTSearch] = useState('');
  const [tDebouncedSearch, setTDebouncedSearch] = useState('');
  const [tPage, setTPage] = useState(1);
  const [tStatusFilter, setTStatusFilter] = useState<string>('');

  const [showModal, setShowModal] = useState(false);
  const [editingTableType, setEditingTableType] = useState<TableType | undefined>();
  const [editingTable, setEditingTable] = useState<Table | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'table-type'; entity: TableType } | { type: 'table'; entity: Table } | undefined>();
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTtDebouncedSearch(ttSearch), 300);
    return () => clearTimeout(timer);
  }, [ttSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setTDebouncedSearch(tSearch), 300);
    return () => clearTimeout(timer);
  }, [tSearch]);

  useEffect(() => {
    setTtPage(1);
  }, [ttDebouncedSearch]);

  useEffect(() => {
    setTPage(1);
  }, [tDebouncedSearch, tStatusFilter]);

  useEffect(() => {
    setTtSearch('');
    setTtDebouncedSearch('');
    setTSearch('');
    setTDebouncedSearch('');
    setTtPage(1);
    setTPage(1);
    setTStatusFilter('');
    handleCloseModal();
  }, [tab]);

  const {
    data: ttData,
    isLoading: ttLoading,
    isError: ttError,
    error: ttRawError,
    refetch: ttRefetch,
  } = useTableTypesQuery({ page: ttPage, search: ttDebouncedSearch || undefined });

  const {
    data: tData,
    isLoading: tLoading,
    isError: tError,
    error: tRawError,
    refetch: tRefetch,
  } = useTablesQuery({
    page: tPage,
    search: tDebouncedSearch || undefined,
    status: (tStatusFilter as Table['status']) || undefined,
  });

  const { data: ttAll, isLoading: ttAllLoading } = useTableTypesQuery(undefined);

  const createTTMutation = useCreateTableTypeMutation();
  const updateTTMutation = useUpdateTableTypeMutation();
  const deleteTTMutation = useDeleteTableTypeMutation();

  const createTMutation = useCreateTableMutation();
  const updateTMutation = useUpdateTableMutation();
  const deleteTMutation = useDeleteTableMutation();

  const tableTypes = ttAll?.results ?? [];
  const ttList = ttData?.results ?? [];
  const ttTotalPages = ttData ? Math.ceil(ttData.count / 10) : 1;
  const ttTotalItems = ttData?.count ?? 0;
  const showTTPagination = ttTotalPages > 1;

  const tList = tData?.results ?? [];
  const tTotalPages = tData ? Math.ceil(tData.count / 10) : 1;
  const tTotalItems = tData?.count ?? 0;
  const showTPagination = tTotalPages > 1;

  const handleOpenCreateTT = () => {
    setEditingTableType(undefined);
    setEditingTable(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenEditTT = (tt: TableType) => {
    setEditingTableType(tt);
    setEditingTable(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenCreateT = () => {
    setEditingTableType(undefined);
    setEditingTable(undefined);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleOpenEditT = (t: Table) => {
    setEditingTableType(undefined);
    setEditingTable(t);
    setFormApiError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTableType(undefined);
    setEditingTable(undefined);
    setFormApiError(null);
  };

  const handleTTSubmit = async (formData: CreateTableTypeFormData) => {
    try {
      setFormApiError(null);
      if (editingTableType) {
        const payload: UpdateTableTypeRequest = {
          name: formData.name,
          description: formData.description || null,
        };
        await updateTTMutation.mutateAsync({ id: editingTableType.id, payload });
      } else {
        const payload: CreateTableTypeRequest = {
          name: formData.name,
          description: formData.description || null,
        };
        await createTTMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Table type form submit error:', err);
      }
    }
  };

  const handleTSubmit = async (formData: CreateTableFormData) => {
    try {
      setFormApiError(null);
      if (editingTable) {
        const payload: UpdateTableRequest = {
          name: formData.name,
          table_type: Number(formData.table_type),
          status: formData.status,
        };
        await updateTMutation.mutateAsync({ id: editingTable.id, payload });
      } else {
        const payload: CreateTableRequest = {
          name: formData.name,
          table_type: Number(formData.table_type),
          status: formData.status,
        };
        await createTMutation.mutateAsync(payload);
      }
      handleCloseModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Table form submit error:', err);
      }
    }
  };

  const handleDeleteTTConfirm = (tt: TableType) => {
    setDeleteTarget({ type: 'table-type', entity: tt });
  };

  const handleDeleteTConfirm = (t: Table) => {
    setDeleteTarget({ type: 'table', entity: t });
  };

  const handleCloseDelete = () => {
    setDeleteTarget(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'table-type') {
      await deleteTTMutation.mutateAsync(deleteTarget.entity.id);
    } else {
      await deleteTMutation.mutateAsync(deleteTarget.entity.id);
    }
    handleCloseDelete();
  };

  const getTableTypeName = (tt: Table['table_type']): string => {
    const found = tableTypes.find((x) => x.id === tt);
    return found?.name ?? String(tt);
  };

  const isTTMutationLoading = createTTMutation.isPending || updateTTMutation.isPending;
  const isTMutationLoading = createTMutation.isPending || updateTMutation.isPending;
  const isDeleteLoading = deleteTTMutation.isPending || deleteTMutation.isPending;

  const deleteMessage = deleteTarget
    ? deleteTarget.type === 'table-type'
      ? `Apakah Anda yakin ingin menghapus tipe meja "${deleteTarget.entity.name}"? Meja yang menggunakan tipe ini mungkin akan terpengaruh.`
      : `Apakah Anda yakin ingin menghapus meja "${deleteTarget.entity.name}"?`
    : '';

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Manajemen Meja"
        description="Kelola tipe meja dan data meja untuk operasional billiard"
      />

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4 -mb-px">
          <button
            onClick={() => setTab('table-types')}
            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === 'table-types'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tipe Meja
            {ttTotalItems > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {ttTotalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('tables')}
            className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === 'tables'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Meja
            {tTotalItems > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {tTotalItems}
              </span>
            )}
          </button>
        </nav>
      </div>

      {tab === 'table-types' && (
        <>
          {ttLoading ? (
            <LoadingState message="Memuat data tipe meja..." />
          ) : ttError ? (
            <ErrorState message={getApiErrorMessage(ttRawError)} onRetry={() => ttRefetch()} />
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md flex-1">
                  <label htmlFor="tt-search" className="sr-only">Cari tipe meja</label>
                  <input
                    type="text"
                    id="tt-search"
                    value={ttSearch}
                    onChange={(e) => setTtSearch(e.target.value)}
                    placeholder="Cari berdasarkan nama tipe meja..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <button
                  onClick={handleOpenCreateTT}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Tipe Meja
                </button>
              </div>

              {ttList.length === 0 ? (
                <EmptyState
                  title="Belum ada tipe meja"
                  description={ttSearch ? 'Tidak ditemukan tipe meja yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan tipe meja pertama.'}
                />
              ) : (
                <>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nama Tipe Meja
                          </th>
                          <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell">
                            Deskripsi
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Aksi</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {ttList.map((tt) => (
                          <tr key={tt.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {tt.name}
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 md:table-cell">
                              {tt.description || '-'}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleOpenEditTT(tt)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTTConfirm(tt)}
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

                  {showTTPagination && (
                    <Pagination
                      currentPage={ttPage}
                      totalPages={ttTotalPages}
                      totalItems={ttTotalItems}
                      onPageChange={setTtPage}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {tab === 'tables' && (
        <>
          {tLoading ? (
            <LoadingState message="Memuat data meja..." />
          ) : tError ? (
            <ErrorState message={getApiErrorMessage(tRawError)} onRetry={() => tRefetch()} />
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="max-w-md flex-1">
                    <label htmlFor="t-search" className="sr-only">Cari meja</label>
                    <input
                      type="text"
                      id="t-search"
                      value={tSearch}
                      onChange={(e) => setTSearch(e.target.value)}
                      placeholder="Cari berdasarkan nama meja..."
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    />
                  </div>
                  <div className="w-40 shrink-0">
                    <label htmlFor="t-status-filter" className="sr-only">Filter status</label>
                    <select
                      id="t-status-filter"
                      value={tStatusFilter}
                      onChange={(e) => setTStatusFilter(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    >
                      <option value="">Semua Status</option>
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleOpenCreateT}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shrink-0"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Meja
                </button>
              </div>

              {tList.length === 0 ? (
                <EmptyState
                  title="Belum ada meja"
                  description={tSearch || tStatusFilter ? 'Tidak ditemukan meja yang sesuai dengan filter.' : 'Mulai dengan menambahkan meja pertama. Pastikan sudah ada tipe meja.'}
                />
              ) : (
                <>
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nama Meja
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Tipe
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
                        {tList.map((t) => (
                          <tr key={t.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {t.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {getTableTypeName(t.table_type)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span
                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${STATUS_COLOR[t.status] || 'bg-gray-100 text-gray-800'}`}
                              >
                                {STATUS_LABEL[t.status] || t.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleOpenEditT(t)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTConfirm(t)}
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

                  {showTPagination && (
                    <Pagination
                      currentPage={tPage}
                      totalPages={tTotalPages}
                      totalItems={tTotalItems}
                      onPageChange={setTPage}
                    />
                  )}
                </>
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
                  {tab === 'table-types'
                    ? (editingTableType ? 'Edit Tipe Meja' : 'Tambah Tipe Meja')
                    : (editingTable ? 'Edit Meja' : 'Tambah Meja')
                  }
                </h3>
                {tab === 'table-types' ? (
                  <TableTypeForm
                    tableType={editingTableType}
                    onSubmit={handleTTSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isTTMutationLoading}
                    apiError={formApiError}
                  />
                ) : (
                  <TableForm
                    table={editingTable}
                    tableTypes={tableTypes}
                    tableTypesLoading={ttAllLoading}
                    onSubmit={handleTSubmit}
                    onCancel={handleCloseModal}
                    isLoading={isTMutationLoading}
                    apiError={formApiError}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === 'table-type' ? 'Hapus Tipe Meja' : 'Hapus Meja'}
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
