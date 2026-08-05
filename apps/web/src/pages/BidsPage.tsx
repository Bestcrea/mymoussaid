import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import type {
  BidStatus,
  CreateBidInput,
  IntervenantSpecialty,
  SubmitOfferInput,
} from "@ma/shared";
import { SPECIALTY_LABELS } from "@ma/shared";
import {
  BID_STATUS_BADGE,
  BID_STATUS_LABELS,
  useBids,
  useCreateBid,
  useSubmitOffer,
  type BidListItem,
} from "../hooks/useBids";
import { useProjects } from "../hooks/useProjects";
import { useAuthStore } from "../store/authStore";

function BidStatusBadge({ status }: { status: BidStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${BID_STATUS_BADGE[status]}`}
    >
      {BID_STATUS_LABELS[status]}
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

type CreateBidForm = CreateBidInput & { projectId: string };
type SubmitOfferForm = SubmitOfferInput;

function ClientBidsView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: bids = [], isLoading, isError } = useBids();
  const { data: projects = [] } = useProjects();
  const createBid = useCreateBid();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBidForm>();

  function openModal() {
    setServerError(null);
    reset({ projectId: projects[0]?.id ?? "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setServerError(null);
    reset();
  }

  async function onSubmit(values: CreateBidForm) {
    setServerError(null);
    const payload: CreateBidInput & { projectId: string } = {
      projectId: values.projectId,
      title: values.title,
      description: values.description,
      task: values.task,
      budget: values.budget,
      ...(values.specialty ? { specialty: values.specialty } : {}),
      ...(values.deadline
        ? { deadline: new Date(values.deadline).toISOString() }
        : {}),
    };
    try {
      await createBid.mutateAsync(payload);
      closeModal();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Impossible de créer l'appel d'offres."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Appels d'offres</h1>
        <button
          type="button"
          onClick={openModal}
          disabled={projects.length === 0}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus:ring-2 focus:ring-brand-300 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          Nouvel appel d'offres
        </button>
      </div>

      {projects.length === 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Créez d'abord un projet pour publier un appel d'offres.
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-neutral-500">Chargement…</p>
      )}

      {isError && (
        <p className="text-sm text-red-600">Impossible de charger les appels d'offres.</p>
      )}

      {!isLoading && !isError && bids.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">Aucun appel d'offres pour le moment.</p>
        </div>
      )}

      {!isLoading && bids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bids.map((bid) => (
            <BidCardClient key={bid.id} bid={bid} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40" onClick={closeModal} aria-hidden />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">
              Nouvel appel d'offres
            </h2>

            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="projectId" className={labelClass}>
                  Projet
                </label>
                <select id="projectId" className={inputClass} {...register("projectId", { required: true })}>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="title" className={labelClass}>Titre</label>
                <input id="title" className={inputClass} {...register("title", { required: "Requis", minLength: 3 })} />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="task" className={labelClass}>Tâche</label>
                <input id="task" className={inputClass} placeholder="Plomberie RDC" {...register("task", { required: "Requis", minLength: 3 })} />
                {errors.task && <p className="mt-1 text-xs text-red-600">{errors.task.message}</p>}
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" rows={3} className={inputClass} {...register("description", { required: "Requis", minLength: 10 })} />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label htmlFor="specialty" className={labelClass}>Spécialité</label>
                <select id="specialty" className={inputClass} {...register("specialty")}>
                  <option value="">Toutes spécialités</option>
                  {(Object.keys(SPECIALTY_LABELS) as IntervenantSpecialty[]).map((key) => (
                    <option key={key} value={key}>{SPECIALTY_LABELS[key]}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className={labelClass}>Budget (MAD)</label>
                  <input id="budget" type="number" min="0" step="1000" className={inputClass} {...register("budget", { valueAsNumber: true })} />
                </div>
                <div>
                  <label htmlFor="deadline" className={labelClass}>Deadline</label>
                  <input id="deadline" type="datetime-local" className={inputClass} {...register("deadline")} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting || createBid.isPending} className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
                  {createBid.isPending ? "Création…" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function BidCardClient({ bid }: { bid: BidListItem }) {
  return (
    <Link
      to={`/bids/${bid.id}`}
      className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-brand-700">
          {bid.title}
        </h2>
        <BidStatusBadge status={bid.status} />
      </div>
      <p className="text-sm text-neutral-600 mb-1">{bid.task}</p>
      <p className="text-xs text-neutral-400 mb-3">{bid.project.title}</p>
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>{bid._count.offers} offre{bid._count.offers !== 1 ? "s" : ""}</span>
        <span>Deadline : {formatDate(bid.deadline)}</span>
      </div>
    </Link>
  );
}

function IntervenantBidsView() {
  const [specialtyFilter, setSpecialtyFilter] = useState<IntervenantSpecialty | "">("");
  const [offerModalBidId, setOfferModalBidId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: bids = [], isLoading, isError } = useBids(
    specialtyFilter || undefined
  );
  const submitOffer = useSubmitOffer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmitOfferForm>();

  function openOfferModal(bidId: string) {
    setServerError(null);
    reset();
    setOfferModalBidId(bidId);
  }

  function closeOfferModal() {
    setOfferModalBidId(null);
    setServerError(null);
    reset();
  }

  async function onSubmitOffer(values: SubmitOfferForm) {
    if (!offerModalBidId) return;
    setServerError(null);
    try {
      await submitOffer.mutateAsync({ bidId: offerModalBidId, ...values });
      closeOfferModal();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Impossible de soumettre l'offre."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Appels d'offres</h1>
        <select
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value as IntervenantSpecialty | "")}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Toutes les spécialités</option>
          {(Object.keys(SPECIALTY_LABELS) as IntervenantSpecialty[]).map((key) => (
            <option key={key} value={key}>{SPECIALTY_LABELS[key]}</option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}
      {isError && <p className="text-sm text-red-600">Impossible de charger les appels d'offres.</p>}

      {!isLoading && !isError && bids.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">Aucun appel d'offres ouvert pour le moment.</p>
        </div>
      )}

      {!isLoading && bids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <Link to={`/bids/${bid.id}`} className="text-lg font-semibold text-neutral-900 hover:text-brand-700">
                  {bid.title}
                </Link>
                <BidStatusBadge status={bid.status} />
              </div>
              <p className="text-sm text-neutral-600 mb-1">{bid.task}</p>
              <p className="text-xs text-neutral-400 mb-3">{bid.project.title}</p>
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
                <span>Budget : {formatBudget(bid.budget)}</span>
                <span>Deadline : {formatDate(bid.deadline)}</span>
              </div>
              <button
                type="button"
                onClick={() => openOfferModal(bid.id)}
                className="w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
              >
                Soumettre une offre
              </button>
            </div>
          ))}
        </div>
      )}

      {offerModalBidId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/40" onClick={closeOfferModal} aria-hidden />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-neutral-900 mb-6">Soumettre une offre</h2>

            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitOffer)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="content" className={labelClass}>Description de l'offre</label>
                <textarea id="content" rows={4} className={inputClass} {...register("content", { required: "Requis", minLength: 10 })} />
                {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className={labelClass}>Prix proposé (MAD)</label>
                  <input id="price" type="number" min="0" className={inputClass} {...register("price", { valueAsNumber: true })} />
                </div>
                <div>
                  <label htmlFor="timeline" className={labelClass}>Délai d'exécution</label>
                  <input id="timeline" className={inputClass} placeholder="3 semaines" {...register("timeline")} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeOfferModal} className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting || submitOffer.isPending} className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60">
                  {submitOffer.isPending ? "Envoi…" : "Envoyer l'offre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function BidsPage() {
  const user = useAuthStore((s) => s.user);
  const isIntervenant = user?.role === "INTERVENANT";

  if (isIntervenant) {
    return <IntervenantBidsView />;
  }

  return <ClientBidsView />;
}
