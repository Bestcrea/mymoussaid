import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const recentBidSelect = {
  id: true,
  title: true,
  task: true,
  budget: true,
  deadline: true,
  specialty: true,
  status: true,
  createdAt: true,
  project: {
    select: {
      id: true,
      title: true,
      dossierNumber: true,
    },
  },
} as const;

const recentProjectSelect = {
  id: true,
  dossierNumber: true,
  title: true,
  stage: true,
  city: true,
  createdAt: true,
} as const;

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authUser = req.user!;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: authUser.id },
      select: {
        phone: true,
        specialty: true,
        _count: { select: { projectMembers: true } },
      },
    });

    if (authUser.role === "INTERVENANT") {
      const projectFilter = {
        members: { some: { userId: authUser.id } },
      };

      const [
        offresSubmitted,
        offresAccepted,
        projetsActifs,
        messagesNonLus,
        recentBids,
        recentOffers,
      ] = await prisma.$transaction([
        prisma.offer.count({ where: { submittedById: authUser.id } }),
        prisma.offer.count({
          where: { submittedById: authUser.id, status: "ACCEPTEE" },
        }),
        prisma.project.count({
          where: { ...projectFilter, stage: { not: "TERMINE" } },
        }),
        prisma.message.count({
          where: {
            project: projectFilter,
            NOT: { readBy: { has: authUser.id } },
          },
        }),
        prisma.bid.findMany({
          where: {
            status: "OUVERTE",
            ...(user.specialty ? { specialty: user.specialty } : {}),
            offers: { none: { submittedById: authUser.id } },
          },
          select: recentBidSelect,
          orderBy: { createdAt: "desc" },
          take: 3,
        }),
        prisma.offer.findMany({
          where: { submittedById: authUser.id },
          select: {
            id: true,
            price: true,
            timeline: true,
            status: true,
            createdAt: true,
            bid: {
              select: {
                id: true,
                title: true,
                task: true,
                project: { select: { id: true, title: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 3,
        }),
      ]);

      return res.json({
        offresSubmitted,
        offresAccepted,
        projetsActifs,
        messagesNonLus,
        recentBids,
        recentOffers,
        profile: {
          hasSpecialty: Boolean(user.specialty),
          hasPhone: Boolean(user.phone),
          hasJoinedProject: user._count.projectMembers > 0,
        },
      });
    }

    // Aligné sur getMyProjects : owner OR secretary OR member
    const projectFilter =
      authUser.role === "ADMIN"
        ? {}
        : {
            OR: [
              { ownerId: authUser.id },
              { secretaryId: authUser.id },
              { members: { some: { userId: authUser.id } } },
            ],
          };

    const [
      projetsActifs,
      documents,
      aoOuverts,
      messagesNonLus,
      recentProjects,
      recentBids,
    ] = await prisma.$transaction([
      prisma.project.count({
        where: { ...projectFilter, stage: { not: "TERMINE" } },
      }),
      prisma.document.count({ where: { project: projectFilter } }),
      prisma.bid.count({
        where: { project: projectFilter, status: "OUVERTE" },
      }),
      prisma.message.count({
        where: {
          project: projectFilter,
          NOT: { readBy: { has: authUser.id } },
        },
      }),
      prisma.project.findMany({
        where: projectFilter,
        select: recentProjectSelect,
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.bid.findMany({
        where: { project: projectFilter },
        select: recentBidSelect,
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    return res.json({
      projetsActifs,
      documents,
      aoOuverts,
      messagesNonLus,
      recentProjects,
      recentBids,
    });
  } catch (error) {
    next(error);
  }
}
