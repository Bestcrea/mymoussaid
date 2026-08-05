import { Router } from "express";
import {
  deleteDocument,
  downloadDocument,
  getDocuments,
  uploadDocument,
} from "../controllers/document.controller";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post(
  "/projects/:projectId/documents",
  authenticate,
  upload.single("file"),
  uploadDocument
);
router.get(
  "/projects/:projectId/documents",
  authenticate,
  getDocuments
);
router.get("/documents/:id/download", authenticate, downloadDocument);
router.delete("/documents/:id", authenticate, deleteDocument);

export default router;
