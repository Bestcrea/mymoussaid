import type { Request, Response, NextFunction } from "express";
import type { IntervenantSpecialty, UserRole } from "@ma/shared";
import { createBidSchema } from "@ma/shared";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const bidListSelect = {
  id: true,
  title: true,
  description: true,
  task: true,
  specialty: true,
  status: true,
  deadline: true,
  budget: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
  project: {
    select: {
      id: true,
      title: true,
      dossierNumber: true,
      ownerId: true,
    },
  },
  _count: { select: { offers: true } },
} as const;

async function getProjectForBidAction(
  projectId: string,
  userId: string,
  userRole: UserRole
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { select: { userId: true } } },
  });

  if (!project) {
    throw new AppError(404, "Project not found", "NOT_FOUND");
  }

  if (userRole === "ADMIN") return project;

  const hasAccess =
    project.ownerId === userId ||
    project.secretaryId === userId ||
    project.members.some((member) => member.userId === userId);

  if (!hasAccess) {
    throw new AppError(403, "Access denied", "FORBIDDEN");
  }

  return project;
}

async function assertProjectOwnerOrSecretary(
  projectId: string,
  userId: string,
  userRole: UserRole
) {
  const project = await getProjectForBidAction(projectId, userId, userRole);

  if (
    userRole !== "ADMIN" &&
    project.ownerId !== userId &&
    project.secretaryId !== userId
  ) {
    throw new AppError(
      403,
      "Only the project owner or secretary can perform this action",
      "FORBIDDEN"
    );
  }

  return project;
}

async function getBidWithProject(bidId: string) {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          dossierNumber: true,
          ownerId: true,
          secretaryId: true,
        },
      },
    },
  });

  if (!bid) {
    throw new AppError(404, "Bid not found", "NOT_FOUND");
  }

  return bid;
}

export async function createBid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;

    await assertProjectOwnerOrSecretary(projectId, user.id, user.role);

    if (user.role !== "CLIENT" && user.role !== "SECRETAIRE" && user.role !== "ADMIN") {
      throw new AppError(403, "Insufficient permissions", "FORBIDDEN");
    }

    const data = createBidSchema.parse(req.body);

    const bid = await prisma.bid.create({
      data: {
        title: data.title,
        description: data.description,
        task: data.task,
        specialty: data.specialty as IntervenantSpecialty | undefined,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        budget: data.budget,
        projectId,
      },
      select: bidListSelect,
    });

    res.status(201).json({ bid });
  } catch (err) {
    next(err);
  }
}

export async function getBidsByProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;

    await getProjectForBidAction(projectId, user.id, user.role);

    const bids = await prisma.bid.findMany({
      where: { projectId },
      select: bidListSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json({ bids });
  } catch (err) {
    next(err);
  }
}

export async function getAllPublicBids(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const specialty = req.query["specialty"] as string | undefined;

    if (user.role === "INTERVENANT") {
      const bids = await prisma.bid.findMany({
        where: {
          status: "OUVERTE",
          ...(specialty
            ? { specialty: specialty as IntervenantSpecialty }
            : {}),
        },
        select: bidListSelect,
        orderBy: { createdAt: "desc" },
      });

      return res.json({ bids });
    }

    if (
      user.role === "CLIENT" ||
      user.role === "SECRETAIRE" ||
      user.role === "ADMIN"
    ) {
      const projectFilter =
        user.role === "ADMIN"
          ? {}
          : {
              OR: [
                { ownerId: user.id },
                { secretaryId: user.id },
              ],
            };

      const bids = await prisma.bid.findMany({
        where: { project: projectFilter },
        select: bidListSelect,
        orderBy: { createdAt: "desc" },
      });

      return res.json({ bids });
    }

    throw new AppError(403, "Insufficient permissions", "FORBIDDEN");
  } catch (err) {
    next(err);
  }
}

export async function getBidById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const bid = await getBidWithProject(req.params["id"]!);

    const isOwnerOrSecretary =
      user.role === "ADMIN" ||
      bid.project.ownerId === user.id ||
      bid.project.secretaryId === user.id;

    if (user.role === "INTERVENANT") {
      if (bid.status !== "OUVERTE" && bid.status !== "EN_COURS") {
        const myOffer = await prisma.offer.findFirst({
          where: { bidId: bid.id, submittedById: user.id },
        });
        if (!myOffer) {
          throw new AppError(403, "Access denied", "FORBIDDEN");
        }
      }
    } else if (!isOwnerOrSecretary) {
      await getProjectForBidAction(bid.projectId, user.id, user.role);
    }

    const offerFilter =
      user.role === "INTERVENANT"
        ? { submittedById: user.id }
        : isOwnerOrSecretary || user.role === "ADMIN"
          ? {}
          : { submittedById: user.id };

    const fullBid = await prisma.bid.findUniqueOrThrow({
      where: { id: bid.id },
      select: {
        ...bidListSelect,
        offers: {
          where: offerFilter,
          select: {
            id: true,
            content: true,
            price: true,
            timeline: true,
            status: true,
            createdAt: true,
            submittedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                specialty: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json({ bid: fullBid });
  } catch (err) {
    next(err);
  }
}

export async function closeBid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const bid = await getBidWithProject(req.params["id"]!);

    if (user.role !== "ADMIN" && bid.project.ownerId !== user.id) {
      throw new AppError(
        403,
        "Only the project owner can close this bid",
        "FORBIDDEN"
      );
    }

    const updated = await prisma.bid.update({
      where: { id: bid.id },
      data: { status: "CLOTUREE" },
      select: bidListSelect,
    });

    res.json({ bid: updated });
  } catch (err) {
    next(err);
  }
}
