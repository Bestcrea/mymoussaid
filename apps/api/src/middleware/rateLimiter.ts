import rateLimit from "express-rate-limit";

// General rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later.", code: "RATE_LIMITED" },
});

// Strict limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts.", code: "RATE_LIMITED_AUTH" },
});
