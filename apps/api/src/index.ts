import "./env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { redis, redisSub } from "./lib/redis";
import { logger } from "./lib/logger";
import { errorHandler } from "./middleware/errorHandler";
import { rateLimiter } from "./middleware/rateLimiter";
import { setupRoutes } from "./routes";
import { setupSocketHandlers } from "./lib/socket";
import { setIo } from "./lib/io";
import { ensureBucket } from "./lib/minio";

const app = express();
const httpServer = createServer(app);

// ─── Socket.io with Redis adapter ───────────────────────────
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env["CORS_ORIGINS"]?.split(",") ?? ["http://localhost:5173"],
    credentials: true,
  },
});
io.adapter(createAdapter(redis, redisSub));
setIo(io);
setupSocketHandlers(io);

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env["CORS_ORIGINS"]?.split(",") ?? ["http://localhost:5173"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// ─── Routes ─────────────────────────────────────────────────
setupRoutes(app);

// ─── Health check ────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Error handler (must be last) ────────────────────────────
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────────
const PORT = process.env["API_PORT"] ?? 3001;
httpServer.listen(PORT, async () => {
  try {
    await ensureBucket();
  } catch (err) {
    logger.error("Minio bucket init failed", { err });
  }
  logger.info(`API running on port ${PORT} [${process.env["NODE_ENV"]}]`);
});

export default app;
