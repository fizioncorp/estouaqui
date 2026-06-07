import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(128),
  displayName: z.string().max(80).optional(),
  acceptedTerms: z.literal(true),
  acceptedPrivacy: z.literal(true)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128)
});
