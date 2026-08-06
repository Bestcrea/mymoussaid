import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import type { IntervenantSpecialty, RegisterInput } from "@/shared";
import { SPECIALTY_LABELS } from "@/shared";
import { api } from "../lib/api";
import { Logo } from "../components/ui/Logo";
import { EyeIcon, Spinner } from "../components/layout/AuthShell";
import {
  ACCOUNT_TYPES,
  CROA_COUNCILS,
  MOROCCAN_CITIES,
  type AccountTypeId,
} from "../constants/registration";

type AccountTypeDef = (typeof ACCOUNT_TYPES)[number];
type AccountTypeIconKind = AccountTypeDef["icon"];

type FormData = {
  civility: "M." | "Mme" | "";
  cinNumber: string;
  lastName: string;
  firstName: string;
  lastNameAr: string;
  firstNameAr: string;
  city: string;
  regionalCouncil: string;
  specialty: string;
  address: string;
  licenseNumber: string;
  email: string;
  phone: string;
  organizedAsCompany: boolean;
  saveBilling: boolean;
  billingType: "personne_physique" | "personne_morale";
  billingName: string;
  billingCity: string;
  billingAddress: string;
  billingCin: string;
  billingIce: string;
  billingRc: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const INITIAL_FORM_DATA: FormData = {
  civility: "",
  cinNumber: "",
  lastName: "",
  firstName: "",
  lastNameAr: "",
  firstNameAr: "",
  city: "",
  regionalCouncil: "",
  specialty: "",
  address: "",
  licenseNumber: "",
  email: "",
  phone: "",
  organizedAsCompany: false,
  saveBilling: false,
  billingType: "personne_physique",
  billingName: "",
  billingCity: "",
  billingAddress: "",
  billingCin: "",
  billingIce: "",
  billingRc: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: false,
};

/* ────────────────────────────  Styling helpers  ──────────────────────────── */

const inputClass =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-[#1C1917] placeholder-[#9CA3AF] transition-colors duration-150 focus:border-[#C47A1E] focus:outline-none focus:ring-1 focus:ring-[#C47A1E]";

const selectClass = `${inputClass} cursor-pointer appearance-none bg-[length:16px_16px] bg-[position:right_14px_center] bg-no-repeat pr-9`;

const selectBgStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23C47A1E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
} as const;

const labelClass = "mb-1.5 block text-sm font-medium text-[#374151]";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: Math.max(score, password ? 1 : 0), label: "Faible", color: "#EF4444" };
  if (score === 2) return { score, label: "Moyen", color: "#F97316" };
  if (score === 3) return { score, label: "Bon", color: "#EAB308" };
  return { score, label: "Fort", color: "#22C55E" };
}

/* ────────────────────────────  Validation  ──────────────────────────── */

function validateStep1(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.civility) errors.civility = "La civilité est requise";
  if (!data.cinNumber.trim()) errors.cinNumber = "Le CIN / Passeport est requis";
  if (!data.lastName.trim()) errors.lastName = "Le nom est requis";
  if (!data.firstName.trim()) errors.firstName = "Le prénom est requis";
  if (!data.lastNameAr.trim()) errors.lastNameAr = "Le nom en arabe est requis";
  if (!data.firstNameAr.trim()) errors.firstNameAr = "Le prénom en arabe est requis";
  return errors;
}

function validateStep2(data: FormData, accountType: AccountTypeDef): FormErrors {
  const errors: FormErrors = {};
  if (!data.city) errors.city = "La ville est requise";
  if (accountType.needsCroa && !data.regionalCouncil) {
    errors.regionalCouncil = "Le conseil régional est requis";
  }
  if (!accountType.needsCroa && accountType.needsSpecialty && !data.specialty) {
    errors.specialty = "La spécialité est requise";
  }
  if (!data.address.trim()) errors.address = "L'adresse est requise";
  if (accountType.isProfessional && !data.licenseNumber.trim()) {
    errors.licenseNumber = "Le numéro est requis";
  }
  if (!data.email.trim()) {
    errors.email = "L'email est requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Email invalide";
  }
  if (!data.phone.trim()) errors.phone = "Le téléphone est requis";
  return errors;
}

