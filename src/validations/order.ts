import { z } from 'zod';

export const placeOrderSchema = z.object({
  body: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
});
