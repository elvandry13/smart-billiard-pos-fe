import { z } from 'zod';
import type { Role } from '@/types/auth';

export const roleOptions: Role[] = ['super_admin', 'owner', 'admin', 'officer'];

export const superAdminRoleOptions: Role[] = ['super_admin', 'owner', 'admin', 'officer'];

export const adminRoleOptions: Role[] = ['admin', 'officer'];

export const userSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi').max(150, 'Username maksimal 150 karakter'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().max(20, 'Nomor telepon maksimal 20 karakter').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'owner', 'admin', 'officer'], {
    message: 'Role wajib dipilih',
  }),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  tenant: z.union([z.number(), z.string()]).optional().nullable(),
  outlet: z.union([z.number(), z.string()]).optional().nullable(),
  first_name: z.string().max(150, 'Nama depan maksimal 150 karakter').optional().or(z.literal('')),
  last_name: z.string().max(150, 'Nama belakang maksimal 150 karakter').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

export const createUserSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi').max(150, 'Username maksimal 150 karakter'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().max(20, 'Nomor telepon maksimal 20 karakter').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'owner', 'admin', 'officer'], {
    message: 'Role wajib dipilih',
  }),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  tenant: z.union([z.number(), z.string()]).optional().nullable(),
  outlet: z.union([z.number(), z.string()]).optional().nullable(),
  first_name: z.string().max(150, 'Nama depan maksimal 150 karakter').optional().or(z.literal('')),
  last_name: z.string().max(150, 'Nama belakang maksimal 150 karakter').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi').max(150, 'Username maksimal 150 karakter').optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().max(20, 'Nomor telepon maksimal 20 karakter').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'owner', 'admin', 'officer'], {
    message: 'Role wajib dipilih',
  }).optional(),
  password: z.string().min(8, 'Password minimal 8 karakter').optional(),
  tenant: z.union([z.number(), z.string()]).optional().nullable(),
  outlet: z.union([z.number(), z.string()]).optional().nullable(),
  first_name: z.string().max(150, 'Nama depan maksimal 150 karakter').optional().or(z.literal('')),
  last_name: z.string().max(150, 'Nama belakang maksimal 150 karakter').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
