import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import type { LoginInput } from "@/shared";
import { api } from "../lib/api";
import { connectSocket } from "../lib/socket";
import { useAuthStore } from "../store/authStore";
import {
  AuthLoginPanel,
  AuthShell,
  EyeIcon,
  GoogleIcon,
  Spinner,
  authInputClass,
  authLabelClass,
} from "../components/layout/AuthShell";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    try {
      const { data } = await api.post("/auth/login", values);
      setAuth(data.user, data.accessToken, data.refreshToken);
      connectSocket();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Échec de la connexion."
        : "Une erreur inattendue est survenue.";
      setServerError(message);
    }
  }

  return (
    <AuthShell panel={<AuthLoginPanel />}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="my-auto flex w-full max-w-[400px] flex-col bg-white px-6 py-8"
      >
        <div className="mb-7">
          <h1 className="mb-2 text-[26px] font-bold leading-tight text-[#1C1917]">
            Bon retour 👋
          </h1>
          <p className="text-sm text-[#6B7280]">
            Connectez-vous à votre espace professionnel
          </p>
        </div>

        {serverError && (
          <div className="mb-5 rounded-[10px] bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className={authLabelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`${authInputClass} !h-11 !rounded-lg !px-3.5 !text-sm`}
              placeholder="vous@exemple.ma"
              {...register("email", { required: "L'email est requis" })}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
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
                autoComplete="current-password"
                className={`${authInputClass} !h-11 !rounded-lg !px-3.5 !pr-12 !text-sm`}
                placeholder="••••••••"
                {...register("password", { required: "Le mot de passe est requis" })}
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
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Link
            to="/forgot-password"
            className="mb-2 mt-2 block text-right text-[13px] text-[#C47A1E] hover:underline"
          >
            Mot de passe oublié ?
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#C47A1E] px-4 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#A3611A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E5E7EB]" />
          <span className="text-[13px] text-[#9CA3AF]">ou continuez avec</span>
          <div className="h-px flex-1 bg-[#E5E7EB]" />
        </div>

        <button
          type="button"
          disabled
          className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-[#E5E7EB] bg-white px-4 text-sm text-[#374151] opacity-70 transition-all duration-200 hover:border-[#D1D5DB] hover:bg-[#F9FAFB]"
        >
          <GoogleIcon />
          Continuer avec Google
        </button>

        <p className="mt-4 text-center text-sm text-[#6B7280]">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold text-[#C47A1E] hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