function validateStep3(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.billingName.trim()) errors.billingName = "Ce champ est requis";
  if (!data.billingCity) errors.billingCity = "La ville est requise";
  if (!data.billingAddress.trim()) errors.billingAddress = "L'adresse est requise";
  if (data.billingType === "personne_physique") {
    if (!data.billingCin.trim()) errors.billingCin = "Le CIN est requis";
  } else {
    if (!data.billingIce.trim()) errors.billingIce = "L'ICE est requis";
    if (!data.billingRc.trim()) errors.billingRc = "Le RC est requis";
  }
  return errors;
}

function validateStep4(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.password) {
    errors.password = "Le mot de passe est requis";
  } else if (data.password.length < 8) {
    errors.password = "Minimum 8 caractères";
  }
  if (!data.confirmPassword) {
    errors.confirmPassword = "Veuillez confirmer le mot de passe";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }
  if (!data.acceptedTerms) errors.acceptedTerms = "Vous devez accepter les conditions";
  return errors;
}

/* ────────────────────────────  Left side panel  ──────────────────────────── */

const SIDE_SLIDES = [
  {
    title: "Gérez vos projets",
    subtitle: "Suivez chaque étape de vos dossiers",
    illustration: "manage" as const,
  },
  {
    title: "Vos Autorisations à distance",
    subtitle: "Demandez vos autorisations en ligne",
    illustration: "authorize" as const,
  },
  {
    title: "Suivez vos Demandes",
    subtitle: "Soyez alertés des changements de statut",
    illustration: "track" as const,
  },
];

const SLIDE_DURATION_MS = 4000;

