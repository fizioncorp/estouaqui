import { Router } from "express";
import { authController } from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { loginRateLimit } from "../../middlewares/rateLimitMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", loginRateLimit, authController.login);
authRouter.get("/me", authMiddleware, authController.me);
authRouter.post("/logout", authController.logout);
