import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { usersController } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.use(authMiddleware);
usersRouter.get("/me", usersController.getMe);
usersRouter.patch("/me", usersController.updateMe);
usersRouter.delete("/me", usersController.deleteMe);