function SideSlideIllustration({ variant }: { variant: "manage" | "authorize" | "track" }) {
  if (variant === "manage") {
    return (
      <svg viewBox="0 0 280 220" className="h-auto w-full max-w-[260px]" fill="none" aria-hidden>
        <rect x="20" y="20" width="240" height="180" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(196,122,30,0.35)" />
        <circle cx="70" cy="72" r="22" fill="#C47A1E" />
        <path d="M40 132c0-18 13-32 30-32s30 14 30 32" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
        <rect x="120" y="55" width="120" height="12" rx="6" fill="rgba(255,255,255,0.25)" />
        <rect x="120" y="80" width="90" height="10" rx="5" fill="rgba(255,255,255,0.15)" />
        <rect x="40" y="152" width="200" height="8" rx="4" fill="rgba(255,255,255,0.12)" />
        <rect x="40" y="152" width="130" height="8" rx="4" fill="#C47A1E" />
      </svg>
    );
  }
  if (variant === "authorize") {
    return (
      <svg viewBox="0 0 280 220" className="h-auto w-full max-w-[260px]" fill="none" aria-hidden>
        <rect x="70" y="20" width="140" height="180" rx="12" fill="rgba(255,255,255,0.06)" stroke="rgba(196,122,30,0.35)" />
        <rect x="90" y="45" width="100" height="10" rx="5" fill="rgba(255,255,255,0.25)" />
        <rect x="90" y="65" width="70" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
        <rect x="90" y="90" width="100" height="1" fill="rgba(255,255,255,0.15)" />
        <rect x="90" y="105" width="80" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
        <rect x="90" y="122" width="60" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
        <circle cx="175" cy="160" r="26" fill="#C47A1E" />
        <path d="M164 160l7 7 14-14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 280 220" className="h-auto w-full max-w-[260px]" fill="none" aria-hidden>
      <circle cx="140" cy="55" r="24" fill="#C47A1E" />
      <path d="M132 55l5 5 10-11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="60" y="105" width="160" height="14" rx="7" fill="rgba(255,255,255,0.12)" />
      <rect x="60" y="105" width="100" height="14" rx="7" fill="#C47A1E" />
      <rect x="60" y="135" width="160" height="14" rx="7" fill="rgba(255,255,255,0.1)" />
      <rect x="60" y="135" width="60" height="14" rx="7" fill="rgba(255,255,255,0.35)" />
      <rect x="60" y="165" width="160" height="14" rx="7" fill="rgba(255,255,255,0.08)" />
      <circle cx="230" cy="35" r="6" fill="#C47A1E" opacity="0.7" />
    </svg>
  );
}

function RegisterSidePanel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SIDE_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  const slide = SIDE_SLIDES[index]!;

  return (
    <div className="relative hidden h-full w-[32%] shrink-0 flex-col overflow-hidden bg-[linear-gradient(180deg,#1a3a5c_0%,#0f2340_100%)] lg:flex">
      <div className="relative z-10 px-10 pt-10">
        <Logo size="sm" variant="dark" linkTo="" />
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <SideSlideIllustration variant={slide.illustration} />
            <h2 className="mt-8 text-2xl font-bold leading-tight text-white">{slide.title}</h2>
            <p className="mt-3 max-w-[280px] text-sm text-white/60">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mb-10 flex items-center justify-center gap-2">
        {SIDE_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Aller à la diapositive ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-8 bg-[#C47A1E]" : "w-2 bg-white/25 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────  Account type step  ──────────────────────────── */

function AccountTypeIcon({ type }: { type: AccountTypeIconKind }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "#C47A1E",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (type) {
    case "client":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        </svg>
      );
    case "company":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="10" height="18" rx="1" />
          <rect x="14" y="9" width="6" height="12" rx="1" />
          <path d="M7 7h2M7 11h2M7 15h2M16 12h1M16 15h1M16 18h1" />
        </svg>
      );
    case "architect":
      return (
        <svg {...common}>
          <path d="M12 3 4 20h16L12 3z" />
          <path d="M12 3v13" />
          <circle cx="12" cy="19.2" r="1.3" fill="#C47A1E" stroke="none" />
        </svg>
      );
    case "engineer":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3M3 12h2.5M18.5 12H21" />
        </svg>
      );
    case "specialist":
      return (
        <svg {...common}>
          <path d="M14.7 6.3a3 3 0 10-4.2 4.2L4 17l2 2 6.5-6.5" />
          <path d="M14 5l1 1M18 9l1 1" />
        </svg>
      );
    case "builder":
      return (
        <svg {...common}>
          <path d="M4 15a8 8 0 0116 0" />
          <path d="M3 15h18" />
          <path d="M12 15V8" />
        </svg>
      );
    case "secretary":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="17" rx="1.5" />
          <path d="M9 3h6v3H9z" />
          <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
        </svg>
      );
    case "partner":
      return (
        <svg {...common}>
          <circle cx="8.5" cy="10" r="3" />
          <circle cx="15.5" cy="10" r="3" />
          <path d="M4 20c0-2.8 2-5 4.5-5s4.5 2.2 4.5 5M11 20c0-2.8 2-5 4.5-5s4.5 2.2 4.5 5" />
        </svg>
      );
    default:
      return null;
  }
}

