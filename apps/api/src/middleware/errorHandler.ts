import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import { logger } from "../lib/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation error",
      code: "VALIDATION_ERROR",
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large"
        : err.message;
    res.status(400).json({
      error: message,
      code: err.code,
    });
    return;
  }

  if (err instanceof Error && err.message === "File type not allowed") {
    res.status(400).json({
      error: err.message,
      code: "FILE_TYPE_NOT_ALLOWED",
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      message: err.message,
      code: err.code ?? "APP_ERROR",
    });
    return;
  }

  logger.error("Unhandled error", { err });
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
