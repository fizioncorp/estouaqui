import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { conversationsController } from "./conversations.controller.js";

export const conversationsRouter = Router();

conversationsRouter.use(authMiddleware);
conversationsRouter.post(
  "/:supportRequestId/accept",
  roleMiddleware(["VOLUNTEER"]),
  conversationsController.acceptSupportRequest
);
conversationsRouter.get("/me", conversationsController.getMyConversations);
conversationsRouter.get("/:id", conversationsController.getConversation);
conversationsRouter.post("/:id/close", conversationsController.closeConversation);
conversationsRouter.post("/:id/escalate", conversationsController.escalateConversation);
