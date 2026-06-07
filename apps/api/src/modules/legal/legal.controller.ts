import type { Request, Response } from "express";
import { z } from "zod";
import { legalVersion, privacyText, termsText, volunteerTermsText } from "../../constants/legalTexts.js";
import { prisma } from "../../utils/prisma.js";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";

const acceptSchema = z.object({
  type: z.enum(["TERMS", "PRIVACY", "VOLUNTEER_TERMS", "SAFETY_NOTICE"])
});

export const legalController = {
  terms(_request: Request, response: Response) {
    response.json(termsText);
  },

  privacy(_request: Request, response: Response) {
    response.json(privacyText);
  },

  volunteerTerms(_request: Request, response: Response) {
    response.json(volunteerTermsText);
  },

  async accept(request: AuthenticatedRequest, response: Response) {
    const data = acceptSchema.parse(request.body);
    const consent = await prisma.consentLog.create({
      data: {
        userId: request.user!.id,
        type: data.type,
        version: legalVersion,
        acceptedAt: new Date()
      }
    });

    response.status(201).json(consent);
  }
};
