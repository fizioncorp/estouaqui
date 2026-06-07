import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { roleMiddleware } from "../../middlewares/roleMiddleware.js";
import { volunteersController } from "./volunteers.controller.js";

export const volunteersRouter = Router();

volunteersRouter.use(authMiddleware);
volunteersRouter.post("/apply", roleMiddleware(["USER", "VOLUNTEER"]), volunteersController.apply);
volunteersRouter.get("/me", roleMiddleware(["VOLUNTEER", "ADMIN"]), volunteersController.getMe);
volunteersRouter.post(
  "/training/complete",
  roleMiddleware(["VOLUNTEER"]),
  volunteersController.completeTraining
);
volunteersRouter.get("/dashboard", roleMiddleware(["VOLUNTEER"]), volunteersController.dashboard);
