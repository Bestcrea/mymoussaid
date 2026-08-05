import jwt from "jsonwebtoken";
import type { UserRole } from "@ma/shared";

const SECRET         = process.env["JWT_SECRET"] ?? "dev_secret_change_me";
const REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"] ?? "dev_refresh_secret";
const EXPIRES_IN     = process.env["JWT_EXPIRES_IN"] ?? "15m";
const REFRESH_EXP    = process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d";

export interface JWTPayload {
  sub: string;      // userId
  role: UserRole;
  email: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: Pick<JWTPayload, "sub">): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}

export function verifyRefreshToken(token: string): Pick<JWTPayload, "sub"> {
  return jwt.verify(token, REFRESH_SECRET) as Pick<JWTPayload, "sub">;
}
