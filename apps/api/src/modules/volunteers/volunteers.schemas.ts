import { z } from "zod";

export const volunteerApplicationSchema = z.object({
  motivation: z.string().min(20).max(1500),
  experience: z.string().max(1000).optional(),
  availability: z.string().max(300).optional(),
  acceptedVolunteerTerms: z.literal(true)
});
