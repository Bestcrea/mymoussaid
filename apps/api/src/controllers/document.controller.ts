import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";
import type { DocumentCategory, UserRole } from "@ma/shared";
import { uploadDocumentSchema } from "@ma/shared";
import {
  deleteFile,
  ensureBucket,
  getPresignedUrl,
  uploadFile,
} from "../lib/minio";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const PRESIGNED_EXPIRY = 3600;

const documentSelect = {
  id: true,
  name: true,
  description: true,
  category: true,
  mimeType: true,
  size: true,
  version: true,
  objectKey: true,
  projectId: true,
  createdAt: true,
  uploadedBy: {
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
    include: { members: { select: { userId: true } } },
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

async function attachPresignedUrl<T extends { objectKey: string }>(
  doc: T
): Promise<Omit<T, "objectKey"> & { url: string }> {
  const { objectKey, ...rest } = doc;
  const url = await getPresignedUrl(objectKey, PRESIGNED_EXPIRY);
  return { ...rest, url };
}

export async function uploadDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;

    await assertProjectMember(projectId, user.id, user.role);

    const file = req.file;
    if (!file) {
      throw new AppError(400, "File is required", "FILE_REQUIRED");
    }

    const meta = uploadDocumentSchema.parse(req.body);
    await ensureBucket();

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectKey = `projects/${projectId}/${randomUUID()}-${safeName}`;

    await uploadFile(objectKey, file.buffer, file.mimetype);

    const document = await prisma.document.create({
      data: {
        name: file.originalname,
        description: meta.description,
        category: meta.category as DocumentCategory,
        mimeType: file.mimetype,
        size: file.size,
        objectKey,
        projectId,
        uploadedById: user.id,
      },
      select: documentSelect,
    });

    const withUrl = await attachPresignedUrl(document);
    res.status(201).json({ document: withUrl });
  } catch (err) {
    next(err);
  }
}

export async function getDocuments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const projectId = req.params["projectId"]!;

    await assertProjectMember(projectId, user.id, user.role);

    const documents = await prisma.document.findMany({
      where: { projectId },
      select: documentSelect,
      orderBy: { createdAt: "desc" },
    });

    const withUrls = await Promise.all(documents.map(attachPresignedUrl));
    res.json({ documents: withUrls });
  } catch (err) {
    next(err);
  }
}

export async function downloadDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const document = await prisma.document.findUnique({
      where: { id: req.params["id"] },
      include: {
        project: {
          include: { members: { select: { userId: true } } },
        },
      },
    });

    if (!document) {
      throw new AppError(404, "Document not found", "NOT_FOUND");
    }

    const { project } = document;
    if (user.role !== "ADMIN") {
      const isMember =
        project.ownerId === user.id ||
        project.secretaryId === user.id ||
        project.members.some((m) => m.userId === user.id);

      if (!isMember) {
        throw new AppError(403, "Access denied", "FORBIDDEN");
      }
    }

    const url = await getPresignedUrl(document.objectKey, PRESIGNED_EXPIRY);
    res.redirect(302, url);
  } catch (err) {
    next(err);
  }
}

export async function deleteDocument(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const document = await prisma.document.findUnique({
      where: { id: req.params["id"] },
      include: { project: { select: { ownerId: true } } },
    });

    if (!document) {
      throw new AppError(404, "Document not found", "NOT_FOUND");
    }

    if (
      user.role !== "ADMIN" &&
      document.project.ownerId !== user.id
    ) {
      throw new AppError(
        403,
        "Only the project owner or an admin can delete documents",
        "FORBIDDEN"
      );
    }

    await deleteFile(document.objectKey);
    await prisma.document.delete({ where: { id: document.id } });

    res.json({ message: "Document deleted" });
  } catch (err) {
    next(err);
  }
}
