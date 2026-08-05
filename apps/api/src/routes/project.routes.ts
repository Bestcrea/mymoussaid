import { Router } from "express";
import {
  createProject,
  deleteProject,
  getMyProjects,
  getProjectById,
  updateProjectStage,
} from "../controllers/project.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, authorize("CLIENT", "SECRETAIRE"), createProject);
router.get("/", authenticate, getMyProjects);
router.get("/:id", authenticate, getProjectById);
router.patch("/:id/stage", authenticate, updateProjectStage);
router.delete("/:id", authenticate, deleteProject);

export default router;
