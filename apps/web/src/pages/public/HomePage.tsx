import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowDownIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { Card } from "../../components/ui/Card";
import { SectionContainer } from "../../components/ui/SectionContainer";
import { PlatformSlider } from "../../components/ui/PlatformSlider";
import { RolePlatformSlider } from "../../components/ui/RolePlatformSlider";
import { SectionTitle } from "../../components/ui/SectionTitle";

const STATS = [
  { value: 150, suffix: "+", labelKey: "stats.projects" },
  { value: 12, suffix: "", labelKey: "stats.experience" },
  { value: 200, suffix: "+", labelKey: "stats.clients" },
  { value: 50, suffix: "+", labelKey: "stats.partners" },
] as const;

const SERVICES_PREVIEW = [
  {
    icon: BuildingOffice2Icon,
    titleKey: "services.architecture",
    descKey: "services.architecture_desc",
  },
  {
    icon: MapIcon,
    titleKey: "services.urbanism",
    descKey: "services.urbanism_desc",
  },
  {
    icon: ClipboardDocumentListIcon,
    titleKey: "services.management",
    descKey: "services.management_desc",
  },
] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      {/* HERO */}
      <section className="relative mb-0 flex min-h-[calc(100vh-108px)] items-center justify-center overflow-hidden md:min-h-[calc(100vh-112px)]">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-brand-900/40" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #C47A1E 0%, transparent 50%), radial-gradient(circle at 75% 75%, #C47A1E 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNDNDdBMUUiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />

        <SectionContainer className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block text-brand-400">{t("hero.title1")}</span>
            <span className="mt-2 block text-white">{t("hero.title2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300 sm:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/register"
              className="rounded-lg bg-brand-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              {t("hero.cta_primary")}
            </Link>
            <Link
              to="/services"
              className="rounded-lg border border-white/60 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("hero.cta_secondary")}
            </Link>
          </motion.div>
        </SectionContainer>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ArrowDownIcon className="h-6 w-6" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-white py-20">
        <SectionContainer>
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.labelKey} className="p-8 text-center">
                <p className="font-display text-4xl font-bold text-brand-500 sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-gray-500">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="bg-[#FDF8F0] py-20">
        <SectionContainer>
          <SectionTitle
            title={t("services.title")}
            subtitle={t("services.subtitle")}
          />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {SERVICES_PREVIEW.map((service) => (
              <motion.div key={service.titleKey} variants={itemVariants}>
                <Card
                  hover={false}
                  className="h-full rounded-2xl p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(196,122,30,0.12)]"
                >
                  <service.icon className="mx-auto h-12 w-12 text-brand-500" />
                  <h3 className="mt-4 font-display text-xl font-semibold">
                    {t(service.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500">
                    {t(service.descKey)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex rounded-lg border border-brand-500 px-6 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
            >
              {t("services.see_all")}
            </Link>
          </div>
        </SectionContainer>
      </section>

      <PlatformSlider />

      <RolePlatformSlider />

      {/* CTA */}
      <section className="bg-brand-500 py-20">
        <SectionContainer className="max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-lg text-brand-100">{t("cta.subtitle")}</p>
          <Link
            to="/register"
            className="mt-8 inline-flex rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            {t("cta.button")}
          </Link>
        </SectionContainer>
      </section>
    </>
  );
}
