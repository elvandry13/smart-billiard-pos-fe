import { z } from 'zod';

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().optional(),
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().email('Format email tidak valid').optional(),
);

export const updateProfileSchema = z.object({
  email: optionalEmail,
  phone: optionalTrimmedString,
  first_name: optionalTrimmedString,
  last_name: optionalTrimmedString,
});

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Password lama wajib diisi'),
    new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirm_password: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: 'Konfirmasi password tidak sama',
    path: ['confirm_password'],
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;