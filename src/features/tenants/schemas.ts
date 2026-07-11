import { z } from 'zod';

export const tenantSchema = z.object({
  code: z.string().min(1, 'Kode tenant wajib diisi').max(50, 'Kode tenant maksimal 50 karakter'),
  name: z.string().min(1, 'Nama tenant wajib diisi').max(255, 'Nama tenant maksimal 255 karakter'),
  is_active: z.boolean().optional(),
});

export const createTenantSchema = tenantSchema;

export const updateTenantSchema = tenantSchema.partial();

export type TenantFormData = z.infer<typeof tenantSchema>;
export type CreateTenantFormData = z.infer<typeof createTenantSchema>;
export type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;
