import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { volunteerApplicationSchema } from "./volunteers.schemas.js";
import { volunteersService } from "./volunteers.service.js";

export const volunteersController = {
  async apply(request: AuthenticatedRequest, response: Response) {
    const data = volunteerApplicationSchema.parse(request.body);
    const result = await volunteersService.apply(request.user!.id, data);
    response.status(201).json(result);
  },

  async getMe(request: AuthenticatedRequest, response: Response) {
    const result = await volunteersService.getMe(request.user!.id);
    response.json(result);
  },

  async completeTraining(request: AuthenticatedRequest, response: Response) {
    const result = await volunteersService.completeTraining(request.user!.id);
    response.json(result);
  },

  async dashboard(request: AuthenticatedRequest, response: Response) {
    const result = await volunteersService.dashboard(request.user!.id);
    response.json(result);
  }
};
