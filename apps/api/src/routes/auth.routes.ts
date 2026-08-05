import { Router } from "express";
import { register, login, refreshToken, logout, me } from "../controllers/auth.controller";
import { authRateLimiter } from "../middleware/rateLimiter";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login",    authRateLimiter, login);
router.post("/refresh",  authRateLimiter, refreshToken);
router.post("/logout",   authenticate, logout);
router.get("/me",        authenticate, me);

export default router;
