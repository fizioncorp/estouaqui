import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { adminController } from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware(["ADMIN"]));
adminRouter.get("/dashboard", adminController.dashboard);
adminRouter.get("/volunteers", adminController.volunteers);
adminRouter.patch("/volunteers/:id/approve", adminController.approveVolunteer);
adminRouter.patch("/volunteers/:id/reject", adminController.rejectVolunteer);
adminRouter.patch("/volunteers/:id/block", adminController.blockVolunteer);
adminRouter.get("/conversations/reported", adminController.reportedConversations);
adminRouter.get("/safety-events", adminController.safetyEvents);
adminRouter.get("/reports", adminController.reports);
adminRouter.patch("/reports/:id/status", adminController.updateReportStatus);
