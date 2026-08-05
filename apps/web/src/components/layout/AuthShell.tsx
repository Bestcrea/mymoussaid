import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Logo } from "../ui/Logo";

const PARTICLES = [
  { size: 60, x: "8%", y: "12%", duration: 5, opacity: 0.1 },
  { size: 40, x: "75%", y: "18%", duration: 4, opacity: 0.08 },
  { size: 60, x: "60%", y: "55%", duration: 7, opacity: 0.06 },
  { size: 28, x: "20%", y: "70%", duration: 3, opacity: 0.12 },
  { size: 50, x: "85%", y: "75%", duration: 6, opacity: 0.07 },
  { size: 45, x: "40%", y: "30%", duration: 8, opacity: 0.08 },
  { size: 30, x: "12%", y: "45%", duration: 4.5, opacity: 0.1 },
  { size: 50, x: "70%", y: "40%", duration: 5.5, opacity: 0.06 },
] as const;

export function AuthHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[72px] items-center justify-between border-b border-[#F3F4F6] bg-white px-10 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <Logo size="md" variant="light" linkTo="/" />
      <Link
        to="/"
        className="text-sm font-medium text-[#C47A1E] transition-colors hover:underline"
      >
        Retour au site →
      </Link>
    </header>
  );
}

function FloatingParticles({ subtle = false }: { subtle?: boolean }) {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#C47A1E]"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            opacity: subtle ? p.opacity * 0.55 : p.opacity,
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export function AuthLoginPanel() {
  return (
    <div className="relative hidden h-full w-[45%] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#1C1917_0%,#2d1f0e_50%,#3d2912_100%)] lg:flex lg:flex-col lg:items-center lg:justify-center">
      <FloatingParticles />
      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <Logo size="sm" variant="dark" linkTo="" />
        <p className="mt-3 text-xs text-[#9CA3AF]">
          Plateforme de gestion de projets
        </p>
      </div>
      <div className="absolute bottom-6 left-0 right-0 z-10 flex items-center justify-center px-6">
        {[
          { value: "150+", label: "Projets" },
          { value: "200+", label: "Clients" },
          { value: "12 ans", label: "Expertise" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && <div className="mx-4 h-8 w-px bg-white/20" />}
            <div className="text-center">
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-[#9CA3AF]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const REGISTER_PARTICLES = [
  { size: 60, x: "8%", y: "14%", duration: 4, opacity: 0.08 },
  { size: 40, x: "78%", y: "12%", duration: 5, opacity: 0.1 },
  { size: 80, x: "72%", y: "55%", duration: 3, opacity: 0.06 },
  { size: 30, x: "14%", y: "68%", duration: 6, opacity: 0.12 },
  { size: 50, x: "43%", y: "38%", duration: 4.5, opacity: 0.07 },
] as const;

const REGISTER_STATS = [
  { value: "0", label: "Projets" },
  { value: "0", label: "Documents" },
  { value: "0", label: "Messages" },
] as const;

const PROFILE_STEPS = [
  { label: "Compte créé", complete: true },
  { label: "Email vérifié", complete: true },
  { label: "Profil complété", complete: false },
  { label: "Premier projet", complete: false },
] as const;

function RegisterDashboardIllustration() {
  return (
    <motion.div
      className="mt-6 w-full max-w-[340px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <svg
        viewBox="0 0 340 260"
        className="h-auto w-full"
        fill="none"
        aria-label="Aperçu du tableau de bord MyMoussaid"
        role="img"
      >
        <rect
          x="5"
          y="5"
          width="330"
          height="250"
          rx="16"
          fill="#2A2520"
          stroke="rgba(196,122,30,0.3)"
        />

        <circle cx="31" cy="35" r="14" fill="#C47A1E" />
        <text
          x="31"
          y="40"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          M
        </text>
        <text
          x="55"
          y="32"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="600"
          fontFamily="Inter, sans-serif"
        >
          Bonjour, nouveau membre !
        </text>
        <text
          x="55"
          y="48"
          fill="#9CA3AF"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          MyMoussaid Platform
        </text>

        {REGISTER_STATS.map((stat, index) => {
          const x = 24 + index * 99;
          return (
            <motion.g
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.1, duration: 0.3 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={x}
                y="70"
                width="88"
                height="54"
                rx="8"
                fill="#1C1917"
                stroke="rgba(196,122,30,0.2)"
              />
              <text
                x={x + 12}
                y="94"
                fill="#C47A1E"
                fontSize="16"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {stat.value}
              </text>
              <text
                x={x + 12}
                y="111"
                fill="#9CA3AF"
                fontSize="10"
                fontFamily="Inter, sans-serif"
              >
                {stat.label}
              </text>
            </motion.g>
          );
        })}

        <text
          x="24"
          y="145"
          fill="#FFFFFF"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          Configuration du profil
        </text>
        <rect x="24" y="154" width="292" height="6" rx="3" fill="#1C1917" />
        <motion.rect
          x="24"
          y="154"
          height="6"
          rx="3"
          fill="#C47A1E"
          initial={{ width: 0 }}
          animate={{ width: 190 }}
          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
        />

        {PROFILE_STEPS.map((step, index) => {
          const y = 183 + index * 20;
          return (
            <g key={step.label}>
              {step.complete ? (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 1.05 + index * 0.12,
                    type: "spring",
                    stiffness: 320,
                    damping: 18,
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <circle cx="30" cy={y - 4} r="7" fill="#22C55E" />
                  <path
                    d={`M26 ${y - 4}l3 3 5-6`}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.g>
              ) : (
                <circle
                  cx="30"
                  cy={y - 4}
                  r="6"
                  stroke="#6B7280"
                  strokeWidth="1.5"
                />
              )}
              <text
                x="44"
                y={y}
                fill={step.complete ? "#FFFFFF" : "#6B7280"}
                fontSize="11"
                fontFamily="Inter, sans-serif"
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  );
}

export function AuthRegisterPanel() {
  return (
    <div className="relative hidden h-full w-[45%] shrink-0 overflow-hidden bg-[linear-gradient(135deg,#1C1917_0%,#2d1f0e_50%,#3d2912_100%)] lg:flex lg:flex-col lg:items-center lg:justify-center">
      {REGISTER_PARTICLES.map((particle, index) => (
        <motion.div
          key={index}
          className="pointer-events-none absolute rounded-full bg-[#C47A1E]"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
          }}
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 flex w-full flex-col items-center px-8 pb-16 text-center">
        <Logo size="sm" variant="dark" linkTo="" />
        <h2 className="mt-4 text-lg font-semibold text-white">
          Bienvenue sur MyMoussaid
        </h2>
        <p className="mt-2 text-xs text-[#9CA3AF]">
          Votre plateforme de gestion de projets
        </p>
        <RegisterDashboardIllustration />
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-between px-6">
        {[
          { value: "150+", label: "Projets" },
          { value: "200+", label: "Clients" },
          { value: "12 ans", label: "Expertise" },
        ].map((stat, index) => (
          <div key={stat.label} className="flex flex-1 items-center">
            {index > 0 && <div className="mr-4 h-8 w-px bg-white/15" />}
            <div className="flex-1 text-center">
              <p className="text-base font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-[#9CA3AF]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthShell({
  children,
  panel,
}: {
  children: ReactNode;
  panel: ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-white">
      <AuthHeader />
      <div className="mt-[72px] flex h-[calc(100vh-72px)] flex-row overflow-hidden">
        <div className="flex h-full w-full items-center justify-center overflow-y-auto bg-white lg:w-[55%]">
          {children}
        </div>
        {panel}
      </div>
    </div>
  );
}

export const authInputClass =
  "h-[46px] w-full rounded-[10px] border-[1.5px] border-[#E5E7EB] bg-white px-4 text-[15px] text-[#1C1917] placeholder-[#9CA3AF] transition-all duration-200 focus:border-[#C47A1E] focus:outline-none focus:shadow-[0_0_0_3px_rgba(196,122,30,0.1)]";

export const authSelectClass =
  "h-[46px] w-full cursor-pointer appearance-none rounded-[10px] border-[1.5px] border-[#E5E7EB] bg-white bg-[length:16px_16px] bg-[position:right_16px_center] bg-no-repeat pl-4 pr-10 text-[15px] text-[#1C1917] transition-all duration-200 focus:border-[#C47A1E] focus:outline-none focus:shadow-[0_0_0_3px_rgba(196,122,30,0.1)]";

export const authSelectStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C47A1E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
} as const;

export const authLabelClass =
  "mb-1.5 block text-sm font-medium text-[#374151]";

export function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
          stroke="#6B7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="1" y1="1" x2="23" y2="23" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="#6B7280"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" />
    </svg>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
