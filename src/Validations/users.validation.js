import { z } from 'zod';

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(255)
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email address')
      .max(255)
      .toLowerCase()
      .trim()
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid user id'),
});
