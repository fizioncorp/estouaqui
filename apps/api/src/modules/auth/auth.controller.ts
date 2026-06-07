import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middlewares/authMiddleware.js";
import { registerSchema, loginSchema } from "./auth.schemas.js";
import { authService } from "./auth.service.js";

export const authController = {
  async register(request: Request, response: Response) {
    const data = registerSchema.parse(request.body);
    const result = await authService.register(data);
    response.status(201).json(result);
  },

  async login(request: Request, response: Response) {
    const data = loginSchema.parse(request.body);
    const result = await authService.login(data);
    response.json(result);
  },

  async me(request: AuthenticatedRequest, response: Response) {
    const result = await authService.me(request.user!.id);
    response.json(result);
  },

  async logout(_request: Request, response: Response) {
    response.json({ message: "Logout realizado com sucesso." });
  }
};
