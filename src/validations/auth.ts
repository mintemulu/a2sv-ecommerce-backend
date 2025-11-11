import { z } from 'zod';

const passwordSchema = z.string().min(8).regex(/[A-Z]/, 'Password must include at least one uppercase letter').regex(/[a-z]/, 'Password must include at least one lowercase letter').regex(/[0-9]/, 'Password must include at least one number').regex(/[!@#$%^&*(),.?":{}|<>\-_/]/, 'Password must include at least one special character');

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(1).regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
    email: z.string().email(),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
