import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import type { RegisterInput } from "@ma/shared";
import { SPECIALTY_LABELS, USER_ROLE_LABELS } from "@ma/shared";
import { api } from "../lib/api";
import { connectSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import {
  AuthRegisterPanel,
  AuthShell,
  EyeIcon,
  Spinner,
  authInputClass,
  authLabelClass,
  authSelectClass,
  authSelectStyle,
} from "../components/layout/AuthShell";

const REGISTRABLE_ROLES: Array<RegisterInput["role"]> = [
  "CLIENT",
  "INTERVENANT",
  "SECRETAIRE",
];

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

const STEPPER = ["Informations", "Rôle", "Confirmation"] as const;
const registerInputClass = `${authInputClass} !h-[42px] !rounded-lg !text-sm`;
const registerSelectClass = `${authSelectClass} !h-[42px] !rounded-lg !text-sm`;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ defaultValues: { role: "CLIENT" } });

  const selectedRole = watch("role");
  const passwordValue = watch("password") ?? "";
  const strength = useMemo(() => getPasswordStrength(passwordValue), [passwordValue]);

  async function onSubmit(values: RegisterInput) {
    if (!acceptedTerms) {
      setServerError("Vous devez accepter les conditions d'utilisation.");
      return;
    }
    setServerError(null);
    const payload: RegisterInput = { ...values };
    if (payload.role !== "INTERVENANT") {
      delete payload.specialty;
    }
    try {
      const { data } = await api.post("/auth/register", payload);
      setAuth(data.user, data.accessToken, data.refreshToken);
      connectSocket();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Échec de l'inscription."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    }
  }

  return (
    <AuthShell panel={<AuthRegisterPanel />}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="my-auto w-full max-w-[440px] bg-white px-6 py-6"
      >
          <div className="mb-5 text-center">
            <h1 className="mb-1.5 text-[22px] font-bold text-[#1C1917]">
              Créer votre compte
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Rejoignez la plateforme de référence en architecture au Maroc
            </p>
          </div>

          <div className="mb-5 bg-transparent">
            <div className="flex items-center justify-between">
              {STEPPER.map((step, i) => (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ${
                        i === 0
                          ? "bg-[#C47A1E] text-white"
                          : "bg-[#E5E7EB] text-[#9CA3AF]"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span
                      className={`mt-1.5 hidden text-[11px] sm:block ${
                        i === 0 ? "font-medium text-[#C47A1E]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPPER.length - 1 && (
                    <div
                      className={`mx-2 h-px flex-1 ${
                        i === 0 ? "bg-[#C47A1E]/40" : "bg-[#E5E7EB]"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-[#9CA3AF]">
              Étape 1 sur 1
            </p>
          </div>

          {serverError && (
            <div className="mb-5 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            noValidate
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="firstName" className={authLabelClass}>
                  Prénom
                </label>
                <input
                  id="firstName"
                  className={registerInputClass}
                  placeholder="Yasmine"
                  {...register("firstName", {
                    required: "Le prénom est requis",
                    minLength: { value: 2, message: "Minimum 2 caractères" },
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className={authLabelClass}>
                  Nom
                </label>
                <input
                  id="lastName"
                  className={registerInputClass}
                  placeholder="El Amrani"
                  {...register("lastName", {
                    required: "Le nom est requis",
                    minLength: { value: 2, message: "Minimum 2 caractères" },
                  })}
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className={authLabelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={registerInputClass}
                placeholder="vous@exemple.ma"
                {...register("email", {
                  required: "L'email est requis",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email invalide",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={authLabelClass}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={`${registerInputClass} pr-12`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Le mot de passe est requis",
                    minLength: { value: 8, message: "Minimum 8 caractères" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {passwordValue.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]"
                        style={{
                          backgroundColor:
                            n <= strength.score ? strength.color : "#E5E7EB",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="mt-1.5 text-xs"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={authLabelClass}>
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={registerInputClass}
                placeholder="+212 6 00 00 00 00"
                {...register("phone")}
              />
            </div>

            <div>
              <label htmlFor="role" className={authLabelClass}>
                Rôle
              </label>
              <select
                id="role"
                className={registerSelectClass}
                style={authSelectStyle}
                {...register("role", { required: "Le rôle est requis" })}
              >
                {REGISTRABLE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {USER_ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>

            <AnimatePresence>
              {selectedRole === "INTERVENANT" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <label htmlFor="specialty" className={authLabelClass}>
                    Spécialité
                  </label>
                  <select
                    id="specialty"
                    className={registerSelectClass}
                    style={authSelectStyle}
                    {...register("specialty", {
                      required:
                        selectedRole === "INTERVENANT"
                          ? "La spécialité est requise"
                          : false,
                    })}
                  >
                    <option value="">Sélectionnez une spécialité…</option>
                    {(
                      Object.keys(SPECIALTY_LABELS) as Array<
                        keyof typeof SPECIALTY_LABELS
                      >
                    ).map((key) => (
                      <option key={key} value={key}>
                        {SPECIALTY_LABELS[key]}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.specialty.message}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <label className="flex items-start gap-2.5 text-xs leading-normal text-[#6B7280]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-[#E5E7EB] accent-[#C47A1E]"
              />
              <span>
                J&apos;accepte les{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-[#C47A1E] hover:underline"
                >
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-[#C47A1E] hover:underline"
                >
                  politique de confidentialité
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="!mt-4 flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C47A1E] px-4 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#A3611A] disabled:cursor-not-allowed disabled:opacity-60"
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
          </form>

          <p className="mt-4 text-center text-sm text-[#6B7280]">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#C47A1E] hover:underline"
            >
              Se connecter
            </Link>
          </p>
      </motion.div>
    </AuthShell>
  );
}
