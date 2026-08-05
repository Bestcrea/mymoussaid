import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "@ma/shared";
import { sendMessageSchema } from "@ma/shared";
import { getIo } from "../lib/io";
import { prisma } from "../lib/prisma";
import { emitToProject, emitToUser } from "../lib/socket";
import { AppError } from "../middleware/errorHandler";

const messageSelect = {
  id: true,
  content: true,
  projectId: true,
  createdAt: true,
  sender: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
} as const;

async function assertProjectMember(
  projectId: string,
  userId: string,
  userRole: UserRole
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      members: { select: { userId: true } },
    },
  });

  if (!project) {
    throw new AppError(404, "Project not found", "NOT_FOUND");
  }

  if (userRole === "ADMIN") return project;

  const isMember =
    project.ownerId === userId ||
    project.secretaryId === userId ||
    project.members.some((member) => member.userId === userId);

  if (!isMember) {
    throw new AppError(403, "Access denied", "FORBIDDEN");
  }

  return project;
}

async function getProjectMemberIds(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: { select: { userId: true } } },
  });

  if (!project) return [];

  const ids = new Set<string>([project.ownerId]);
  if (project.secretaryId) ids.add(project.secretaryId);
  for (const member of project.members) {
    ids.add(member.userId);
  }

  return [...ids];
}

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;

    await assertProjectMember(projectId, user.id, user.role);

    const page = Math.max(Number(req.query["page"]) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query["limit"]) || 50, 1), 50);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: { projectId },
        select: messageSelect,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.message.count({ where: { projectId } }),
    ]);

    res.json({
      messages: messages.reverse(),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;
    const { content } = sendMessageSchema.parse(req.body);

    await assertProjectMember(projectId, user.id, user.role);

    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        senderId: user.id,
        readBy: [user.id],
      },
      select: messageSelect,
    });

    const io = getIo();
    emitToProject(io, projectId, "message:new", message);

    const memberIds = await getProjectMemberIds(projectId);
    for (const memberId of memberIds) {
      if (memberId !== user.id) {
        emitToUser(io, memberId, "message:notify", {
          projectId,
          message,
        });
      }
    }

    res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
}
