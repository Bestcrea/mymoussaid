import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Bid,
  BidStatus,
  CreateBidInput,
  IntervenantSpecialty,
  OfferStatus,
  SubmitOfferInput,
} from "@/shared";
import { api } from "../lib/api";

export interface BidListItem extends Omit<Bid, "offersCount"> {
  projectId: string;
  createdAt: string;
  updatedAt: string;
  _count: { offers: number };
  project: {
    id: string;
    title: string;
    dossierNumber: string;
    ownerId: string;
  };
}

export interface OfferDetail {
  id: string;
  content: string;
  price: number | null;
  timeline: string | null;
  status: OfferStatus;
  createdAt: string;
  bidId?: string;
  submittedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialty: IntervenantSpecialty | null;
  };
}

export interface BidDetail extends BidListItem {
  offers: OfferDetail[];
}

export const BID_STATUS_BADGE: Record<BidStatus, string> = {
  OUVERTE: "bg-green-100 text-green-800",
  EN_COURS: "bg-blue-100 text-blue-800",
  CLOTUREE: "bg-neutral-200 text-neutral-700",
  ANNULEE: "bg-red-100 text-red-800",
};

export const OFFER_STATUS_BADGE: Record<OfferStatus, string> = {
  SOUMISE: "bg-blue-100 text-blue-800",
  EN_EVALUATION: "bg-orange-100 text-orange-800",
  ACCEPTEE: "bg-green-100 text-green-800",
  REFUSEE: "bg-red-100 text-red-800",
};

export const BID_STATUS_LABELS: Record<BidStatus, string> = {
  OUVERTE: "Ouverte",
  EN_COURS: "En cours",
  CLOTUREE: "Clôturée",
  ANNULEE: "Annulée",
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  SOUMISE: "Soumise",
  EN_EVALUATION: "En évaluation",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
};

export function useBids(specialty?: IntervenantSpecialty) {
  return useQuery({
    queryKey: ["bids", specialty ?? "all"],
    queryFn: async () => {
      const params = specialty ? { specialty } : {};
      const { data } = await api.get<{ bids: BidListItem[] }>("/bids", {
        params,
      });
      return data.bids;
    },
  });
}

export function useProjectBids(projectId: string | undefined) {
  return useQuery({
    queryKey: ["bids", "project", projectId],
    queryFn: async () => {
      const { data } = await api.get<{ bids: BidListItem[] }>(
        `/projects/${projectId}/bids`
      );
      return data.bids;
    },
    enabled: Boolean(projectId),
  });
}

export function useBid(id: string | undefined) {
  return useQuery({
    queryKey: ["bids", id],
    queryFn: async () => {
      const { data } = await api.get<{ bid: BidDetail }>(`/bids/${id}`);
      return data.bid;
    },
    enabled: Boolean(id),
  });
}

export function useCreateBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      ...input
    }: CreateBidInput & { projectId: string }) => {
      const { data } = await api.post<{ bid: BidListItem }>(
        `/projects/${projectId}/bids`,
        input
      );
      return data.bid;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

export function useSubmitOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bidId,
      ...input
    }: SubmitOfferInput & { bidId: string }) => {
      const { data } = await api.post<{ offer: OfferDetail }>(
        `/bids/${bidId}/offers`,
        input
      );
      return data.offer;
    },
    onSuccess: (_offer, { bidId }) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["bids", bidId] });
    },
  });
}

export function useAcceptOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      const { data } = await api.patch<{ offer: OfferDetail }>(
        `/offers/${offerId}/accept`
      );
      return data.offer;
    },
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      if (offer.bidId) {
        queryClient.invalidateQueries({ queryKey: ["bids", offer.bidId] });
      }
    },
  });
}

export function useRejectOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: string) => {
      const { data } = await api.patch<{ offer: OfferDetail }>(
        `/offers/${offerId}/reject`
      );
      return data.offer;
    },
    onSuccess: (offer) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      if (offer.bidId) {
        queryClient.invalidateQueries({ queryKey: ["bids", offer.bidId] });
      }
    },
  });
}

export function useCloseBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      const { data } = await api.patch<{ bid: BidListItem }>(
        `/bids/${bidId}/close`
      );
      return data.bid;
    },
    onSuccess: (bid) => {
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      queryClient.invalidateQueries({ queryKey: ["bids", bid.id] });
    },
  });
}
