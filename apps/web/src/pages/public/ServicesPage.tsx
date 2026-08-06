import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  LightBulbIcon,
  MapIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { Card } from "../../components/ui/Card";
import { SectionTitle } from "../../components/ui/SectionTitle";

const SERVICES = [
  {
    icon: BuildingOffice2Icon,
    title: "Architecture & Conception",
    description:
      "De l'esquisse au dossier d'exécution, nous accompagnons chaque phase de votre projet architectural avec rigueur et créativité.",
    points: ["Études préliminaires", "Plans architecturaux", "Modélisation 3D", "Suivi de conception"],
  },
  {
    icon: MapIcon,
    title: "Urbanisme & Aménagement",
    description:
      "Nos experts en urbanisme conçoivent des espaces harmonieux, durables et conformes aux réglementations marocaines.",
    points: ["Études d'impact", "Planification urbaine", "Lotissements", "Conformité réglementaire"],
  },
  {
    icon: ClipboardDocumentListIcon,
    title: "Gestion de dossiers Rokhas",
    description:
      "Nous gérons l'intégralité de vos démarches administratives pour l'obtention des autorisations de construire.",
    points: ["Constitution dossier", "Suivi Agence Urbaine", "Relances administratives", "Archivage numérique"],
  },
  {
    icon: CurrencyDollarIcon,
    title: "Appels d'offres & Marchés",
    description:
      "Notre plateforme facilite la publication et la gestion des appels d'offres entre maîtres d'ouvrage et intervenants.",
    points: ["Publication AO", "Réception offres", "Comparaison devis", "Attribution marchés"],
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Suivi de chantier",
    description:
      "Un suivi rigoureux de l'avancement des travaux pour garantir le respect des délais, budgets et normes qualité.",
    points: ["Planning travaux", "Rapports de chantier", "Contrôle qualité", "Réception des ouvrages"],
  },
  {
    icon: LightBulbIcon,
    title: "Conseil & Expertise",
    description:
      "Bénéficiez de l'expertise de nos consultants pour optimiser vos investissements immobiliers et architecturaux.",
    points: ["Audit technique", "Optimisation coûts", "Conseil réglementaire", "Due diligence"],
  },
] as const;

const WHY_US = [
  { icon: ShieldCheckIcon, title: "Expertise locale", desc: "Maîtrise des réglementations marocaines" },
  { icon: DocumentCheckIcon, title: "Traçabilité totale", desc: "Chaque action est documentée et horodatée" },
  { icon: BuildingOffice2Icon, title: "Réseau qualifié", desc: "Plus de 50 intervenants partenaires" },
  { icon: LightBulbIcon, title: "Innovation digitale", desc: "Plateforme collaborative de nouvelle génération" },
] as const;

export function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-neutral-900 pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-4 text-sm text-neutral-400">
            <Link to="/" className="hover:text-brand-400">{t("nav.home")}</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-400">{t("nav.services")}</span>
          </nav>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-semibold text-white sm:text-5xl"
          >
            {t("services.title")}
          </motion.h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-400">
            Des prestations complètes pour mener vos projets d'architecture et d'urbanisme de A à Z.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <service.icon className="h-12 w-12 text-brand-500" />
                  <h3 className="mt-4 font-display text-2xl font-semibold">{service.title}</h3>
                  <p className="mt-3 text-neutral-600 leading-relaxed">{service.description}</p>
                  <ul className="mt-4 space-y-2">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Pourquoi nous choisir" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((item) => (
              <Card key={item.title} className="text-center">
                <item.icon className="mx-auto h-10 w-10 text-brand-500" />
                <h3 className="mt-4 font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-500 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Discutons de votre projet
          </h2>
          <p className="mt-3 text-brand-100">
            Notre équipe est à votre disposition pour une consultation personnalisée.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-lg bg-white px-8 py-3 text-sm font-semibold text-brand-600 hover:bg-brand-50"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </>
  );
}
