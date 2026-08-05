import Redis from "ioredis";
import { logger } from "./logger";

const redisConfig = {
  host: process.env["REDIS_HOST"] ?? "localhost",
  port: Number(process.env["REDIS_PORT"] ?? 6379),
  password: process.env["REDIS_PASSWORD"],
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
};

export const redis = new Redis(redisConfig);
export const redisSub = new Redis(redisConfig); // separate connection for Socket.io adapter

redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (err) => logger.error("Redis error", { err }));

// ─── Key helpers ─────────────────────────────────────────────
export const keys = {
  session:      (userId: string)    => `session:${userId}`,
  project:      (projectId: string) => `project:${projectId}`,
  userProfile:  (userId: string)    => `profile:${userId}`,
  rateLimitAuth:(ip: string)        => `rl:auth:${ip}`,
  bidList:      (projectId: string) => `bids:${projectId}`,
};

// ─── TTLs (seconds) ──────────────────────────────────────────
export const TTL = {
  session:     60 * 15,        // 15 min (matches JWT)
  refreshSession: 60 * 60 * 24 * 7, // 7 days
  projectCache: 60 * 5,        // 5 min
  profileCache: 60 * 10,       // 10 min
};
