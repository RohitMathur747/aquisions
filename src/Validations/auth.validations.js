import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255).trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(128),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .max(255)
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});
