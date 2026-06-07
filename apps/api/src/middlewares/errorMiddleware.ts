import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return response.status(422).json({
      message: "Dados inválidos.",
      issues: error.flatten()
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Ocorreu um erro inesperado."
  });
}
