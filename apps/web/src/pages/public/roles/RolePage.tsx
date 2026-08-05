import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export interface RolePageProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  ctaText: string;
}

export function RolePage({
  title,
  subtitle,
  description,
  features,
  benefits,
  ctaText,
}: RolePageProps) {
  return (
    <>
      <section className="bg-neutral-900 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-400">Rôles</span>
            <span className="mx-2">/</span>
            <span className="text-white">{title}</span>
          </nav>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-xl text-brand-400">{subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold">Présentation</h2>
              <p className="mt-4 text-neutral-600 leading-relaxed">{description}</p>

              <h3 className="mt-10 font-display text-xl font-semibold">Fonctionnalités</h3>
              <ul className="mt-4 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-neutral-600">
                    <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-brand-50 p-8">
              <h3 className="font-display text-xl font-semibold text-brand-800">Bénéfices</h3>
              <ul className="mt-6 space-y-4">
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="rounded-xl border border-brand-200 bg-white px-5 py-4 text-neutral-700"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                {ctaText}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
