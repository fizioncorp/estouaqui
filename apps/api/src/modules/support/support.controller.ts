import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import {
  emotionalCheckinSchema,
  supportRequestSchema,
  triageSchema
} from "./support.schemas.js";
import { supportService } from "./support.service.js";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

export const supportController = {
  async createTriage(request: AuthenticatedRequest, response: Response) {
    const data = triageSchema.parse(request.body);
    const result = await supportService.createTriage(request.user!.id, data);
    response.status(201).json(result);
  },

  async createCheckin(request: AuthenticatedRequest, response: Response) {
    const data = emotionalCheckinSchema.parse(request.body);
    const result = await supportService.createCheckin(request.user!.id, data);
    response.status(201).json(result);
  },

  async getMyCheckins(request: AuthenticatedRequest, response: Response) {
    const result = await supportService.getMyCheckins(request.user!.id);
    response.json(result);
  },

  async createSupportRequest(request: AuthenticatedRequest, response: Response) {
    const data = supportRequestSchema.parse(request.body);
    const result = await supportService.createSupportRequest(request.user!.id, data);
    response.status(201).json(result);
  },

  async getMyRequests(request: AuthenticatedRequest, response: Response) {
    const result = await supportService.getMyRequests(request.user!.id);
    response.json(result);
  },

  async getWaitingRequests(request: AuthenticatedRequest, response: Response) {
    const result = await supportService.getWaitingRequests(request.user!.id);
    response.json(result);
  },

  async cancelSupportRequest(request: AuthenticatedRequest, response: Response) {
    const result = await supportService.cancelSupportRequest(
      request.user!.id,
      getRouteParam(request.params.id)
    );
    response.json(result);
  },

  async closeSupportRequest(request: AuthenticatedRequest, response: Response) {
    const result = await supportService.closeSupportRequest(
      request.user!.id,
      getRouteParam(request.params.id)
    );
    response.json(result);
  }
};
