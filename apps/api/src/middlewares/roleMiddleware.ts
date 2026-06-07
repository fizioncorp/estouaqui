import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authMiddleware.js";
import { AppError } from "../utils/errors.js";

export function roleMiddleware(roles: Array<"USER" | "VOLUNTEER" | "ADMIN">) {
  return (request: AuthenticatedRequest, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new AppError("Autenticação obrigatória.", 401));
    }

    if (!roles.includes(request.user.role)) {
      return next(new AppError("Você não tem permissão para esta ação.", 403));
    }

    next();
  };
}
