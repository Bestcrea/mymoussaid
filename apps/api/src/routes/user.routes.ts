import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// GET /api/v1/users  — admin only
router.get("/", authenticate, authorize("ADMIN"), async (_req, res) => {
  res.json({ message: "User list — Sprint 2" });
});

// GET /api/v1/users/:id
router.get("/:id", authenticate, async (req, res) => {
  res.json({ message: `User ${req.params["id"]} — Sprint 2` });
});

export default router;
