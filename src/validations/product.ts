import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().min(10),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category: z.string().min(1),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z.string().min(1).optional(),
  }).refine((data: Record<string, unknown>) => Object.keys(data).length > 0, { message: 'At least one field must be provided' }),
});

export const getByIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    pageSize: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    inStock: z.string().optional(),
    sortBy: z.enum(['name', 'price', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
