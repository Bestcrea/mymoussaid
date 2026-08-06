import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import {
  approveUser,
  getAllUsers,
  getPendingUsers,
  rejectUser,
} from "../controllers/admin.controller";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/users/pending", getPendingUsers);
router.get("/users", getAllUsers);
router.patch("/users/:id/approve", approveUser);
router.patch("/users/:id/reject", rejectUser);

export default router;
