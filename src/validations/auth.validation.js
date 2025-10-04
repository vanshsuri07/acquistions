import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(2).max(256).trim(),
  email: z.string().max(256).trim().toLowerCase(),
  password: z.string().min(6).max(128),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
  email: z.email().toLowerCase().trim(),
  password: z.string().min(1),
});
