import { z } from 'zod';

export const DAY_TYPE_OPTIONS = [
  { value: 'weekday', label: 'Weekday' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'specific_day', label: 'Hari Tertentu' },
] as const;

export const ADDITIONAL_FEE_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Persentase' },
  { value: 'fixed', label: 'Nominal Tetap' },
] as const;

export const pricingRuleSchema = z.object({
  name: z.string().min(1, 'Nama aturan harga wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  day_type: z.enum(['weekday', 'weekend', 'specific_day']),
  specific_date: z.string().nullable().optional(),
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  price_per_minute: z.string().min(1, 'Harga per menit wajib diisi'),
  is_active: z.boolean().optional(),
});

export const additionalFeeSchema = z.object({
  name: z.string().min(1, 'Nama biaya tambahan wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  type: z.enum(['percentage', 'fixed']),
  value: z.string().min(1, 'Nilai biaya wajib diisi'),
  is_active: z.boolean().optional(),
});

export const createPricingRuleSchema = pricingRuleSchema;
export const updatePricingRuleSchema = pricingRuleSchema.partial();

export const createAdditionalFeeSchema = additionalFeeSchema;
export const updateAdditionalFeeSchema = additionalFeeSchema.partial();

export type PricingRuleFormData = z.infer<typeof pricingRuleSchema>;
export type CreatePricingRuleFormData = z.infer<typeof createPricingRuleSchema>;
export type UpdatePricingRuleFormData = z.infer<typeof updatePricingRuleSchema>;

export type AdditionalFeeFormData = z.infer<typeof additionalFeeSchema>;
export type CreateAdditionalFeeFormData = z.infer<typeof createAdditionalFeeSchema>;
export type UpdateAdditionalFeeFormData = z.infer<typeof updateAdditionalFeeSchema>;
