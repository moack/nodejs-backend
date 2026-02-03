import { z } from 'zod';

// LoginRequest
export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(4).max(50),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

// LoginResponse
export const loginResponseSchema = z.object({
  token: z.string(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
