import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";
import { AppError } from "./errorHandler";
import type { UserRole } from "@ma/shared";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: UserRole; email: string };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "No token provided", "UNAUTHORIZED"));
  }
  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token", "TOKEN_INVALID"));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new AppError(401, "Unauthorized", "UNAUTHORIZED"));
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, "Insufficient permissions", "FORBIDDEN"));
    }
    next();
  };
}
