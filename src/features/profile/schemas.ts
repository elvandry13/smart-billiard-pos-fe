import { z } from 'zod';

// Simple optional string without preprocess (to avoid type issues)
export const updateProfileSchema = z.object({
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  first_name: z.string().optional().or(z.literal('')),
  last_name: z.string().optional().or(z.literal('')),
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
  })
  .refine((values) => values.new_password !== values.old_password, {
    message: 'Password baru harus berbeda dari password lama',
    path: ['new_password'],
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
