import { SupportCategory, Urgency } from "@prisma/client";
import { z } from "zod";

export const triageSchema = z.object({
  isEmergency: z.boolean(),
  description: z.string().max(500).optional()
});

export const emotionalCheckinSchema = z.object({
  mood: z.number().int().min(1).max(5),
  anxiety: z.number().int().min(1).max(5),
  loneliness: z.number().int().min(1).max(5),
  sadness: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  note: z.string().max(1200).optional(),
  wantsHumanSupport: z.boolean().default(false)
});

export const supportRequestSchema = z.object({
  category: z.nativeEnum(SupportCategory),
  urgency: z.nativeEnum(Urgency),
  initialMessage: z.string().max(1000).optional()
});
