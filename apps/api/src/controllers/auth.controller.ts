import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import type { IntervenantSpecialty, UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { signToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { redis, keys, TTL } from "../lib/redis";
import { AppError } from "../middleware/errorHandler";
import { registerSchema, loginSchema } from "@ma/shared";

const ACCOUNT_TYPE_ROLE: Record<string, UserRole> = {
  client: "CLIENT",
  personne_morale: "CLIENT",
  architecte: "INTERVENANT",
  ingenieur: "INTERVENANT",
  intervenant: "INTERVENANT",
  entrepreneur: "INTERVENANT",
  secretaire: "SECRETAIRE",
  partenaire: "INTERVENANT",
};

const ACCOUNT_TYPE_SPECIALTY: Record<string, IntervenantSpecialty | undefined> = {
  architecte: "ARCHITECTE",
  ingenieur: "TOPOGRAPHE",
  entrepreneur: "AUTRE",
  partenaire: "BUREAU_CONTROLE",
};

function resolveRoleAndSpecialty(data: {
  accountType: string;
  role?: "CLIENT" | "INTERVENANT" | "SECRETAIRE";
  specialty?: IntervenantSpecialty;
}): { role: UserRole; specialty: IntervenantSpecialty | null } {
  const role =
    ACCOUNT_TYPE_ROLE[data.accountType] ??
    (data.role as UserRole | undefined) ??
    "CLIENT";

  let specialty: IntervenantSpecialty | null = null;
  if (role === "INTERVENANT") {
    specialty =
      data.specialty ??
      ACCOUNT_TYPE_SPECIALTY[data.accountType] ??
      null;
  }

  return { role, specialty };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError(409, "Email already in use", "EMAIL_TAKEN");

    const { role, specialty } = resolveRoleAndSpecialty(data);
    const hashedPassword = await bcrypt.hash(data.password, 12);

    await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role,
        phone: data.phone,
        specialty,
        status: "PENDING",
        accountType: data.accountType,
        civility: data.civility,
        cinNumber: data.cinNumber,
        firstNameAr: data.firstNameAr,
        lastNameAr: data.lastNameAr,
        city: data.city,
        address: data.address,
        licenseNumber: data.licenseNumber,
        regionalCouncil: data.regionalCouncil,
        billingType: data.billingType,
        billingName: data.billingName,
        billingCity: data.billingCity,
        billingAddress: data.billingAddress,
        billingCin: data.billingCin,
        billingIce: data.billingIce,
        billingRc: data.billingRc,
      },
    });

    res.status(201).json({
      success: true,
      message:
        "Votre demande a été soumise avec succès. Notre équipe examinera votre dossier dans les meilleurs délais.",
      status: "PENDING",
    });
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

    if (user.status === "PENDING") {
      throw new AppError(
        403,
        "Votre compte est en attente de validation. Vous serez notifié par email dès validation.",
        "ACCOUNT_PENDING"
      );
    }
    if (user.status === "REJECTED") {
      throw new AppError(
        403,
        "Votre demande a été refusée. Contactez-nous pour plus d'informations.",
        "ACCOUNT_REJECTED"
      );
    }
    if (user.status === "SUSPENDED") {
      throw new AppError(
        403,
        "Votre compte a été suspendu.",
        "ACCOUNT_SUSPENDED"
      );
    }

    const accessToken = signToken({ sub: user.id, role: user.role, email: user.email });
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
        status: user.status,
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

    if (user.status !== "APPROVED") {
      throw new AppError(403, "Compte non autorisé", "ACCOUNT_NOT_APPROVED");
    }

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
        status: true,
        city: true,
        createdAt: true,
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
