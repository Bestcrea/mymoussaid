import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  HeartIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Card } from "../../components/ui/Card";

const VALUES = [
  { icon: LightBulbIcon, title: "Innovation", desc: "Des solutions architecturales avant-gardistes" },
  { icon: ShieldCheckIcon, title: "Excellence", desc: "Un engagement qualité à chaque étape" },
  { icon: HeartIcon, title: "Passion", desc: "L'architecture comme art de vivre" },
  { icon: UserGroupIcon, title: "Collaboration", desc: "Le travail d'équipe au cœur de nos projets" },
] as const;

const PARTNERS = [
  "Agence Urbaine de Casablanca",
  "Ordre des Architectes du Maroc",
  "Fédération Nationale du Bâtiment",
  "Ministère de l'Aménagement",
] as const;

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-neutral-900 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-400">{t("nav.home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-400">{t("nav.about")}</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-semibold text-white sm:text-5xl"
          >
            À propos de MyMoussaid
          </motion.h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold">Notre histoire</h2>
              <p className="mt-4 text-neutral-600 leading-relaxed">
                Fondé en 2014 à Casablanca, MyMoussaid est né de la volonté de moderniser
                la gestion des projets architecturaux au Maroc. Notre cabinet combine l'expertise
                traditionnelle de l'architecture marocaine avec les outils numériques les plus
                avancés.
              </p>
              <p className="mt-4 text-neutral-600 leading-relaxed">
                Aujourd'hui, nous accompagnons plus de 200 clients et coordonnons un réseau de
                50 intervenants qualifiés à travers tout le royaume.
              </p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-8">
              <h3 className="font-display text-xl font-semibold text-brand-800">Vision</h3>
              <p className="mt-3 text-neutral-700">
                Devenir la référence en architecture et urbanisme digitale au Maroc et en Afrique du Nord.
              </p>
              <h3 className="mt-8 font-display text-xl font-semibold text-brand-800">Mission</h3>
              <p className="mt-3 text-neutral-700">
                Simplifier et professionnaliser la gestion des projets architecturaux grâce à une
                plateforme collaborative innovante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Nos valeurs" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title} className="text-center">
                <value.icon className="mx-auto h-10 w-10 text-brand-500" />
                <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-900 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Certifications & Partenaires"
            subtitle="Reconnus par les institutions majeures du secteur"
            light
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNERS.map((partner) => (
              <div
                key={partner}
                className="rounded-xl border border-neutral-700 px-5 py-6 text-center text-sm text-neutral-300"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
