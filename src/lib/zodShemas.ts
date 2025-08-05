import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(['user', 'seller', 'admin']).optional().default('user'),
});

export const createReviewSchema = z.object({
  content: z.string().min(3),
  productId: z.string(),
});

export const createProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  description: z.string().min(5),
});
