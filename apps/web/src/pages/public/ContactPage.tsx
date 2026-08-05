import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactForm = z.infer<typeof contactSchema>;

const WEEK_DAYS = [
  { label: "Lundi", open: 9, close: 18, closed: false },
  { label: "Mardi", open: 9, close: 18, closed: false },
  { label: "Mercredi", open: 9, close: 18, closed: false },
  { label: "Jeudi", open: 9, close: 18, closed: false },
  { label: "Vendredi", open: 9, close: 18, closed: false },
  { label: "Samedi", open: 9, close: 13, closed: false },
  { label: "Dimanche", open: null, close: null, closed: true },
] as const;

function formatHour(h: number) {
  return `${h.toString().padStart(2, "0")}h00`;
}

function OpeningHours() {
  const { todayIndex, isOpenNow } = useMemo(() => {
    const now = new Date();
    // JS: 0 = Sunday → map to our array index (Mon=0 … Sun=6)
    const jsDay = now.getDay();
    const todayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const today = WEEK_DAYS[todayIndex]!;
    const minutes = now.getHours() * 60 + now.getMinutes();
    const isOpenNow =
      !today.closed &&
      today.open !== null &&
      today.close !== null &&
      minutes >= today.open * 60 &&
      minutes < today.close * 60;
    return { todayIndex, isOpenNow };
  }, []);

  return (
    <div className="flex items-start gap-4">
      <ClockIcon className="mt-1 h-6 w-6 shrink-0 text-brand-500" />
      <div className="min-w-0 flex-1">
        <h3 className="mb-3 font-semibold text-[#1C1917]">Horaires d&apos;ouverture</h3>
        <div className="rounded-[10px] bg-[#FDF8F0] p-4">
          {WEEK_DAYS.map((day, index) => {
            const isToday = index === todayIndex;
            const isLast = index === WEEK_DAYS.length - 1;
            const isSaturday = index === 5;

            let hoursLabel: string;
            let hoursClass = "text-sm font-medium text-[#1C1917]";
            if (day.closed) {
              hoursLabel = "Fermé";
              hoursClass = "text-sm font-medium text-[#EF4444]";
            } else if (isSaturday) {
              hoursLabel = `${formatHour(day.open!)} - ${formatHour(day.close!)}`;
              hoursClass = "text-sm font-medium text-[#C47A1E]";
            } else {
              hoursLabel = `${formatHour(day.open!)} - ${formatHour(day.close!)}`;
            }

            return (
              <div
                key={day.label}
                className={[
                  "flex items-center justify-between",
                  isToday ? "rounded-md bg-[rgba(196,122,30,0.08)] px-2 py-2.5" : "py-2.5",
                  !isLast && !isToday ? "border-b border-[#E5E7EB]" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className={[
                    "text-sm",
                    isToday ? "font-bold text-[#C47A1E]" : "text-[#374151]",
                  ].join(" ")}
                >
                  {day.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className={hoursClass}>{hoursLabel}</span>
                  {isToday && isOpenNow && (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#22C55E]">
                      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
                      Ouvert maintenant
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center">
          {isOpenNow ? (
            <span className="rounded-full bg-[rgba(34,197,94,0.1)] px-3.5 py-1.5 text-[13px] font-medium text-[#22C55E]">
              ✓ Ouvert maintenant
            </span>
          ) : (
            <span className="rounded-full bg-[rgba(239,68,68,0.1)] px-3.5 py-1.5 text-[13px] font-medium text-[#EF4444]">
              ✗ Fermé actuellement
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [toast, setToast] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ContactForm>();

  function onSubmit(data: ContactForm) {
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        setError(field, { message: issue.message });
      });
      return;
    }

    setToast(true);
    reset();
    setTimeout(() => setToast(false), 4000);
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none";
  const labelClass = "block text-sm font-medium text-neutral-700 mb-1.5";

  return (
    <>
      <section className="bg-neutral-900 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-400">Contact</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-semibold text-white sm:text-5xl"
          >
            Contactez-nous
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            Notre équipe vous répond sous 24 heures ouvrées.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="mb-8">
                <h2 className="mb-2 text-[28px] font-bold text-[#1C1917]">
                  Envoyez-nous un message
                </h2>
                <p className="text-[15px] leading-[1.6] text-[#6B7280]">
                  Notre équipe vous répond dans les 24 heures ouvrées.
                  N&apos;hésitez pas à nous contacter pour tout projet ou question.
                </p>
              </div>
              <div>
                <label className={labelClass}>Nom complet</label>
                <input className={inputClass} {...register("name")} />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" className={inputClass} {...register("email")} />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input type="tel" className={inputClass} {...register("phone")} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Sujet</label>
                <input className={inputClass} {...register("subject")} />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  rows={5}
                  className={inputClass}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brand-500 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                Envoyer le message
              </button>
            </form>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPinIcon className="mt-1 h-6 w-6 text-brand-500" />
                <div>
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-neutral-600">
                    Bureau d&apos;architecture, 2ème étage, Imm N°18, Rue Omar
                    Ibn Al Khattab, Cité Essalam, Khémisset
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <PhoneIcon className="mt-1 h-6 w-6 text-brand-500" />
                <div>
                  <h3 className="font-semibold">Téléphone</h3>
                  <p className="text-neutral-600">+212 5 22 00 00 00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <EnvelopeIcon className="mt-1 h-6 w-6 text-brand-500" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-neutral-600">contact@mymoussaid.ma</p>
                </div>
              </div>
              <OpeningHours />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 bg-[#FDF8F0] pb-20 pt-[60px]">
        <div className="mx-auto max-w-7xl px-12 text-center">
          <h2 className="mb-2 text-[28px] font-bold text-[#1C1917]">
            Nous trouver
          </h2>
          <p className="mb-8 text-[15px] leading-relaxed text-[#6B7280]">
            Bureau d&apos;architecture, 2ème étage, Imm N°18
            <br />
            Rue Omar Ibn Al Khattab, Cité Essalam, Khémisset
          </p>
          <div className="overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <iframe
              title="Localisation MyMoussaid — Khémisset"
              src="https://maps.google.com/maps?q=Khemisset+Maroc+Cite+Essalam+Rue+Omar+Ibn+Al+Khattab&output=embed&z=15"
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://maps.app.goo.gl/UuiVLoLcLvEF5SGT6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-center font-medium text-[#C47A1E] hover:underline"
          >
            📍 Ouvrir dans Google Maps
          </a>
        </div>
      </section>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 rounded-xl bg-neutral-900 px-6 py-4 text-sm text-white shadow-xl"
          >
            ✓ Message envoyé avec succès. Nous vous répondrons rapidement.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
