import { z } from 'zod';

export const tableTypeSchema = z.object({
  name: z.string().min(1, 'Nama tipe meja wajib diisi').max(100, 'Nama tipe meja maksimal 100 karakter'),
  description: z.string().max(500, 'Deskripsi maksimal 500 karakter').nullable().optional(),
});

export const tableSchema = z.object({
  table_type: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, 'Tipe meja wajib dipilih'),
  name: z.string().min(1, 'Nama meja wajib diisi').max(100, 'Nama meja maksimal 100 karakter'),
  status: z.enum(['available', 'occupied', 'maintenance', 'reserved']).optional(),
});

export const createTableTypeSchema = tableTypeSchema;
export const updateTableTypeSchema = tableTypeSchema.partial();

export const createTableSchema = tableSchema;
export const updateTableSchema = tableSchema.partial();

export type TableTypeFormData = z.infer<typeof tableTypeSchema>;
export type CreateTableTypeFormData = z.infer<typeof createTableTypeSchema>;
export type UpdateTableTypeFormData = z.infer<typeof updateTableTypeSchema>;

export type TableFormData = z.infer<typeof tableSchema>;
export type CreateTableFormData = z.infer<typeof createTableSchema>;
export type UpdateTableFormData = z.infer<typeof updateTableSchema>;