import { Router } from "express";
import {
  closeBid,
  createBid,
  getAllPublicBids,
  getBidById,
  getBidsByProject,
} from "../controllers/bid.controller";
import {
  acceptOffer,
  getOffersByBid,
  rejectOffer,
  submitOffer,
} from "../controllers/offer.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post(
  "/projects/:projectId/bids",
  authenticate,
  authorize("CLIENT", "SECRETAIRE", "ADMIN"),
  createBid
);
router.get(
  "/projects/:projectId/bids",
  authenticate,
  getBidsByProject
);

router.get("/bids", authenticate, getAllPublicBids);
router.get("/bids/:id", authenticate, getBidById);
router.patch("/bids/:id/close", authenticate, closeBid);

router.post(
  "/bids/:bidId/offers",
  authenticate,
  authorize("INTERVENANT", "ADMIN"),
  submitOffer
);
router.get("/bids/:bidId/offers", authenticate, getOffersByBid);

router.patch("/offers/:id/accept", authenticate, acceptOffer);
router.patch("/offers/:id/reject", authenticate, rejectOffer);

export default router;