function AccountTypeCard({
  type,
  onSelect,
}: {
  type: AccountTypeDef;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-6 text-left transition-all duration-200 hover:border-[#C47A1E] hover:shadow-[0_6px_20px_rgba(196,122,30,0.14)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FDF3E7] transition-colors duration-200 group-hover:bg-[#C47A1E]/15">
        <AccountTypeIcon type={type.icon} />
      </span>
      <span>
        <span className="block text-[16px] font-bold text-[#1C1917]">{type.title}</span>
        <span className="mt-0.5 block text-[13px] text-[#6B7280]">{type.description}</span>
      </span>
    </button>
  );
}

/* ────────────────────────────  Shared step widgets  ──────────────────────────── */

function ProgressHeader({
  title,
  step,
  totalSteps,
}: {
  title: string;
  step: number;
  totalSteps: number;
}) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#C47A1E]">{title}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-[#6B7280]">
          Étape {step}/{totalSteps}
        </span>
        <span className="text-xs font-medium text-[#6B7280]">
          {Math.round((step / totalSteps) * 100)}%
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        <motion.div
          className="h-full rounded-full bg-[#C47A1E]"
          initial={false}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#1C1917]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#6B7280]">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#C47A1E]" : "bg-[#E5E7EB]"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && <span className="text-[#C47A1E]"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface StepProps {
  formData: FormData;
  errors: FormErrors;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

/* ────────────────────────────  Step 1 — Identité  ──────────────────────────── */

function StepIdentity({ formData, errors, set }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Civilité" htmlFor="civility" required error={errors.civility}>
        <select
          id="civility"
          className={selectClass}
          style={selectBgStyle}
          value={formData.civility}
          onChange={(e) => set("civility", e.target.value as FormData["civility"])}
        >
          <option value="">Sélectionnez…</option>
          <option value="M.">M.</option>
          <option value="Mme">Mme</option>
        </select>
      </Field>

      <Field label="CIN / Passeport" htmlFor="cinNumber" required error={errors.cinNumber}>
        <input
          id="cinNumber"
          className={inputClass}
          value={formData.cinNumber}
          onChange={(e) => set("cinNumber", e.target.value)}
          placeholder="AB123456"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom" htmlFor="lastName" required error={errors.lastName}>
          <input
            id="lastName"
            className={inputClass}
            value={formData.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="El Amrani"
          />
        </Field>
        <Field label="Prénom" htmlFor="firstName" required error={errors.firstName}>
          <input
            id="firstName"
            className={inputClass}
            value={formData.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Yasmine"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom en arabe (الاسم العائلي)" htmlFor="lastNameAr" required error={errors.lastNameAr}>
          <input
            id="lastNameAr"
            dir="rtl"
            className={inputClass}
            value={formData.lastNameAr}
            onChange={(e) => set("lastNameAr", e.target.value)}
            placeholder="العمراني"
          />
        </Field>
        <Field label="Prénom en arabe (الاسم الشخصي)" htmlFor="firstNameAr" required error={errors.firstNameAr}>
          <input
            id="firstNameAr"
            dir="rtl"
            className={inputClass}
            value={formData.firstNameAr}
            onChange={(e) => set("firstNameAr", e.target.value)}
            placeholder="ياسمين"
          />
        </Field>
      </div>
    </div>
  );
}

/* ────────────────────────────  Step 2 — Contact  ──────────────────────────── */

function StepContact({
  formData,
  errors,
  set,
  accountType,
}: StepProps & { accountType: AccountTypeDef }) {
  return (
    <div className="space-y-4">
      <Field label="Ville" htmlFor="city" required error={errors.city}>
        <select
          id="city"
          className={selectClass}
          style={selectBgStyle}
          value={formData.city}
          onChange={(e) => set("city", e.target.value)}
        >
          <option value="">Sélectionnez une ville…</option>
          {MOROCCAN_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Field>

      {accountType.needsCroa && (
        <Field label="Conseil régional (CROA)" htmlFor="regionalCouncil" required error={errors.regionalCouncil}>
          <select
            id="regionalCouncil"
            className={selectClass}
            style={selectBgStyle}
            value={formData.regionalCouncil}
            onChange={(e) => set("regionalCouncil", e.target.value)}
          >
            <option value="">Sélectionnez un conseil…</option>
            {CROA_COUNCILS.map((council) => (
              <option key={council} value={council}>
                {council}
              </option>
            ))}
          </select>
        </Field>
      )}

      {!accountType.needsCroa && accountType.needsSpecialty && (
        <Field label="Spécialité" htmlFor="specialty" required error={errors.specialty}>
          <select
            id="specialty"
            className={selectClass}
            style={selectBgStyle}
            value={formData.specialty}
            onChange={(e) => set("specialty", e.target.value)}
          >
            <option value="">Sélectionnez une spécialité…</option>
            {(Object.keys(SPECIALTY_LABELS) as Array<keyof typeof SPECIALTY_LABELS>).map((key) => (
              <option key={key} value={key}>
                {SPECIALTY_LABELS[key]}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Adresse" htmlFor="address" required error={errors.address}>
        <input
          id="address"
          className={inputClass}
          value={formData.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="123 Avenue Mohammed V"
        />
      </Field>

      {accountType.isProfessional && (
        <Field
          label="Numéro d'agrément / d'inscription"
          htmlFor="licenseNumber"
          required
          error={errors.licenseNumber}
        >
          <input
            id="licenseNumber"
            className={inputClass}
            value={formData.licenseNumber}
            onChange={(e) => set("licenseNumber", e.target.value)}
            placeholder="Numéro de licence"
          />
        </Field>
      )}

      <Field label="Email" htmlFor="email" required error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          value={formData.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="vous@exemple.ma"
        />
      </Field>

      <Field label="Téléphone" htmlFor="phone" required error={errors.phone}>
        <div className="flex items-stretch gap-2">
          <span className="flex h-11 items-center rounded-lg border border-gray-200 bg-[#F9FAFB] px-3 text-sm font-medium text-[#374151]">
            +212
          </span>
          <input
            id="phone"
            type="tel"
            className={`${inputClass} flex-1`}
            value={formData.phone}
            onChange={(e) => set("phone", e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="6 00 00 00 00"
          />
        </div>
      </Field>

      <div className="space-y-3 pt-1">
        <Toggle
          checked={formData.organizedAsCompany}
          onChange={(value) => set("organizedAsCompany", value)}
          label="Organisé(e) en société"
          description="Vous exercez votre activité au sein d'une entreprise"
        />
        <Toggle
          checked={formData.saveBilling}
          onChange={(value) => set("saveBilling", value)}
          label="Enregistrer mes informations de facturation"
          description="Utile pour la génération automatique de vos factures"
        />
      </div>
    </div>
  );
}

/* ────────────────────────────  Step 3 — Facturation  ──────────────────────────── */

function StepBilling({ formData, errors, set }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-lg bg-[#F3F4F6] p-1">
        {(["personne_morale", "personne_physique"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => set("billingType", option)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
              formData.billingType === option
                ? "bg-white text-[#C47A1E] shadow-sm"
                : "text-[#6B7280] hover:text-[#1C1917]"
            }`}
          >
            {option === "personne_morale" ? "Personne morale" : "Personne physique"}
          </button>
        ))}
      </div>

      <Field
        label={formData.billingType === "personne_morale" ? "Raison sociale" : "Nom complet"}
        htmlFor="billingName"
        required
        error={errors.billingName}
      >
        <input
          id="billingName"
          className={inputClass}
          value={formData.billingName}
          onChange={(e) => set("billingName", e.target.value)}
        />
      </Field>

      <Field label="Ville" htmlFor="billingCity" required error={errors.billingCity}>
        <select
          id="billingCity"
          className={selectClass}
          style={selectBgStyle}
          value={formData.billingCity}
          onChange={(e) => set("billingCity", e.target.value)}
        >
          <option value="">Sélectionnez une ville…</option>
          {MOROCCAN_CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </Field>

      {formData.billingType === "personne_physique" ? (
        <Field label="CIN" htmlFor="billingCin" required error={errors.billingCin}>
          <input
            id="billingCin"
            className={inputClass}
            value={formData.billingCin}
            onChange={(e) => set("billingCin", e.target.value)}
          />
        </Field>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="ICE" htmlFor="billingIce" required error={errors.billingIce}>
            <input
              id="billingIce"
              className={inputClass}
              value={formData.billingIce}
              onChange={(e) => set("billingIce", e.target.value)}
            />
          </Field>
          <Field label="RC" htmlFor="billingRc" required error={errors.billingRc}>
            <input
              id="billingRc"
              className={inputClass}
              value={formData.billingRc}
              onChange={(e) => set("billingRc", e.target.value)}
            />
          </Field>
        </div>
      )}

      <Field label="Adresse de facturation" htmlFor="billingAddress" required error={errors.billingAddress}>
        <input
          id="billingAddress"
          className={inputClass}
          value={formData.billingAddress}
          onChange={(e) => set("billingAddress", e.target.value)}
        />
      </Field>
    </div>
  );
}

/* ────────────────────────────  Step 4 — Sécurité  ──────────────────────────── */

function StepSecurity({
  formData,
  errors,
  set,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: StepProps & {
  showPassword: boolean;
  setShowPassword: (updater: (value: boolean) => boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (updater: (value: boolean) => boolean) => void;
}) {
  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  return (
    <div className="space-y-4">
      <Field label="Email" htmlFor="email-readonly">
        <input
          id="email-readonly"
          readOnly
          value={formData.email}
          className={`${inputClass} cursor-not-allowed bg-[#F9FAFB] text-[#6B7280]`}
        />
      </Field>

      <Field label="Mot de passe" htmlFor="password" required error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`${inputClass} pr-11`}
            value={formData.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
        {formData.password.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ backgroundColor: n <= strength.score ? strength.color : "#E5E7EB" }}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs" style={{ color: strength.color }}>
              {strength.label}
            </p>
          </div>
        )}
      </Field>

      <Field label="Confirmer le mot de passe" htmlFor="confirmPassword" required error={errors.confirmPassword}>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            className={`${inputClass} pr-11`}
            value={formData.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            <EyeIcon open={showConfirmPassword} />
          </button>
        </div>
      </Field>

      <label className="flex items-start gap-2.5 text-xs leading-normal text-[#6B7280]">
        <input
          type="checkbox"
          checked={formData.acceptedTerms}
          onChange={(e) => set("acceptedTerms", e.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#E5E7EB] accent-[#C47A1E]"
        />
        <span>
          J&apos;accepte les{" "}
          <Link to="/privacy" className="font-medium text-[#C47A1E] hover:underline">
            conditions d&apos;utilisation
          </Link>{" "}
          et la{" "}
          <Link to="/privacy" className="font-medium text-[#C47A1E] hover:underline">
            politique de confidentialité
          </Link>
        </span>
      </label>
      {errors.acceptedTerms && <p className="text-xs text-red-600">{errors.acceptedTerms}</p>}
    </div>
  );
}

/* ────────────────────────────  Main page  ──────────────────────────── */

export function RegisterPage() {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState<AccountTypeId | null>(null);
  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const selectedAccountType = useMemo(
    () => ACCOUNT_TYPES.find((a) => a.id === accountType) ?? null,
    [accountType]
  );

  const totalSteps = formData.saveBilling ? 4 : 3;
  const displayStep = formStep === 4 ? totalSteps : formStep;

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function selectAccountType(id: AccountTypeId) {
    setAccountType(id);
    setFormStep(1);
    setErrors({});
    setServerError(null);
  }

  function goNext() {
    setServerError(null);
    if (formStep === 1) {
      const stepErrors = validateStep1(formData);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length > 0) return;
      setFormStep(2);
    } else if (formStep === 2 && selectedAccountType) {
      const stepErrors = validateStep2(formData, selectedAccountType);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length > 0) return;
      setFormStep(formData.saveBilling ? 3 : 4);
    } else if (formStep === 3) {
      const stepErrors = validateStep3(formData);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length > 0) return;
      setFormStep(4);
    }
  }

  function goBack() {
    setErrors({});
    setServerError(null);
    if (formStep === 1) {
      setAccountType(null);
    } else if (formStep === 2) {
      setFormStep(1);
    } else if (formStep === 3) {
      setFormStep(2);
    } else if (formStep === 4) {
      setFormStep(formData.saveBilling ? 3 : 2);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!selectedAccountType) return;

    const stepErrors = validateStep4(formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    setServerError(null);
    setIsSubmitting(true);
    try {
      const payload: RegisterInput = {
        accountType: selectedAccountType.id,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone ? `+212${formData.phone}` : undefined,
        civility: formData.civility || undefined,
        cinNumber: formData.cinNumber || undefined,
        firstNameAr: formData.firstNameAr || undefined,
        lastNameAr: formData.lastNameAr || undefined,
        city: formData.city || undefined,
        address: formData.address || undefined,
        licenseNumber: selectedAccountType.isProfessional ? formData.licenseNumber || undefined : undefined,
        regionalCouncil: selectedAccountType.needsCroa ? formData.regionalCouncil || undefined : undefined,
        specialty:
          selectedAccountType.needsSpecialty && formData.specialty
            ? (formData.specialty as IntervenantSpecialty)
            : undefined,
      };

      if (formData.saveBilling) {
        payload.billingType = formData.billingType;
        payload.billingName = formData.billingName || undefined;
        payload.billingCity = formData.billingCity || undefined;
        payload.billingAddress = formData.billingAddress || undefined;
        if (formData.billingType === "personne_physique") {
          payload.billingCin = formData.billingCin || undefined;
        } else {
          payload.billingIce = formData.billingIce || undefined;
          payload.billingRc = formData.billingRc || undefined;
        }
      }

      await api.post("/auth/register", payload);
      navigate("/register/success", { state: { email: formData.email } });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.response?.data?.error ?? "Échec de l'inscription."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <RegisterSidePanel />

      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-[#FEFCF8]">
        <div className="mx-auto w-full max-w-[720px] flex-1 px-6 py-10 sm:px-10 lg:px-14">
          <AnimatePresence mode="wait">
            {!selectedAccountType ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h1 className="text-[28px] font-bold text-[#1C1917]">Rejoignez-nous</h1>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Choisissez le type de compte correspondant à votre profil
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ACCOUNT_TYPES.map((type) => (
                    <AccountTypeCard key={type.id} type={type} onSelect={() => selectAccountType(type.id)} />
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 text-center">
                  <p className="text-sm text-[#6B7280]">
                    Avez-vous déjà un compte ?{" "}
                    <Link to="/login" className="font-semibold text-[#C47A1E] hover:underline">
                      Se connecter
                    </Link>
                  </p>
                  <Link to="/" className="text-xs text-[#9CA3AF] hover:text-[#C47A1E]">
                    ← Retour au site
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${formStep}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressHeader title={selectedAccountType.title} step={displayStep} totalSteps={totalSteps} />

                {serverError && (
                  <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
                )}

                {formStep === 4 ? (
                  <form onSubmit={handleSubmit} noValidate>
                    <h2 className="mb-1 text-lg font-bold text-[#1C1917]">Sécurité du compte</h2>
                    <p className="mb-5 text-sm text-[#6B7280]">Choisissez un mot de passe sécurisé</p>
                    <StepSecurity
                      formData={formData}
                      errors={errors}
                      set={set}
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                      showConfirmPassword={showConfirmPassword}
                      setShowConfirmPassword={setShowConfirmPassword}
                    />
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={goBack}
                        className="h-11 flex-1 rounded-lg border border-gray-200 text-sm font-semibold text-[#374151] transition-colors duration-150 hover:bg-gray-50"
                      >
                        Retour
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#C47A1E] text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#A86518] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner />
                            Création...
                          </>
                        ) : (
                          "Créer mon compte"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {formStep === 1 && (
                      <>
                        <h2 className="mb-1 text-lg font-bold text-[#1C1917]">Identité</h2>
                        <p className="mb-5 text-sm text-[#6B7280]">Renseignez vos informations personnelles</p>
                        <StepIdentity formData={formData} errors={errors} set={set} />
                      </>
                    )}
                    {formStep === 2 && (
                      <>
                        <h2 className="mb-1 text-lg font-bold text-[#1C1917]">Contact</h2>
                        <p className="mb-5 text-sm text-[#6B7280]">Comment pouvons-nous vous contacter ?</p>
                        <StepContact formData={formData} errors={errors} set={set} accountType={selectedAccountType} />
                      </>
                    )}
                    {formStep === 3 && (
                      <>
                        <h2 className="mb-1 text-lg font-bold text-[#1C1917]">Facturation</h2>
                        <p className="mb-5 text-sm text-[#6B7280]">Renseignez vos informations de facturation</p>
                        <StepBilling formData={formData} errors={errors} set={set} />
                      </>
                    )}
                    <div className="mt-8 flex gap-3">
                      <button
                        type="button"
                        onClick={goBack}
                        className="h-11 flex-1 rounded-lg border border-gray-200 text-sm font-semibold text-[#374151] transition-colors duration-150 hover:bg-gray-50"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="h-11 flex-1 rounded-lg bg-[#C47A1E] text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#A86518]"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
