import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@ma/shared";
import { createProjectSchema, updateProjectStageSchema } from "@ma/shared";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const ownerSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
} as const;

const projectListSelect = {
  id: true,
  dossierNumber: true,
  title: true,
  description: true,
  stage: true,
  city: true,
  address: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true,
  owner: { select: ownerSelect },
} as const;

async function assertProjectAccess(
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

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createProjectSchema.parse(req.body);
    const user = req.user!;

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        city: data.city,
        address: data.address,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        ownerId: user.id,
        secretaryId: user.role === "SECRETAIRE" ? user.id : undefined,
      },
      select: projectListSelect,
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

export async function getMyProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;

    const where =
      user.role === "ADMIN"
        ? {}
        : {
            OR: [
              { ownerId: user.id },
              { secretaryId: user.id },
              { members: { some: { userId: user.id } } },
            ],
          };

    const projects = await prisma.project.findMany({
      where,
      select: projectListSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    await assertProjectAccess(req.params["id"]!, user.id, user.role);

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: req.params["id"] },
      select: {
        ...projectListSelect,
        secretary: { select: ownerSelect },
        members: {
          select: {
            id: true,
            role: true,
            joinedAt: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                specialty: true,
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
      },
    });

    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function updateProjectStage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const { stage } = updateProjectStageSchema.parse(req.body);
    const existing = await assertProjectAccess(
      req.params["id"]!,
      user.id,
      user.role
    );

    if (
      user.role !== "ADMIN" &&
      existing.ownerId !== user.id &&
      existing.secretaryId !== user.id
    ) {
      throw new AppError(
        403,
        "Only the owner or secretary can update the stage",
        "FORBIDDEN"
      );
    }

    const project = await prisma.project.update({
      where: { id: req.params["id"] },
      data: { stage },
      select: projectListSelect,
    });

    res.json({ project });
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const existing = await assertProjectAccess(
      req.params["id"]!,
      user.id,
      user.role
    );

    if (user.role !== "ADMIN" && existing.ownerId !== user.id) {
      throw new AppError(
        403,
        "Only the owner or an admin can delete this project",
        "FORBIDDEN"
      );
    }

    await prisma.project.delete({ where: { id: req.params["id"] } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}
