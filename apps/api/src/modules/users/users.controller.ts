import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { usersService } from "./users.service.js";

const updateMeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  displayName: z.string().max(80).nullable().optional(),
  isAnonymousMode: z.boolean().optional()
});

export const usersController = {
  async getMe(request: AuthenticatedRequest, response: Response) {
    const result = await usersService.getMe(request.user!.id);
    response.json(result);
  },

  async updateMe(request: AuthenticatedRequest, response: Response) {
    const data = updateMeSchema.parse(request.body);
    const result = await usersService.updateMe(request.user!.id, data);
    response.json(result);
  },

  async deleteMe(request: AuthenticatedRequest, response: Response) {
    const result = await usersService.deleteMe(request.user!.id);
    response.json(result);
  }
};
