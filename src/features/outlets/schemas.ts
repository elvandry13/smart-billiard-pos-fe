import { z } from 'zod';

export const outletSchema = z.object({
  code: z.string().min(1, 'Kode outlet wajib diisi').max(50, 'Kode outlet maksimal 50 karakter'),
  tenant: z.union([
    z.number(),
    z.string().min(1, 'Tenant wajib dipilih'),
  ]),
  name: z.string().min(1, 'Nama outlet wajib diisi').max(255, 'Nama outlet maksimal 255 karakter'),
  address: z.string().max(500, 'Alamat maksimal 500 karakter').optional().nullable(),
  timezone: z.string().max(100, 'Timezone maksimal 100 karakter').optional().nullable(),
  is_active: z.boolean().optional(),
});

export const createOutletSchema = outletSchema;

export const updateOutletSchema = outletSchema.partial();

export type OutletFormData = z.infer<typeof outletSchema>;
export type CreateOutletFormData = z.infer<typeof createOutletSchema>;
export type UpdateOutletFormData = z.infer<typeof updateOutletSchema>;
