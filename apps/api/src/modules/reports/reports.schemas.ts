import { ReportReason, ReportStatus } from "@prisma/client";
import { z } from "zod";

export const createReportSchema = z.object({
  conversationId: z.string().uuid(),
  reason: z.nativeEnum(ReportReason),
  description: z.string().max(1500).optional()
});

export const updateReportStatusSchema = z.object({
  status: z.nativeEnum(ReportStatus)
});
