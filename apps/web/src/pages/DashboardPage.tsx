import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  FolderIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import type {
  BidStatus,
  IntervenantSpecialty,
  OfferStatus,
  ProjectStage,
  UserRole,
} from "@/shared";
import { SPECIALTY_LABELS } from "@/shared";
import { api } from "../lib/api";
import {
  OFFER_STATUS_BADGE,
  OFFER_STATUS_LABELS,
} from "../hooks/useBids";
import { STAGE_BADGE_CLASSES, useProjects } from "../hooks/useProjects";
import { useAuthStore } from "../store/authStore";
import { useMessageStore } from "../store/messageStore";

interface RecentBid {
  id: string;
  title: string;
  task: string;
  budget: number | null;
  deadline: string | null;
  specialty: IntervenantSpecialty | null;
  status: BidStatus;
  createdAt: string;
  project: { id: string; title: string; dossierNumber: string };
}

interface RecentOffer {
  id: string;
  price: number | null;
  timeline: string | null;
  status: OfferStatus;
  createdAt: string;
  bid: {
    id: string;
    title: string;
    task: string;
    project: { id: string; title: string };
  };
}

interface RecentProject {
  id: string;
  dossierNumber: string;
  title: string;
  stage: ProjectStage;
  city: string | null;
  createdAt: string;
}

interface IntervenantDashboardData {
  offresSubmitted: number;
  offresAccepted: number;
  projetsActifs: number;
  messagesNonLus: number;
  recentBids: RecentBid[];
  recentOffers: RecentOffer[];
  profile: {
    hasSpecialty: boolean;
    hasPhone: boolean;
    hasJoinedProject: boolean;
  };
}

interface ClientDashboardData {
  projetsActifs: number;
  documents: number;
  aoOuverts: number;
  messagesNonLus: number;
  recentProjects: RecentProject[];
  recentBids: RecentBid[];
}

type DashboardData = IntervenantDashboardData | ClientDashboardData;
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const roleBadgeClasses: Record<UserRole, string> = {
  CLIENT: "border-blue-200 bg-blue-50 text-blue-700",
  INTERVENANT: "border-amber-200 bg-amber-50 text-amber-700",
  SECRETAIRE: "border-violet-200 bg-violet-50 text-violet-700",
  ADMIN: "border-red-200 bg-red-50 text-red-700",
};

function formatToday(locale: string) {
  const date = new Date().toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return date.charAt(0).toUpperCase() + date.slice(1);
}

