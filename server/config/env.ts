import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default('3001'),
  JWT_SECRET: z.string().min(10),
  GEMINI_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
