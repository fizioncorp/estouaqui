import type { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    role: "USER" | "VOLUNTEER" | "ADMIN";
    email: string;
    name: string;
  };
};

export async function authMiddleware(
  request: AuthenticatedRequest,
  _response: Response,
  next: NextFunction
) {
  const authorization = request.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    return next(new AppError("Autenticação obrigatória.", 401));
  }

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return next(new AppError("Usuário inválido ou inativo.", 401));
    }

    request.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}
