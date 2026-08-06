import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { SectionContainer } from "./SectionContainer";

const SLIDES = [
  {
    badge: "RÔLE 01 / 05",
    title: "Manager de projet",
    description:
      "Prenez le contrôle total de vos projets d'architecture. Supervisez chaque étape avec des outils de pilotage avancés et une visibilité complète sur votre équipe.",
    features: [
      "Tableau de bord temps réel",
      "Gestion des intervenants",
      "Rapports et statistiques",
    ],
    cta: "/roles/manager",
  },
  {
    badge: "RÔLE 02 / 05",
    title: "Intervenant spécialisé",
    description:
      "Ingénieurs, notaires, architectes, artisans — accédez aux appels d'offres qui correspondent à votre spécialité et développez votre activité.",
    features: [
      "Appels d'offres ciblés par spécialité",
      "Soumission d'offres simplifiée",
      "Profil et portfolio en ligne",
    ],
    cta: "/roles/intervenant",
  },
  {
    badge: "RÔLE 03 / 05",
    title: "Secrétaire / Mandataire",
    description:
      "Assurez la gestion administrative complète des dossiers. Coordonnez la communication entre clients et intervenants avec des outils dédiés à l'efficacité.",
    features: [
      "Gestion documentaire centralisée",
      "Suivi des délais et échéances",
      "Communication multi-parties",
    ],
    cta: "/roles/secretaire",
  },
  {
    badge: "RÔLE 04 / 05",
    title: "Chef de projet",
    description:
      "Coordonnez les équipes techniques et administratives. Pilotez les chantiers en temps réel et assurez le respect des délais et du budget.",
    features: [
      "Planning et ressources",
      "Coordination des équipes",
      "Suivi budgétaire en temps réel",
    ],
    cta: "/roles/chef-projet",
  },
  {
    badge: "RÔLE 05 / 05",
    title: "Partenaire stratégique",
    description:
      "Bureaux d'études, sociétés de construction — développez votre réseau professionnel et accédez à un flux continu de projets qualifiés au Maroc.",
    features: [
      "Réseau de partenaires qualifiés",
      "Opportunités de projets exclusives",
      "Collaboration simplifiée",
    ],
    cta: "/roles/partenaire",
  },
] as const;

const AUTO_PLAY_MS = 5000;

function ManagerIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <circle cx="270" cy="50" r="35" fill="#C47A1E" opacity="0.1" />
      <circle cx="40" cy="350" r="20" fill="#C47A1E" opacity="0.08" />
      <rect x="30" y="40" width="260" height="320" rx="16" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="30" y="40" width="260" height="64" rx="16" fill="#FDF8F0" />
      <rect x="30" y="88" width="260" height="16" fill="#FDF8F0" />
      <circle cx="65" cy="72" r="18" fill="#C47A1E" />
      <text x="65" y="77" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
        M
      </text>
      <text x="95" y="77" fill="#1C1917" fontSize="14" fontWeight="600">
        Bonjour, Manager
      </text>
      <rect x="50" y="120" width="70" height="52" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="85" y="145" textAnchor="middle" fill="#C47A1E" fontSize="16" fontWeight="700">
        12
      </text>
      <text x="85" y="162" textAnchor="middle" fill="#6B7280" fontSize="9">
        Projets
      </text>
      <rect x="130" y="120" width="70" height="52" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="165" y="145" textAnchor="middle" fill="#C47A1E" fontSize="16" fontWeight="700">
        47
      </text>
      <text x="165" y="162" textAnchor="middle" fill="#6B7280" fontSize="9">
        Docs
      </text>
      <rect x="210" y="120" width="70" height="52" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="245" y="145" textAnchor="middle" fill="#C47A1E" fontSize="16" fontWeight="700">
        8
      </text>
      <text x="245" y="162" textAnchor="middle" fill="#6B7280" fontSize="9">
        AO
      </text>
      <rect x="50" y="195" width="220" height="120" rx="12" fill="#FDF8F0" />
      <text x="60" y="215" fill="#6B7280" fontSize="10">
        Activité mensuelle
      </text>
      <rect x="65" y="260" width="22" height="35" rx="4" fill="#C47A1E" opacity="0.35" />
      <rect x="95" y="240" width="22" height="55" rx="4" fill="#C47A1E" />
      <rect x="125" y="250" width="22" height="45" rx="4" fill="#C47A1E" opacity="0.6" />
      <rect x="155" y="225" width="22" height="70" rx="4" fill="#C47A1E" />
      <rect x="185" y="245" width="22" height="50" rx="4" fill="#C47A1E" opacity="0.45" />
      <rect x="215" y="235" width="22" height="60" rx="4" fill="#C47A1E" opacity="0.8" />
      <rect x="50" y="335" width="220" height="8" rx="4" fill="#E5E7EB" />
      <rect x="50" y="335" width="175" height="8" rx="4" fill="#C47A1E" />
    </svg>
  );
}

function IntervenantIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="55" y="80" width="210" height="90" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="45" y="105" width="210" height="90" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="35" y="130" width="250" height="200" rx="14" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="55" y="150" width="52" height="20" rx="10" fill="rgba(196,122,30,0.1)" stroke="#C47A1E" />
      <text x="81" y="164" textAnchor="middle" fill="#C47A1E" fontSize="9" fontWeight="600">
        OUVERT
      </text>
      <text x="55" y="195" fill="#1C1917" fontSize="14" fontWeight="600">
        Étude structure — Villa R+
      </text>
      <text x="55" y="215" fill="#C47A1E" fontSize="13" fontWeight="600">
        Budget : 45 000 MAD
      </text>
      <text x="55" y="250" fill="#6B7280" fontSize="10">
        Casablanca · Ingénierie
      </text>
      <rect x="55" y="280" width="160" height="32" rx="8" fill="#C47A1E" />
      <text x="135" y="301" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">
        Soumettre une offre
      </text>
    </svg>
  );
}

function SecretaireIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="30" y="40" width="260" height="320" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="50" y="65" width="220" height="32" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="65" y="86" fill="#6B7280" fontSize="12">
        Rechercher un document...
      </text>
      <rect x="230" y="72" width="28" height="18" rx="6" fill="#C47A1E" />
      <text x="244" y="85" textAnchor="middle" fill="white" fontSize="14">
        ↑
      </text>
      <rect x="50" y="115" width="220" height="44" rx="8" fill="#F3F4F6" />
      <rect x="60" y="127" width="20" height="20" rx="4" fill="#C47A1E" />
      <text x="70" y="141" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
        PDF
      </text>
      <text x="90" y="135" fill="#1C1917" fontSize="11">
        Permis_construire.pdf
      </text>
      <text x="90" y="150" fill="#6B7280" fontSize="9">
        12 mars 2026
      </text>
      <rect x="230" y="128" width="32" height="18" rx="9" fill="rgba(196,122,30,0.1)" />
      <text x="246" y="141" textAnchor="middle" fill="#C47A1E" fontSize="8">
        Validé
      </text>
      <rect x="50" y="170" width="220" height="44" rx="8" fill="#F3F4F6" />
      <rect x="60" y="182" width="20" height="20" rx="4" fill="#374151" />
      <text x="70" y="196" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
        DOC
      </text>
      <text x="90" y="190" fill="#1C1917" fontSize="11">
        Contrat_intervenant.docx
      </text>
      <text x="90" y="205" fill="#6B7280" fontSize="9">
        10 mars 2026
      </text>
      <rect x="230" y="183" width="40" height="18" rx="9" fill="rgba(196,122,30,0.1)" />
      <text x="250" y="196" textAnchor="middle" fill="#C47A1E" fontSize="8">
        En cours
      </text>
      <rect x="50" y="225" width="220" height="44" rx="8" fill="#F3F4F6" />
      <rect x="60" y="237" width="20" height="20" rx="4" fill="#C47A1E" opacity="0.7" />
      <text x="70" y="251" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">
        XLS
      </text>
      <text x="90" y="245" fill="#1C1917" fontSize="11">
        Budget_projet.xlsx
      </text>
      <text x="90" y="260" fill="#6B7280" fontSize="9">
        8 mars 2026
      </text>
      <rect x="50" y="290" width="220" height="6" rx="3" fill="#E5E7EB" />
      <rect x="50" y="290" width="150" height="6" rx="3" fill="#C47A1E" />
      <text x="50" y="315" fill="#6B7280" fontSize="9">
        Upload en cours — 68%
      </text>
    </svg>
  );
}

