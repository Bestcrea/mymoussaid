import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { SectionContainer } from "./SectionContainer";

const SLIDES = [
  {
    badge: "ÉTAPE 01 / 04",
    title: "Créez votre compte",
    description:
      "Inscrivez-vous en quelques minutes. Choisissez votre rôle et configurez votre profil professionnel pour accéder à la plateforme.",
    features: [
      "Inscription gratuite et sécurisée",
      "Vérification d'identité",
      "Profil personnalisé par rôle",
    ],
  },
  {
    badge: "ÉTAPE 02 / 04",
    title: "Ouvrez un dossier projet",
    description:
      "Créez votre projet avec un numéro de dossier unique. Définissez les étapes et centralisez tous vos documents en un endroit sécurisé.",
    features: ["Numéro de dossier unique", "Suivi des 7 étapes clés", "Documents centralisés"],
  },
  {
    badge: "ÉTAPE 03 / 04",
    title: "Collaborez avec les intervenants",
    description:
      "Lancez vos appels d'offres, recevez les propositions des intervenants qualifiés et communiquez en temps réel.",
    features: ["Appels d'offres ciblés", "Messagerie temps réel", "Évaluation des offres"],
  },
  {
    badge: "ÉTAPE 04 / 04",
    title: "Suivez l'avancement en temps réel",
    description:
      "Visualisez l'avancement à chaque étape. Recevez des notifications et gardez le contrôle total de votre projet.",
    features: [
      "Tableau de bord personnalisé",
      "Notifications en temps réel",
      "Rapports et statistiques",
    ],
  },
] as const;

const AUTO_PLAY_MS = 5000;

function SignupIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <circle cx="260" cy="60" r="40" fill="#C47A1E" opacity="0.1" />
      <circle cx="50" cy="320" r="25" fill="#C47A1E" opacity="0.1" />
      <rect x="40" y="40" width="240" height="320" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <circle cx="160" cy="100" r="32" fill="#C47A1E" />
      <text x="160" y="106" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
        MA
      </text>
      <rect x="70" y="155" width="180" height="28" rx="8" fill="#F3F4F6" stroke="#E5E7EB" />
      <rect x="70" y="195" width="180" height="28" rx="8" fill="#F3F4F6" stroke="#E5E7EB" />
      <rect x="70" y="235" width="180" height="28" rx="8" fill="#F3F4F6" stroke="#E5E7EB" />
      <rect x="70" y="275" width="80" height="10" rx="4" fill="#E5E7EB" />
      <rect x="70" y="295" width="120" height="10" rx="4" fill="#F3F4F6" />
      <rect x="90" y="325" width="140" height="36" rx="10" fill="#C47A1E" />
      <text x="160" y="348" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">
        S&apos;inscrire
      </text>
    </svg>
  );
}

function FolderIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="55" y="90" width="210" height="130" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="45" y="110" width="210" height="130" rx="12" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="35" y="130" width="250" height="200" rx="14" fill="#FFFFFF" stroke="#E5E7EB" />
      <rect x="55" y="175" width="28" height="22" rx="4" fill="#C47A1E" />
      <text x="95" y="192" fill="#1C1917" fontSize="14" fontWeight="600">
        MA-2026-001
      </text>
      <text x="95" y="212" fill="#6B7280" fontSize="11">
        Villa Casablanca — En cours
      </text>
      <rect x="55" y="230" width="210" height="6" rx="3" fill="#E5E7EB" />
      <rect x="55" y="230" width="140" height="6" rx="3" fill="#C47A1E" />
      <text x="55" y="258" fill="#6B7280" fontSize="10">
        Étape 4 / 7 — Permis de construire
      </text>
      <rect x="55" y="275" width="90" height="50" rx="8" fill="#FDF8F0" stroke="#E5E7EB" />
      <rect x="155" y="275" width="90" height="50" rx="8" fill="#F3F4F6" stroke="#E5E7EB" />
      <text x="100" y="305" textAnchor="middle" fill="#C47A1E" fontSize="18" fontWeight="700">
        57%
      </text>
      <text x="200" y="305" textAnchor="middle" fill="#6B7280" fontSize="11">
        12 docs
      </text>
    </svg>
  );
}

function ChatIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="30" y="30" width="260" height="340" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
      <text x="50" y="65" fill="#1C1917" fontSize="14" fontWeight="600">
        Messagerie projet
      </text>
      <circle cx="55" cy="110" r="16" fill="#E5E7EB" />
      <text x="55" y="115" textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        AB
      </text>
      <rect x="80" y="95" width="150" height="36" rx="12" fill="#F3F4F6" />
      <text x="95" y="118" fill="#1C1917" fontSize="11">
        Proposition reçue ✓
      </text>
      <rect x="130" y="155" width="160" height="40" rx="12" fill="#C47A1E" />
      <text x="145" y="180" fill="white" fontSize="11">
        Merci, je valide l&apos;offre
      </text>
      <circle cx="265" cy="175" r="16" fill="#E5E7EB" />
      <text x="265" y="180" textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        JD
      </text>
      <circle cx="55" cy="230" r="16" fill="#E5E7EB" />
      <text x="55" y="235" textAnchor="middle" fill="#6B7280" fontSize="10" fontWeight="600">
        MK
      </text>
      <rect x="80" y="215" width="130" height="36" rx="12" fill="#F3F4F6" />
      <text x="95" y="238" fill="#1C1917" fontSize="11">
        Documents envoyés
      </text>
      <rect x="40" y="310" width="240" height="44" rx="12" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="55" y="337" fill="#6B7280" fontSize="12">
        Écrire un message...
      </text>
      <circle cx="255" cy="332" r="14" fill="#C47A1E" />
      <path d="M250 332 L260 332 M255 327 L255 337" stroke="white" strokeWidth="2" />
    </svg>
  );
}

