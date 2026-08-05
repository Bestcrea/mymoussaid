import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/projects/:projectId/messages", authenticate, getMessages);
router.post("/projects/:projectId/messages", authenticate, sendMessage);

export default router;
