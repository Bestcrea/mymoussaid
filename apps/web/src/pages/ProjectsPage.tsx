import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import type { CreateProjectInput, ProjectStage } from "@ma/shared";
import { PROJECT_STAGES } from "@ma/shared";
import {
  STAGE_BADGE_CLASSES,
  useCreateProject,
  useProjects,
} from "../hooks/useProjects";

function StageBadge({ stage }: { stage: ProjectStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_BADGE_CLASSES[stage]}`}
    >
      {PROJECT_STAGES[stage].label}
    </span>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: projects = [], isLoading, isError } = useProjects();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>();

  function openModal() {
    setServerError(null);
    reset();
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setServerError(null);
    reset();
  }

  async function onSubmit(values: CreateProjectInput) {
    setServerError(null);
    try {
      await createProject.mutateAsync(values);
      closeModal();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Impossible de créer le projet."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Mes Projets</h1>
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus:ring-2 focus:ring-brand-300 focus:outline-none transition-colors"
        >
          Nouveau projet
        </button>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">Chargement des projets…</p>
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
          <p className="text-sm text-red-700">
            Impossible de charger les projets.
          </p>
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">Aucun projet pour le moment.</p>
          <button
            type="button"
            onClick={openModal}
            className="mt-4 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
          >
            Créer votre premier projet
          </button>
        </div>
      )}

      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-brand-700">
                  {project.title}
                </h2>
                <StageBadge stage={project.stage} />
              </div>
              <p className="text-xs font-mono text-neutral-400 mb-2">
                {project.dossierNumber}
              </p>
              {project.description && (
                <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}
              <p className="text-xs text-neutral-400">
                Créé le {formatDate(project.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-900/40"
            onClick={closeModal}
            aria-hidden
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Nouveau projet
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none"
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {serverError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div>
                <label htmlFor="title" className={labelClass}>
                  Titre
                </label>
                <input
                  id="title"
                  className={inputClass}
                  placeholder="Villa à Casablanca"
                  {...register("title", {
                    required: "Le titre est requis",
                    minLength: { value: 3, message: "Minimum 3 caractères" },
                  })}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className={inputClass}
                  placeholder="Description du projet…"
                  {...register("description")}
                />
              </div>

              <div>
                <label htmlFor="city" className={labelClass}>
                  Ville
                </label>
                <input
                  id="city"
                  className={inputClass}
                  placeholder="Casablanca"
                  {...register("city")}
                />
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Adresse
                </label>
                <input
                  id="address"
                  className={inputClass}
                  placeholder="123, Boulevard Mohammed V"
                  {...register("address")}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || createProject.isPending}
                  className="flex-1 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting || createProject.isPending
                    ? "Création…"
                    : "Créer le projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
