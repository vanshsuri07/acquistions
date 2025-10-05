import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(256).trim().optional(),
  email: z.string().email().max(256).trim().toLowerCase().optional(),
  role: z.enum(['user', 'admin']).optional(),
});
