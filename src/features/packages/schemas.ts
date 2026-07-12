import { z } from 'zod';

export const PACKAGE_TYPE_OPTIONS = [
  { value: 'per_minute', label: 'Per Menit' },
  { value: 'fixed_duration', label: 'Durasi Tetap' },
  { value: 'open_loss', label: 'Open Loss' },
  { value: 'happy_hour', label: 'Happy Hour' },
] as const;

export const VALID_DAY_TYPE_OPTIONS = [
  { value: 'all', label: 'Semua Hari' },
  { value: 'weekday', label: 'Weekday' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'specific_day', label: 'Hari Tertentu' },
] as const;

export const packageSchema = z.object({
  name: z.string().min(1, 'Nama paket wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  type: z.enum(['per_minute', 'fixed_duration', 'open_loss', 'happy_hour']),
  duration_minutes: z.number().nullable().optional(),
  fixed_price: z.string().nullable().optional(),
  price_per_minute: z.string().nullable().optional(),
  valid_day_type: z.enum(['all', 'weekday', 'weekend', 'specific_day']).nullable().optional(),
  specific_date: z.string().nullable().optional(),
  valid_start_time: z.string().nullable().optional(),
  valid_end_time: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
});

export const createPackageSchema = packageSchema;
export const updatePackageSchema = packageSchema.partial();

export type PackageFormData = z.infer<typeof packageSchema>;
export type CreatePackageFormData = z.infer<typeof createPackageSchema>;
export type UpdatePackageFormData = z.infer<typeof updatePackageSchema>;
