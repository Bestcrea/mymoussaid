import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { AccountStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import {
  sendAccountApprovedEmail,
  sendAccountRejectedEmail,
} from "../lib/mailer";

const userAdminSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  firstNameAr: true,
  lastNameAr: true,
  phone: true,
  role: true,
  specialty: true,
  accountType: true,
  status: true,
  civility: true,
  cinNumber: true,
  city: true,
  address: true,
  licenseNumber: true,
  regionalCouncil: true,
  billingType: true,
  billingName: true,
  billingCity: true,
  billingAddress: true,
  billingCin: true,
  billingIce: true,
  billingRc: true,
  rejectionReason: true,
  approvedAt: true,
  rejectedAt: true,
  createdAt: true,
} as const;

const rejectSchema = z.object({
  reason: z.string().min(3, "La raison du refus est requise"),
});

export async function getPendingUsers(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await prisma.user.findMany({
      where: { status: "PENDING" },
      select: userAdminSelect,
      orderBy: { createdAt: "desc" },
    });
    res.json({ users, total: users.length });
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const status = req.query.status as AccountStatus | undefined;
    const users = await prisma.user.findMany({
      where: status ? { status } : undefined,
      select: userAdminSelect,
      orderBy: { createdAt: "desc" },
    });
    res.json({ users, total: users.length });
  } catch (err) {
    next(err);
  }
}

export async function approveUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, "Utilisateur introuvable", "NOT_FOUND");

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        rejectedAt: null,
        rejectionReason: null,
        isVerified: true,
      },
      select: userAdminSelect,
    });

    try {
      await sendAccountApprovedEmail({
        to: user.email,
        firstName: user.firstName,
      });
    } catch (mailErr) {
      // Don't fail approval if email fails
      console.error("Failed to send approval email", mailErr);
    }

    res.json({ user, message: "Compte approuvé avec succès" });
  } catch (err) {
    next(err);
  }
}

export async function rejectUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { reason } = rejectSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) throw new AppError(404, "Utilisateur introuvable", "NOT_FOUND");

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
        rejectedAt: new Date(),
        approvedAt: null,
      },
      select: userAdminSelect,
    });

    try {
      await sendAccountRejectedEmail({
        to: user.email,
        firstName: user.firstName,
        reason,
      });
    } catch (mailErr) {
      console.error("Failed to send rejection email", mailErr);
    }

    res.json({ user, message: "Compte refusé" });
  } catch (err) {
    next(err);
  }
}