function DashboardIllustration() {
  return (
    <svg width="320" height="400" viewBox="0 0 320 400" fill="none" aria-hidden>
      <rect x="30" y="30" width="260" height="340" rx="18" fill="#FFFFFF" stroke="#E5E7EB" />
      <text x="50" y="65" fill="#1C1917" fontSize="14" fontWeight="600">
        Tableau de bord
      </text>
      <rect x="50" y="85" width="70" height="55" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="85" y="110" textAnchor="middle" fill="#C47A1E" fontSize="18" fontWeight="700">
        7
      </text>
      <text x="85" y="128" textAnchor="middle" fill="#6B7280" fontSize="9">
        Étapes
      </text>
      <rect x="130" y="85" width="70" height="55" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="165" y="110" textAnchor="middle" fill="#C47A1E" fontSize="18" fontWeight="700">
        24
      </text>
      <text x="165" y="128" textAnchor="middle" fill="#6B7280" fontSize="9">
        Docs
      </text>
      <rect x="210" y="85" width="70" height="55" rx="10" fill="#FDF8F0" stroke="#E5E7EB" />
      <text x="245" y="110" textAnchor="middle" fill="#C47A1E" fontSize="18" fontWeight="700">
        86%
      </text>
      <text x="245" y="128" textAnchor="middle" fill="#6B7280" fontSize="9">
        Avancement
      </text>
      <rect x="50" y="160" width="220" height="100" rx="10" fill="#FDF8F0" />
      <text x="65" y="178" fill="#6B7280" fontSize="9">
        Progression mensuelle
      </text>
      <rect x="70" y="220" width="22" height="30" rx="3" fill="#C47A1E" opacity="0.3" />
      <rect x="100" y="200" width="22" height="50" rx="3" fill="#C47A1E" opacity="0.7" />
      <rect x="130" y="210" width="22" height="40" rx="3" fill="#C47A1E" opacity="0.5" />
      <rect x="160" y="185" width="22" height="65" rx="3" fill="#C47A1E" />
      <rect x="190" y="205" width="22" height="45" rx="3" fill="#C47A1E" opacity="0.8" />
      <rect x="50" y="280" width="220" height="8" rx="4" fill="#E5E7EB" />
      <rect x="50" y="280" width="165" height="8" rx="4" fill="#C47A1E" />
      <circle cx="50" cy="320" r="5" fill="#C47A1E" />
      <text x="65" y="324" fill="#6B7280" fontSize="10">
        Permis validé — il y a 2h
      </text>
      <circle cx="50" cy="345" r="5" fill="#C47A1E" opacity="0.5" />
      <text x="65" y="349" fill="#6B7280" fontSize="10">
        Nouveau document ajouté
      </text>
    </svg>
  );
}

const ILLUSTRATIONS = [
  SignupIllustration,
  FolderIllustration,
  ChatIllustration,
  DashboardIllustration,
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

export function PlatformSlider() {
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
    <section className="bg-white pb-[60px] pt-20">
      <SectionContainer className="text-center">
        <h2 className="mb-4 text-[42px] font-bold leading-tight text-[#1C1917]">
          {t("platform.title")}
        </h2>
        <p className="mb-6 text-lg text-[#6B7280]">
          {t("platform.subtitle")}
        </p>
        <div className="mx-auto mb-12 h-0.5 w-10 bg-[#C47A1E]" />
      </SectionContainer>

      <div className="mx-12">
        <div
          className="relative h-[600px] overflow-hidden rounded-2xl bg-[#FDF8F0] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div key={current} className="absolute inset-0 flex">
              <motion.div
                className="flex w-1/2 flex-col justify-center bg-[#FDF8F0] px-10 py-16 md:px-16"
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
                  to="/register"
                  className="mt-10 inline-flex w-fit rounded-lg bg-[#C47A1E] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:translate-x-1 hover:bg-[#A3611A]"
                >
                  Commencer maintenant →
                </Link>

                <div className="mt-auto flex items-center gap-2 pb-10 pt-8">
                  {SLIDES.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Aller à l'étape ${index + 1}`}
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
                className="flex w-1/2 items-center justify-center overflow-hidden border-l border-[#E5E7EB] bg-white"
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
              aria-label="Étape précédente"
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6] text-[#1C1917] transition-colors hover:bg-[#C47A1E] hover:text-white"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Étape suivante"
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
