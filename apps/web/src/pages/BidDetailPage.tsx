import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import type { BidStatus, OfferStatus, SubmitOfferInput } from "@ma/shared";
import { SPECIALTY_LABELS } from "@ma/shared";
import {
  BID_STATUS_BADGE,
  BID_STATUS_LABELS,
  OFFER_STATUS_BADGE,
  OFFER_STATUS_LABELS,
  useAcceptOffer,
  useBid,
  useCloseBid,
  useRejectOffer,
  useSubmitOffer,
} from "../hooks/useBids";
import { useAuthStore } from "../store/authStore";

function BidStatusBadge({ status }: { status: BidStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${BID_STATUS_BADGE[status]}`}>
      {BID_STATUS_LABELS[status]}
    </span>
  );
}

function OfferStatusBadge({ status }: { status: OfferStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${OFFER_STATUS_BADGE[status]}`}>
      {OFFER_STATUS_LABELS[status]}
    </span>
  );
}

function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatBudget(budget: number | null | undefined) {
  if (budget == null) return "—";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(budget);
}

function ClientBidDetail({ bidId }: { bidId: string }) {
  const { data: bid, isLoading, isError } = useBid(bidId);
  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const closeBid = useCloseBid();
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleAccept(offerId: string) {
    setActionError(null);
    try {
      await acceptOffer.mutateAsync(offerId);
    } catch (err) {
      setActionError(axios.isAxiosError(err) ? err.response?.data?.error ?? "Erreur" : "Erreur");
    }
  }

  async function handleReject(offerId: string) {
    setActionError(null);
    try {
      await rejectOffer.mutateAsync(offerId);
    } catch (err) {
      setActionError(axios.isAxiosError(err) ? err.response?.data?.error ?? "Erreur" : "Erreur");
    }
  }

  async function handleClose() {
    setActionError(null);
    try {
      await closeBid.mutateAsync(bidId);
    } catch (err) {
      setActionError(axios.isAxiosError(err) ? err.response?.data?.error ?? "Erreur" : "Erreur");
    }
  }

  if (isLoading) return <p className="text-sm text-neutral-500">Chargement…</p>;
  if (isError || !bid) return <p className="text-sm text-red-600">Appel d'offres introuvable.</p>;

  return (
    <div className="space-y-8">
      <Link to="/bids" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Retour aux appels d'offres
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{bid.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{bid.project.title} · {bid.task}</p>
        </div>
        <BidStatusBadge status={bid.status} />
      </div>

      {actionError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Informations</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Description</dt>
            <dd className="mt-0.5 text-neutral-900">{bid.description}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Spécialité</dt>
            <dd className="mt-0.5 text-neutral-900">
              {bid.specialty ? SPECIALTY_LABELS[bid.specialty] : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Budget estimé</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">{formatBudget(bid.budget)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Deadline</dt>
            <dd className="mt-0.5 text-neutral-900">{formatDate(bid.deadline)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Offres reçues ({bid.offers.length})
        </h2>

        {bid.offers.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucune offre reçue pour le moment.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {bid.offers.map((offer) => (
              <li key={offer.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {offer.submittedBy.firstName} {offer.submittedBy.lastName}
                    </p>
                    <p className="text-xs text-neutral-500">{offer.submittedBy.email}</p>
                    <p className="mt-2 text-sm text-neutral-700">{offer.content}</p>
                    <div className="mt-2 flex gap-4 text-xs text-neutral-500">
                      <span>Prix : {formatBudget(offer.price)}</span>
                      <span>Délai : {offer.timeline ?? "—"}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <OfferStatusBadge status={offer.status} />
                    {offer.status === "SOUMISE" || offer.status === "EN_EVALUATION" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAccept(offer.id)}
                          disabled={acceptOffer.isPending}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(offer.id)}
                          disabled={rejectOffer.isPending}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Refuser
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {bid.status !== "CLOTUREE" && bid.status !== "ANNULEE" && (
        <button
          type="button"
          onClick={handleClose}
          disabled={closeBid.isPending}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-60"
        >
          {closeBid.isPending ? "Clôture…" : "Clôturer l'AO"}
        </button>
      )}
    </div>
  );
}

function IntervenantBidDetail({ bidId }: { bidId: string }) {
  const { data: bid, isLoading, isError } = useBid(bidId);
  const submitOffer = useSubmitOffer();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubmitOfferInput>();

  const myOffer = bid?.offers[0] ?? null;
  const canSubmit = bid?.status === "OUVERTE" && !myOffer;

  async function onSubmit(values: SubmitOfferInput) {
    setServerError(null);
    try {
      await submitOffer.mutateAsync({ bidId, ...values });
    } catch (err) {
      setServerError(
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Impossible de soumettre l'offre."
          : "Erreur inattendue"
      );
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  if (isLoading) return <p className="text-sm text-neutral-500">Chargement…</p>;
  if (isError || !bid) return <p className="text-sm text-red-600">Appel d'offres introuvable.</p>;

  return (
    <div className="space-y-8">
      <Link to="/bids" className="text-sm font-medium text-brand-600 hover:text-brand-700">
        ← Retour aux appels d'offres
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{bid.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{bid.project.title} · {bid.task}</p>
        </div>
        <BidStatusBadge status={bid.status} />
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Informations</h2>
        <p className="text-sm text-neutral-700 mb-4">{bid.description}</p>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Budget estimé</dt>
            <dd className="mt-0.5 font-medium">{formatBudget(bid.budget)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Deadline</dt>
            <dd className="mt-0.5">{formatDate(bid.deadline)}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Spécialité</dt>
            <dd className="mt-0.5">
              {bid.specialty ? SPECIALTY_LABELS[bid.specialty] : "—"}
            </dd>
          </div>
        </dl>
      </section>

      {myOffer ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-700">Votre offre</h2>
            <OfferStatusBadge status={myOffer.status} />
          </div>
          <p className="text-sm text-neutral-700">{myOffer.content}</p>
          <div className="mt-3 flex gap-4 text-sm text-neutral-500">
            <span>Prix : {formatBudget(myOffer.price)}</span>
            <span>Délai : {myOffer.timeline ?? "—"}</span>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            Soumise le {formatDate(myOffer.createdAt)}
          </p>
        </section>
      ) : canSubmit ? (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-700 mb-4">
            Soumettre une offre
          </h2>

          {serverError && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="content" className={labelClass}>Description</label>
              <textarea id="content" rows={4} className={inputClass} {...register("content", { required: true, minLength: 10 })} />
              {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={labelClass}>Prix (MAD)</label>
                <input id="price" type="number" min="0" className={inputClass} {...register("price", { valueAsNumber: true })} />
              </div>
              <div>
                <label htmlFor="timeline" className={labelClass}>Délai</label>
                <input id="timeline" className={inputClass} placeholder="3 semaines" {...register("timeline")} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || submitOffer.isPending}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitOffer.isPending ? "Envoi…" : "Envoyer mon offre"}
            </button>
          </form>
        </section>
      ) : (
        <p className="text-sm text-neutral-500">Cet appel d'offres n'accepte plus de soumissions.</p>
      )}
    </div>
  );
}

export function BidDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  if (!id) {
    return <p className="text-sm text-red-600">Identifiant manquant.</p>;
  }

  if (user?.role === "INTERVENANT") {
    return <IntervenantBidDetail bidId={id} />;
  }

  return <ClientBidDetail bidId={id} />;
}