function ChefProjetIllustration() {
  const tasks = [
    { label: "Conception", opacity: 1, width: 200, pct: "100%" },
    { label: "Autorisation", opacity: 0.7, width: 150, pct: "75%" },
    { label: "Réalisation", opacity: 0.5, width: 80, pct: "40%" },
    { label: "Réception", opacity: 0.3, width: 20, pct: "10%" },
  ];

  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="30" y="50" width="260" height="300" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
      <text x="50" y="85" fill="#1C1917" fontSize="14" fontWeight="600">
        Planning projet
      </text>
      {tasks.map((task, i) => {
        const y = 110 + i * 60;
        return (
          <g key={task.label}>
            <text x="50" y={y + 5} fill="#6B7280" fontSize="11">
              {task.label}
            </text>
            <rect x="50" y={y + 15} width={200} height="8" rx="4" fill="#E5E7EB" />
            <rect
              x="50"
              y={y + 15}
              width={task.width}
              height="8"
              rx="4"
              fill="#C47A1E"
              opacity={task.opacity}
            />
            <circle cx="50" cy={y + 19} r="5" fill="#C47A1E" />
            <text x="260" y={y + 22} fill="#C47A1E" fontSize="11" fontWeight="600">
              {task.pct}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function PartenaireIllustration() {
  const satellites = [
    { x: 160, y: 70, label: "BTP" },
    { x: 260, y: 130, label: "ING" },
    { x: 240, y: 250, label: "NOT" },
    { x: 80, y: 250, label: "ARC" },
    { x: 60, y: 130, label: "URB" },
  ];

  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect width="320" height="400" fill="#FDF8F0" />
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={40 + col * 48}
            cy={40 + row * 48}
            r="1.5"
            fill="#1C1917"
            opacity="0.05"
          />
        )),
      )}
      {satellites.map((sat) => (
        <line
          key={sat.label}
          x1="160"
          y1="200"
          x2={sat.x}
          y2={sat.y}
          stroke="#C47A1E"
          strokeWidth="1.5"
          opacity="0.3"
          className="role-network-line-pulse"
        />
      ))}
      {satellites.map((sat) => (
        <g key={`node-${sat.label}`}>
          <circle cx={sat.x} cy={sat.y} r="22" fill="#FFFFFF" stroke="#C47A1E" strokeWidth="1.5" />
          <text x={sat.x} y={sat.y + 4} textAnchor="middle" fill="#1C1917" fontSize="9" fontWeight="600">
            {sat.label}
          </text>
        </g>
      ))}
      <circle cx="160" cy="200" r="36" fill="#C47A1E" />
      <text x="160" y="206" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">
        MA
      </text>
    </svg>
  );
}

const ILLUSTRATIONS = [
  ManagerIllustration,
  IntervenantIllustration,
  SecretaireIllustration,
  ChefProjetIllustration,
  PartenaireIllustration,
];

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C47A1E] text-[10px] text-white">
        ✓
      </span>
      <span className="text-sm text-[#374151]">{text}</span>
    </li>
  );
}

export function RolePlatformSlider() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
    setProgressKey((k) => k + 1);
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
      setProgressKey((k) => k + 1);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const safeIndex = ((current % SLIDES.length) + SLIDES.length) % SLIDES.length;
  const slide = SLIDES[safeIndex]!;
  const Illustration = ILLUSTRATIONS[safeIndex]!;

  return (
    <section className="bg-[#FDF8F0] pb-[60px] pt-20">
      <SectionContainer className="text-center">
        <h2 className="mb-4 text-[42px] font-bold leading-tight text-[#1C1917]">
          {t("roles_section.title")}
        </h2>
        <p className="mb-6 text-lg text-[#6B7280]">
          {t("roles_section.subtitle")}
        </p>
        <div className="mx-auto mb-12 h-0.5 w-10 bg-[#C47A1E]" />
      </SectionContainer>

      <div className="mx-12">
        <div
          className="relative h-[600px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div key={current} className="absolute inset-0 flex">
              <motion.div
                className="flex w-1/2 flex-col justify-center bg-white px-10 py-16 md:px-16"
                initial={{ x: 60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -60, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="inline-flex w-fit rounded-full border border-[rgba(196,122,30,0.3)] bg-[rgba(196,122,30,0.1)] px-3.5 py-1.5 text-[11px] tracking-[0.2em] text-[#C47A1E]">
                  {slide.badge}
                </span>

                <h3 className="mt-6 text-[38px] font-bold leading-tight text-[#1C1917]">
                  {slide.title}
                </h3>

                <p className="mt-4 max-w-[420px] text-base leading-[1.8] text-[#6B7280]">
                  {slide.description}
                </p>

                <ul className="mt-8 flex flex-col gap-3">
                  {slide.features.map((feature) => (
                    <FeatureItem key={feature} text={feature} />
                  ))}
                </ul>

                <Link
                  to={slide.cta}
                  className="mt-10 inline-flex w-fit rounded-lg bg-[#C47A1E] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:translate-x-1 hover:bg-[#A3611A]"
                >
                  {t("roles_section.learn_more")} →
                </Link>

                <div className="mt-auto flex items-center gap-2 pb-10 pt-8">
                  {SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Aller au rôle ${index + 1}`}
                      onClick={() => goTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === current
                          ? "w-8 bg-[#C47A1E]"
                          : "w-2 bg-[#E5E7EB] hover:bg-[#D1D5DB]"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="flex w-1/2 items-center justify-center overflow-hidden border-l border-[#E5E7EB] bg-[#FDF8F0]"
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 60, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Illustration />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-10 z-10 flex gap-2">
            <button
              type="button"
              aria-label="Rôle précédent"
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6] text-[#1C1917] transition-colors hover:bg-[#C47A1E] hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Rôle suivant"
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6] text-[#1C1917] transition-colors hover:bg-[#C47A1E] hover:text-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5E7EB]">
            <div
              key={progressKey}
              className={`h-full bg-[#C47A1E] ${
                isPaused ? "platform-slider-progress-paused" : "platform-slider-progress"
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