function formatMoney(value: number | null) {
  if (value == null) return "Budget non précisé";
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDeadline(value: string | null) {
  if (!value) return "Sans échéance";
  return `Avant le ${new Date(value).toLocaleDateString("fr-FR")}`;
}

function useAnimatedNumber(value: number) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / 1000, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return displayValue;
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  iconBackground,
  to,
}: {
  label: string;
  value: number;
  icon: IconComponent;
  iconClass: string;
  iconBackground: string;
  to: string;
}) {
  const animatedValue = useAnimatedNumber(value);

  return (
    <Link
      to={to}
      className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBackground}`}>
        <Icon className={`h-6 w-6 ${iconClass}`} aria-hidden />
      </div>
      <p className="mt-5 text-[32px] font-bold leading-none text-[#1C1917]">
        {animatedValue}
      </p>
      <p className="mt-1 text-sm text-[#6B7280]">{label}</p>
    </Link>
  );
}

function StageBadge({ stage }: { stage: ProjectStage }) {
  const { t } = useTranslation();
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STAGE_BADGE_CLASSES[stage]}`}>
      {t(`stages.${stage}`)}
    </span>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[#1C1917]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function IntervenantDashboard({
  data,
  unreadMessages,
}: {
  data: IntervenantDashboardData;
  unreadMessages: number;
}) {
  const profileSteps = [
    { label: "Compte créé", complete: true },
    { label: "Spécialité renseignée", complete: data.profile.hasSpecialty },
    { label: "Téléphone renseigné", complete: data.profile.hasPhone },
    { label: "Premier projet rejoint", complete: data.profile.hasJoinedProject },
  ];
  const profileProgress = profileSteps.filter((step) => step.complete).length * 25;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Offres soumises" value={data.offresSubmitted} icon={DocumentTextIcon} iconClass="text-blue-600" iconBackground="bg-blue-50" to="/offers" />
        <StatCard label="Offres acceptées" value={data.offresAccepted} icon={CheckCircleIcon} iconClass="text-emerald-600" iconBackground="bg-emerald-50" to="/offers" />
        <StatCard label="Projets actifs" value={data.projetsActifs} icon={BuildingOffice2Icon} iconClass="text-amber-600" iconBackground="bg-amber-50" to="/projects" />
        <StatCard label="Messages non lus" value={unreadMessages} icon={ChatBubbleLeftRightIcon} iconClass="text-violet-600" iconBackground="bg-violet-50" to="/messages" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Appels d'offres disponibles"
          action={<Link to="/bids" className="text-sm font-semibold text-amber-700 hover:text-amber-800">Voir tous les AO →</Link>}
        >
          {data.recentBids.length === 0 ? (
            <p className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-[#6B7280]">
              Aucun appel d'offres disponible pour votre spécialité pour le moment
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentBids.map((bid) => (
                <li key={bid.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link to={`/bids/${bid.id}`} className="font-semibold text-[#1C1917] hover:text-amber-700">
                        {bid.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#6B7280]">{bid.task}</p>
                      <p className="mt-2 text-xs text-neutral-500">
                        {formatMoney(bid.budget)} · {formatDeadline(bid.deadline)}
                      </p>
                    </div>
                    <Link to={`/bids/${bid.id}`} className="shrink-0 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-700">
                      Soumettre
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Mes offres récentes">
          {data.recentOffers.length === 0 ? (
            <p className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-[#6B7280]">
              Vous n'avez pas encore soumis d'offre
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentOffers.map((offer) => (
                <li key={offer.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <Link to={`/bids/${offer.bid.id}`} className="truncate font-semibold text-[#1C1917] hover:text-amber-700">
                      {offer.bid.title}
                    </Link>
                    <p className="mt-1 truncate text-sm text-[#6B7280]">
                      {offer.bid.project.title} · {formatMoney(offer.price)}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${OFFER_STATUS_BADGE[offer.status]}`}>
                    {OFFER_STATUS_LABELS[offer.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div id="profile" className="mt-6">
        <Section
          title="Profil complété"
          action={<span className="text-sm font-bold text-amber-700">{profileProgress}%</span>}
        >
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full rounded-full bg-amber-600 transition-all duration-500" style={{ width: `${profileProgress}%` }} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {profileSteps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2 text-sm">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step.complete ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-400"}`}>
                  {step.complete ? "✓" : index + 1}
                </span>
                <span className={step.complete ? "text-neutral-800" : "text-neutral-500"}>{step.label}</span>
              </div>
            ))}
          </div>
          <Link to="/profile" className="mt-6 inline-flex rounded-lg border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50">
            Compléter mon profil
          </Link>
        </Section>
      </div>
    </>
  );
}

function ClientDashboard({
  data,
  unreadMessages,
}: {
  data: ClientDashboardData;
  unreadMessages: number;
}) {
  const { data: projects = [] } = useProjects();
  const activeProjects = useMemo(
    () => projects.filter((project) => project.stage !== "TERMINE").length,
    [projects]
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Projets actifs" value={activeProjects} icon={BuildingOffice2Icon} iconClass="text-blue-600" iconBackground="bg-blue-50" to="/projects" />
        <StatCard label="Documents" value={data.documents} icon={FolderIcon} iconClass="text-violet-600" iconBackground="bg-violet-50" to="/documents" />
        <StatCard label="AO ouverts" value={data.aoOuverts} icon={MegaphoneIcon} iconClass="text-amber-600" iconBackground="bg-amber-50" to="/bids" />
        <StatCard label="Messages non lus" value={unreadMessages} icon={ChatBubbleLeftRightIcon} iconClass="text-emerald-600" iconBackground="bg-emerald-50" to="/messages" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          title="Mes projets récents"
          action={<Link to="/projects" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Voir tous mes projets →</Link>}
        >
          {data.recentProjects.length === 0 ? (
            <p className="text-sm text-[#6B7280]">Aucun projet récent</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentProjects.map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.id}`} className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#1C1917]">{project.title}</p>
                      <p className="mt-1 text-xs text-[#6B7280]">{project.dossierNumber}</p>
                    </div>
                    <StageBadge stage={project.stage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title="Appels d'offres récents"
          action={<Link to="/bids" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Voir tous les AO →</Link>}
        >
          {data.recentBids.length === 0 ? (
            <p className="text-sm text-[#6B7280]">Aucun appel d'offres récent</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.recentBids.map((bid) => (
                <li key={bid.id}>
                  <Link to={`/bids/${bid.id}`} className="block py-4 first:pt-0 last:pb-0">
                    <p className="font-semibold text-[#1C1917]">{bid.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{bid.project.title} · {bid.task}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}

export function DashboardPage() {
  const { i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const unreadByProject = useMessageStore((state) => state.unreadByProject);
  const unreadMessages = Object.values(unreadByProject).reduce((total, count) => total + count, 0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard", "stats", user?.id],
    queryFn: async () => {
      const response = await api.get<DashboardData>("/dashboard/stats");
      return response.data;
    },
    enabled: Boolean(user),
  });

  if (!user) return null;

  const roleLabel =
    user.role === "INTERVENANT"
      ? `Intervenant${user.specialty ? ` · ${SPECIALTY_LABELS[user.specialty]}` : ""}`
      : user.role === "CLIENT"
        ? "Maître d'ouvrage"
        : user.role === "SECRETAIRE"
          ? "Secrétaire"
          : "Administrateur";

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#1C1917]">
            Bonjour, {user.firstName} 👋
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">{formatToday(i18n.language)}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full border px-3.5 py-1.5 text-sm font-semibold ${roleBadgeClasses[user.role]}`}>
          {roleLabel}
        </span>
      </header>

      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-sm text-neutral-500">
          Chargement du tableau de bord…
        </div>
      )}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Impossible de charger les informations du tableau de bord.
        </div>
      )}
      {data && user.role === "INTERVENANT" && (
        <IntervenantDashboard data={data as IntervenantDashboardData} unreadMessages={unreadMessages} />
      )}
      {data && user.role !== "INTERVENANT" && (
        <ClientDashboard data={data as ClientDashboardData} unreadMessages={unreadMessages} />
      )}
    </div>
  );
}
