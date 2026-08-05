import { Link, useParams } from "react-router-dom";
import type { ProjectStage } from "@ma/shared";
import { PROJECT_STAGES } from "@ma/shared";
import {
  PROJECT_STAGE_ORDER,
  STAGE_BADGE_CLASSES,
  useProject,
  useUpdateProjectStage,
} from "../hooks/useProjects";

function StageBadge({ stage }: { stage: ProjectStage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STAGE_BADGE_CLASSES[stage]}`}
    >
      {PROJECT_STAGES[stage].label}
    </span>
  );
}

function formatDate(date: string | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError } = useProject(id);
  const updateStage = useUpdateProjectStage();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Chargement du projet…</p>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
        <p className="text-sm text-red-700">Projet introuvable.</p>
        <Link
          to="/projects"
          className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← Retour aux projets
        </Link>
      </div>
    );
  }

  const currentIndex = PROJECT_STAGE_ORDER.indexOf(project.stage);
  const prevStage =
    currentIndex > 0 ? PROJECT_STAGE_ORDER[currentIndex - 1] : null;
  const nextStage =
    currentIndex < PROJECT_STAGE_ORDER.length - 1
      ? PROJECT_STAGE_ORDER[currentIndex + 1]
      : null;

  function changeStage(stage: ProjectStage) {
    updateStage.mutate({ id: project!.id, stage });
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/projects"
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← Retour aux projets
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{project.title}</h1>
          <p className="mt-1 text-sm font-mono text-neutral-400">
            {project.dossierNumber}
          </p>
        </div>
        <StageBadge stage={project.stage} />
      </div>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Avancement du projet
        </h2>
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-neutral-200" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-brand-500 transition-all duration-300"
            style={{
              width: `${(currentIndex / (PROJECT_STAGE_ORDER.length - 1)) * 100}%`,
            }}
          />
          <div className="relative flex justify-between">
            {PROJECT_STAGE_ORDER.map((stage, index) => {
              const isActive = index <= currentIndex;
              const isCurrent = stage === project.stage;
              return (
                <div key={stage} className="flex flex-col items-center w-16 sm:w-auto">
                  <div
                    className={[
                      "z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                      isCurrent
                        ? "bg-brand-500 border-brand-500 text-white"
                        : isActive
                          ? "bg-brand-100 border-brand-500 text-brand-700"
                          : "bg-white border-neutral-300 text-neutral-400",
                    ].join(" ")}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={[
                      "mt-2 text-center text-[10px] sm:text-xs leading-tight max-w-[4rem] sm:max-w-none",
                      isCurrent
                        ? "font-semibold text-brand-700"
                        : isActive
                          ? "text-neutral-600"
                          : "text-neutral-400",
                    ].join(" ")}
                  >
                    {PROJECT_STAGES[stage].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={!prevStage || updateStage.isPending}
            onClick={() => prevStage && changeStage(prevStage)}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Étape précédente
          </button>
          <button
            type="button"
            disabled={!nextStage || updateStage.isPending}
            onClick={() => nextStage && changeStage(nextStage)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Étape suivante →
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Informations
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Ville</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {project.city ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Adresse</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {project.address ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Date de début</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {formatDate(project.startDate)}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Date de fin</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {formatDate(project.endDate)}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Maître d'ouvrage</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {project.owner.firstName} {project.owner.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Créé le</dt>
            <dd className="mt-0.5 font-medium text-neutral-900">
              {formatDate(project.createdAt)}
            </dd>
          </div>
        </dl>
        {project.description && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <dt className="text-sm text-neutral-500">Description</dt>
            <dd className="mt-1 text-sm text-neutral-700">{project.description}</dd>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">Membres</h2>
        {project.members.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Aucun intervenant assigné pour le moment.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {project.members.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {member.user.firstName} {member.user.lastName}
                  </p>
                  <p className="text-xs text-neutral-500">{member.user.email}</p>
                </div>
                <span className="text-xs font-medium text-neutral-500 bg-neutral-100 rounded-full px-2.5 py-0.5">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
