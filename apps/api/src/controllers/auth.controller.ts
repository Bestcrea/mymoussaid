import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { redis, keys, TTL } from "../lib/redis";
import { AppError } from "../middleware/errorHandler";
import { registerSchema, loginSchema } from "@ma/shared";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError(409, "Email already in use", "EMAIL_TAKEN");

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        specialty: data.role === "INTERVENANT" ? data.specialty ?? null : null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        specialty: true,
      },
    });

    const accessToken  = signToken({ sub: user.id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id });
    await redis.setex(keys.session(user.id), TTL.refreshSession, refreshToken);

    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new AppError(401, "Invalid credentials", "INVALID_CREDENTIALS");

    const accessToken  = signToken({ sub: user.id, role: user.role, email: user.email });
    const refreshToken = signRefreshToken({ sub: user.id });
    await redis.setex(keys.session(user.id), TTL.refreshSession, refreshToken);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        specialty: user.specialty,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken: token } = req.body as { refreshToken: string };
    if (!token) throw new AppError(400, "Refresh token required", "MISSING_TOKEN");

    const { sub } = verifyRefreshToken(token);
    const stored = await redis.get(keys.session(sub));
    if (stored !== token) throw new AppError(401, "Invalid refresh token", "TOKEN_INVALID");

    const user = await prisma.user.findUniqueOrThrow({ where: { id: sub } });
    const newAccessToken = signToken({ sub: user.id, role: user.role, email: user.email });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) await redis.del(keys.session(req.user.id));
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        specialty: true,
        phone: true,
        createdAt: true,
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
