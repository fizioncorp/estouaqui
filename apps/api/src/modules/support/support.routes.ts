import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { supportController } from "./support.controller.js";

export const supportRouter = Router();

supportRouter.use(authMiddleware);
supportRouter.post("/triage", roleMiddleware(["USER", "VOLUNTEER", "ADMIN"]), supportController.createTriage);
supportRouter.post("/checkins", roleMiddleware(["USER", "VOLUNTEER", "ADMIN"]), supportController.createCheckin);
supportRouter.get("/checkins/me", supportController.getMyCheckins);
supportRouter.post("/requests", roleMiddleware(["USER", "VOLUNTEER", "ADMIN"]), supportController.createSupportRequest);
supportRouter.get("/requests/me", supportController.getMyRequests);
supportRouter.get("/requests/waiting", roleMiddleware(["VOLUNTEER", "ADMIN"]), supportController.getWaitingRequests);
supportRouter.post("/requests/:id/cancel", roleMiddleware(["USER", "VOLUNTEER", "ADMIN"]), supportController.cancelSupportRequest);
supportRouter.post("/requests/:id/close", roleMiddleware(["USER", "VOLUNTEER", "ADMIN"]), supportController.closeSupportRequest);
