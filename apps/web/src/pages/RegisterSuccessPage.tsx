import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../components/ui/Logo";

interface TimelineStep {
  label: string;
  status: "done" | "current" | "pending";
}

const TIMELINE_STEPS: TimelineStep[] = [
  { label: "Étape 1 : Demande soumise", status: "done" },
  { label: "Étape 2 : Examen par l'équipe", status: "current" },
  { label: "Étape 3 : Notification par email", status: "pending" },
  { label: "Étape 4 : Accès à la plateforme", status: "pending" },
];

function CheckmarkCircle() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]"
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
        <motion.path
          d="M5 13l4 4L19 7"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  );
}

function TimelineItem({ step, index }: { step: TimelineStep; index: number }) {
  const isDone = step.status === "done";
  const isCurrent = step.status === "current";
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.35 }}
      className="flex items-center gap-3"
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          isDone
            ? "bg-[#22C55E] text-white"
            : isCurrent
              ? "bg-[#C47A1E] text-white"
              : "bg-[#F3F4F6] text-[#9CA3AF]"
        }`}
      >
        {isDone ? "✓" : isCurrent ? "…" : "○"}
      </span>
      <span
        className={`text-sm ${
          isDone || isCurrent ? "font-medium text-[#1C1917]" : "text-[#6B7280]"
        }`}
      >
        {step.label}
      </span>
    </motion.div>
  );
}

export function RegisterSuccessPage() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? "votre adresse email";

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[520px] text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="md" linkTo="/" />
        </div>

        <CheckmarkCircle />

        <h1 className="mt-6 text-[28px] font-bold text-[#1C1917]">Demande soumise avec succès !</h1>
        <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
          Votre demande d&apos;inscription a bien été enregistrée. Notre équipe va examiner votre dossier et vous
          informera dès que votre compte sera validé.
        </p>

        <div className="mt-6 rounded-xl border border-[#F0D9B5] bg-[#FDF3E7] px-5 py-4 text-sm text-[#8A5518]">
          Un email de confirmation sera envoyé à{" "}
          <span className="font-semibold text-[#C47A1E]">{email}</span> dès que votre compte aura été examiné.
        </div>

        <div className="mt-8 space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-6 text-left">
          {TIMELINE_STEPS.map((step, index) => (
            <TimelineItem key={step.label} step={step} index={index} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/"
            className="flex h-11 w-full max-w-[280px] items-center justify-center rounded-lg bg-[#C47A1E] px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#A86518]"
          >
            Retour à l&apos;accueil
          </Link>
          <Link to="/contact" className="text-sm font-medium text-[#C47A1E] hover:underline">
            Contacter le support
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
