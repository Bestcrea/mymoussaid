import type { Server } from "socket.io";
import { logger } from "./logger";
import { verifyToken } from "./jwt";

export function setupSocketHandlers(io: Server) {
  // ─── Auth middleware for Socket.io ───────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth["token"] as string | undefined;
    if (!token) return next(new Error("Authentication required"));
    try {
      const payload = verifyToken(token);
      socket.data["userId"] = payload.sub;
      socket.data["role"] = payload.role;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data["userId"] as string;
    logger.debug(`Socket connected: ${userId}`);

    // Join personal room for targeted notifications
    socket.join(`user:${userId}`);

    // Join project room
    socket.on("project:join", (projectId: string) => {
      socket.join(`project:${projectId}`);
      logger.debug(`${userId} joined project room: ${projectId}`);
    });

    // Leave project room
    socket.on("project:leave", (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    socket.on("disconnect", () => {
      logger.debug(`Socket disconnected: ${userId}`);
    });
  });
}

// ─── Emit helpers (called from controllers) ──────────────────
export function emitToUser(io: Server, userId: string, event: string, data: unknown) {
  io.to(`user:${userId}`).emit(event, data);
}

export function emitToProject(io: Server, projectId: string, event: string, data: unknown) {
  io.to(`project:${projectId}`).emit(event, data);
}
