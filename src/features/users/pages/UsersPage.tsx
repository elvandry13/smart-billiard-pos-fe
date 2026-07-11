import React, { useState, useEffect } from 'react';

import { useUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../hooks';
import { useTenantsQuery } from '@/features/tenants/hooks';
import { useOutletsQuery } from '@/features/outlets/hooks';
import { UserForm } from '../components/UserForm';
import type { User, CreateUserRequest, UpdateUserRequest } from '../types';
import type { CreateUserFormData } from '../schemas';

interface CreateUpdateUserRequestWithPassword extends UpdateUserRequest {
  password?: string;
}

import { useAuthState } from '@/shared/hooks/useAuthState';
import { PageHeader, ConfirmDialog, Pagination, LoadingState, ErrorState, EmptyState } from '@/shared/components';
import { ApiError, getApiErrorMessage } from '@/lib/errors';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuthState();
  const currentUserRole = currentUser?.role;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<User | undefined>();
  const [formApiError, setFormApiError] = useState<ApiError | null>(null);

  const isSuperAdmin = currentUserRole === 'super_admin';
  const isAdmin = currentUserRole === 'admin';

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error, refetch } = useUsersQuery({
    page: currentPage,
    search: debouncedSearch || undefined,
  });

  const { data: tenantsData, isLoading: tenantsLoading } = useTenantsQuery(
    isSuperAdmin ? {} : undefined,
    { enabled: isSuperAdmin }
  );

  const { data: outletsData, isLoading: outletsLoading } = useOutletsQuery(
    isSuperAdmin ? {} : undefined,
    { enabled: isSuperAdmin }
  );

  const createMutation = useCreateUserMutation();
  const updateMutation = useUpdateUserMutation();
  const deleteMutation = useDeleteUserMutation();

  const users = data?.results ?? [];
  const tenants = tenantsData?.results ?? [];
  const outlets = outletsData?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 10) : 1;
  const totalItems = data?.count ?? 0;

  const handleOpenCreateModal = () => {
    setEditingUser(undefined);
    setFormApiError(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormApiError(null);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setEditingUser(undefined);
    setFormApiError(null);
  };

  const handleFormSubmit = async (formData: CreateUserFormData) => {
    try {
      setFormApiError(null);
      if (editingUser) {
        const payload: UpdateUserRequest = {
          username: formData.username,
          email: formData.email || null,
          phone: formData.phone || null,
          role: formData.role,
          tenant: formData.tenant || null,
          outlet: formData.outlet || null,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          is_active: formData.is_active,
        };
        if (formData.password && formData.password.length >= 8) {
          (payload as CreateUpdateUserRequestWithPassword).password = formData.password;
        }
        await updateMutation.mutateAsync({ id: editingUser.id, payload });
      } else {
        const payload: CreateUserRequest = {
          username: formData.username,
          email: formData.email || null,
          phone: formData.phone || null,
          role: formData.role,
          password: formData.password!,
          tenant: formData.tenant || null,
          outlet: formData.outlet || null,
          first_name: formData.first_name || null,
          last_name: formData.last_name || null,
          is_active: formData.is_active,
        };
        await createMutation.mutateAsync(payload);
      }
      handleCloseFormModal();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormApiError(err);
      } else {
        console.error('User form submit error:', err);
      }
    }
  };

  const handleOpenDeleteConfirm = (user: User) => {
    setDeleteTarget(user);
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
    return <LoadingState message="Memuat data user..." />;
  }

  if (isError) {
    return <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />;
  }

  const getRoleLabel = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Users"
        description="Kelola data user untuk sistem Smart Billiard POS"
        actions={[
          {
            label: 'Tambah User',
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
            Cari user
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan username atau nama..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="Belum ada user"
          description={searchTerm ? 'Tidak ditemukan user yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan user pertama.'}
        />
      ) : (
        <>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Username
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Bergabung
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      {user.username}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                      {getRoleLabel(user.role)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.date_joined ? new Date(user.date_joined).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }) : '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleOpenEditModal(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(user)}
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
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                  {editingUser ? 'Edit User' : 'Tambah User'}
                </h3>
                <UserForm
                  user={editingUser}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseFormModal}
                  isLoading={createMutation.isPending || updateMutation.isPending}
                  apiError={formApiError}
                  currentUserRole={currentUserRole}
                  tenants={tenants}
                  outlets={outlets}
                  tenantsLoading={tenantsLoading}
                  outletsLoading={outletsLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus User"
        message={`Apakah Anda yakin ingin menghapus user "${deleteTarget?.username}"? Tindakan ini tidak dapat dibatalkan.`}
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
