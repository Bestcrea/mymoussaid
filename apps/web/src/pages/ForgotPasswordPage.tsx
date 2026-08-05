import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AuthLoginPanel,
  AuthShell,
  Spinner,
  authInputClass,
  authLabelClass,
} from "../components/layout/AuthShell";
import { Logo } from "../components/ui/Logo";

type ForgotForm = { email: string };

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>();

  async function onSubmit(_values: ForgotForm) {
    // UI-only for now — no backend endpoint wired
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
  }

  return (
    <AuthShell panel={<AuthLoginPanel />}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex min-h-[calc(100vh-4rem)] flex-col justify-center bg-white px-6 py-10 md:px-12"
      >
        <div className="mb-6 flex justify-center lg:hidden">
          <Logo size="md" variant="light" linkTo="/" />
        </div>

        <div className="mb-10">
          <h1 className="text-[32px] font-bold leading-tight text-[#1C1917]">
            Mot de passe oublié ?
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#6B7280]">
            Entrez votre email, nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[10px] border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800"
          >
            ✓ Si un compte existe pour cet email, un lien de réinitialisation a
            été envoyé. Vérifiez votre boîte de réception.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className={authLabelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={authInputClass}
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
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#C47A1E] px-4 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#A3611A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Envoi...
                </>
              ) : (
                "Envoyer le lien"
              )}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="mt-8 text-center text-sm font-medium text-[#C47A1E] hover:underline"
        >
          ← Retour à la connexion
        </Link>
      </motion.div>
    </AuthShell>
  );
}
