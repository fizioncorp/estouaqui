import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { conversationsService } from "./conversations.service.js";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value || "";
}

export const conversationsController = {
  async acceptSupportRequest(request: AuthenticatedRequest, response: Response) {
    const result = await conversationsService.acceptSupportRequest(
      request.user!.id,
      getRouteParam(request.params.supportRequestId)
    );
    response.status(201).json(result);
  },

  async getMyConversations(request: AuthenticatedRequest, response: Response) {
    const result = await conversationsService.getMyConversations(
      request.user!.id,
      request.user!.role
    );
    response.json(result);
  },

  async getConversation(request: AuthenticatedRequest, response: Response) {
    const result = await conversationsService.getConversation(
      request.user!.id,
      request.user!.role,
      getRouteParam(request.params.id)
    );
    response.json(result);
  },

  async closeConversation(request: AuthenticatedRequest, response: Response) {
    const result = await conversationsService.closeConversation(
      request.user!.id,
      request.user!.role,
      getRouteParam(request.params.id)
    );
    response.json(result);
  },

  async escalateConversation(request: AuthenticatedRequest, response: Response) {
    const result = await conversationsService.escalateConversation(
      request.user!.id,
      request.user!.role,
      getRouteParam(request.params.id)
    );
    response.json(result);
  }
};
