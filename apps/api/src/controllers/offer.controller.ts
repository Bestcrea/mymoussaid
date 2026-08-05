import type { Request, Response, NextFunction } from "express";
import { submitOfferSchema } from "@ma/shared";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const offerSelect = {
  id: true,
  content: true,
  price: true,
  timeline: true,
  status: true,
  createdAt: true,
  bidId: true,
  submittedBy: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      specialty: true,
    },
  },
} as const;

async function getBidWithProject(bidId: string) {
  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: {
      project: {
        select: { id: true, ownerId: true, secretaryId: true },
      },
    },
  });

  if (!bid) {
    throw new AppError(404, "Bid not found", "NOT_FOUND");
  }

  return bid;
}

export async function submitOffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;

    if (user.role !== "INTERVENANT" && user.role !== "ADMIN") {
      throw new AppError(
        403,
        "Only intervenants can submit offers",
        "FORBIDDEN"
      );
    }

    const bidId = req.params["bidId"]!;
    const bid = await getBidWithProject(bidId);

    if (bid.status !== "OUVERTE") {
      throw new AppError(400, "This bid is no longer open", "BID_CLOSED");
    }

    const existing = await prisma.offer.findFirst({
      where: { bidId, submittedById: user.id },
    });

    if (existing) {
      throw new AppError(409, "You already submitted an offer", "OFFER_EXISTS");
    }

    const data = submitOfferSchema.parse(req.body);

    const offer = await prisma.offer.create({
      data: {
        content: data.content,
        price: data.price,
        timeline: data.timeline,
        bidId,
        submittedById: user.id,
      },
      select: offerSelect,
    });

    res.status(201).json({ offer });
  } catch (err) {
    next(err);
  }
}

export async function getOffersByBid(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const bidId = req.params["bidId"]!;
    const bid = await getBidWithProject(bidId);

    if (
      user.role !== "ADMIN" &&
      bid.project.ownerId !== user.id &&
      bid.project.secretaryId !== user.id
    ) {
      throw new AppError(
        403,
        "Only the project owner or secretary can view offers",
        "FORBIDDEN"
      );
    }

    const offers = await prisma.offer.findMany({
      where: { bidId },
      select: offerSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json({ offers });
  } catch (err) {
    next(err);
  }
}

export async function acceptOffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const offerId = req.params["id"]!;

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        bid: {
          include: {
            project: { select: { ownerId: true, secretaryId: true } },
          },
        },
      },
    });

    if (!offer) {
      throw new AppError(404, "Offer not found", "NOT_FOUND");
    }

    const { project } = offer.bid;

    if (
      user.role !== "ADMIN" &&
      project.ownerId !== user.id &&
      project.secretaryId !== user.id
    ) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    const [acceptedOffer] = await prisma.$transaction([
      prisma.offer.update({
        where: { id: offerId },
        data: { status: "ACCEPTEE" },
        select: offerSelect,
      }),
      prisma.offer.updateMany({
        where: {
          bidId: offer.bidId,
          id: { not: offerId },
          status: { not: "REFUSEE" },
        },
        data: { status: "REFUSEE" },
      }),
      prisma.bid.update({
        where: { id: offer.bidId },
        data: { status: "EN_COURS" },
      }),
    ]);

    res.json({ offer: acceptedOffer });
  } catch (err) {
    next(err);
  }
}

export async function rejectOffer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!;
    const offerId = req.params["id"]!;

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        bid: {
          include: {
            project: { select: { ownerId: true, secretaryId: true } },
          },
        },
      },
    });

    if (!offer) {
      throw new AppError(404, "Offer not found", "NOT_FOUND");
    }

    const { project } = offer.bid;

    if (
      user.role !== "ADMIN" &&
      project.ownerId !== user.id &&
      project.secretaryId !== user.id
    ) {
      throw new AppError(403, "Access denied", "FORBIDDEN");
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: { status: "REFUSEE" },
      select: offerSelect,
    });

    res.json({ offer: updated });
  } catch (err) {
    next(err);
  }
}
