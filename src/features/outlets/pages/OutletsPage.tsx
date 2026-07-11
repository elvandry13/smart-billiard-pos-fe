import React, { useState, useEffect } from 'react';

import { useOutletsQuery, useCreateOutletMutation, useUpdateOutletMutation, useDeleteOutletMutation } from '../hooks';
import { useTenantsQuery } from '@/features/tenants/hooks';
import { OutletForm } from '../components/OutletForm';
import type { Outlet, CreateOutletRequest, UpdateOutletRequest } from '../types';
import type { CreateOutletFormData } from '../schemas';

import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';

export const OutletsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Outlet | undefined>();
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error, refetch } = useOutletsQuery({
    page: currentPage,
    search: debouncedSearch || undefined,
  });

  const { data: tenantsData, isLoading: tenantsLoading } = useTenantsQuery();

  const createMutation = useCreateOutletMutation();
  const updateMutation = useUpdateOutletMutation();
  const deleteMutation = useDeleteOutletMutation();

  const outlets = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  const totalItems = data?.count ?? 0;
  const tenants = tenantsData?.results ?? [];

  const handleOpenCreateModal = () => {
    setEditingOutlet(undefined);
    setFormApiError(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setFormApiError(null);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingOutlet(undefined);
    setFormApiError(null);
  };

  const handleFormSubmit = async (formData: CreateOutletFormData) => {
    try {
      setFormApiError(null);
      if (editingOutlet) {
        const payload: UpdateOutletRequest = {
          code: formData.code,
          tenant: formData.tenant,
          name: formData.name,
          address: formData.address || null,
          timezone: formData.timezone || null,
          is_active: formData.is_active,
        };
        await updateMutation.mutateAsync({ id: editingOutlet.id, payload });
      } else {
        const payload: CreateOutletRequest = {
          code: formData.code,
          tenant: formData.tenant,
          name: formData.name,
          address: formData.address || null,
          timezone: formData.timezone || null,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(payload);
      }
      handleCloseFormModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('Outlet form submit error:', err);
      }
    }
  };

  const handleOpenDeleteConfirm = (outlet: Outlet) => {
    setDeleteTarget(outlet);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteTarget(undefined);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    handleCloseDeleteConfirm();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <LoadingState message="Memuat data outlet..." />;
  }

  if (isError) {
    return <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Outlets"
        description="Kelola data outlet untuk sistem Smart Billiard POS"
        actions={[
          {
            label: 'Tambah Outlet',
            onClick: handleOpenCreateModal,
            variant: 'primary',
            icon: (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ),
          },
        ]}
      />

      <div className="mb-4">
        <div className="max-w-md">
          <label htmlFor="search" className="sr-only">
            Cari outlet
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan nama outlet..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>
      </div>

      {outlets.length === 0 ? (
        <EmptyState
          title="Belum ada outlet"
          description={searchTerm ? 'Tidak ditemukan outlet yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan outlet pertama.'}
        />
      ) : (
        <>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Kode
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Nama Outlet
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Tenant
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Alamat
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
                {outlets.map((outlet) => (
                  <tr key={outlet.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {outlet.code}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {outlet.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {outlet.tenant?.name ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {outlet.address ?? '-'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          outlet.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {outlet.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleOpenEditModal(outlet)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(outlet)}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" onClick={handleCloseFormModal} />
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {editingOutlet ? 'Edit Outlet' : 'Tambah Outlet'}
                </h3>
                <OutletForm
                  outlet={editingOutlet}
                  tenants={tenants}
                  tenantsLoading={tenantsLoading}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseFormModal}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                  apiError={formApiError}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Outlet"
        message={`Apakah Anda yakin ingin menghapus outlet "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
