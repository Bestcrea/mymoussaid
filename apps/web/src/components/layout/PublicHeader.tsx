import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "../ui/Logo";
import { useScroll } from "../../contexts/ScrollContext";
import { useLanguage } from "../../hooks/useLanguage";

const SERVICE_LINKS = [
  { to: "/services", label: "Architecture & Conception" },
  { to: "/services", label: "Urbanisme & Aménagement" },
  { to: "/services", label: "Gestion de dossiers Rokhas" },
  { to: "/services", label: "Appels d'offres & Marchés" },
  { to: "/services", label: "Suivi de chantier" },
  { to: "/services", label: "Conseil & Expertise" },
] as const;

const ROLE_LINKS = [
  { to: "/roles/manager", labelKey: "publicRoles.manager" },
  { to: "/roles/intervenant", labelKey: "publicRoles.intervenant" },
  { to: "/roles/secretaire", labelKey: "publicRoles.secretaire" },
  { to: "/roles/chef-projet", labelKey: "publicRoles.chef_projet" },
  { to: "/roles/partenaire", labelKey: "publicRoles.partenaire" },
] as const;

const NAV_LINK_CLASS = ({ isActive }: { isActive: boolean }) =>
  [
    "whitespace-nowrap text-sm font-medium text-gray-700 transition-colors outline-none",
    isActive ? "text-brand-500" : "hover:text-brand-500",
  ].join(" ");

const DROPDOWN_ITEM_CLASS =
  "block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-500";

const MOBILE_ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

function NavDropdown({
  label,
  links,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  links: readonly { to: string; label: string }[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="relative shrink-0"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className="flex items-center gap-0.5 whitespace-nowrap text-sm font-medium text-gray-700 outline-none transition-colors hover:text-brand-500"
      >
        {label}
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-1">
          <div className="min-w-[220px] rounded-lg bg-white py-1 shadow-md">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={DROPDOWN_ITEM_CLASS}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [mobileRolesOpen, setMobileRolesOpen] = useState(false);
  const { topBarVisible } = useScroll();
  const { languages, currentLang, changeLanguage, t } = useLanguage();

  const roleLinks = ROLE_LINKS.map((link) => ({
    to: link.to,
    label: t(link.labelKey),
  }));

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileRolesOpen(false);
  };

  return (
    <>
    <motion.header
      initial={false}
      animate={{ top: topBarVisible ? "var(--topbar-offset)" : "0px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed inset-x-0 h-[72px] border-b border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] [--topbar-offset:36px] md:[--topbar-offset:40px] ${
        mobileOpen ? "z-[201]" : "z-50"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="shrink-0">
          <Logo size="md" variant="light" linkTo="/" />
        </div>

        {/* Navigation — desktop */}
        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex xl:gap-8">
          <NavLink to="/" className={NAV_LINK_CLASS} end>
            {t("nav.home")}
          </NavLink>

          <NavDropdown
            label={t("nav.services")}
            links={SERVICE_LINKS}
            open={servicesOpen}
            onOpen={() => setServicesOpen(true)}
            onClose={() => setServicesOpen(false)}
          />

          <NavDropdown
            label={t("nav.roles")}
            links={roleLinks}
            open={rolesOpen}
            onOpen={() => setRolesOpen(true)}
            onClose={() => setRolesOpen(false)}
          />

          <NavLink to="/contact" className={NAV_LINK_CLASS}>
            {t("nav.contact")}
          </NavLink>

          <NavLink to="/about" className={NAV_LINK_CLASS}>
            {t("nav.about")}
          </NavLink>
        </nav>

        {/* Actions — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="whitespace-nowrap rounded-md border-[1.5px] border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-brand-500 hover:text-brand-500"
          >
            {t("nav.login")}
          </Link>
          <Link
            to="/register"
            className="whitespace-nowrap rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-brand-600"
          >
            {t("nav.register")}
          </Link>
        </div>

        {/* Burger — mobile */}
        <button
          type="button"
          className="relative z-[210] flex h-10 w-10 items-center justify-center rounded-md md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          <span className="relative block h-[18px] w-6">
            <motion.span
              className="absolute left-0 top-0 h-0.5 w-6 rounded-full bg-[#1C1917]"
              animate={{ y: mobileOpen ? 8 : 0, rotate: mobileOpen ? 45 : 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="absolute left-0 top-2 h-0.5 w-6 rounded-full bg-[#1C1917]"
              animate={{ opacity: mobileOpen ? 0 : 1, x: mobileOpen ? 6 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="absolute left-0 top-4 h-0.5 w-6 rounded-full bg-[#1C1917]"
              animate={{ y: mobileOpen ? -8 : 0, rotate: mobileOpen ? -45 : 0 }}
              transition={{ duration: 0.25 }}
            />
          </span>
        </button>
      </div>

    </motion.header>

    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-[190] bg-black/20 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          />
          <motion.div
            className="fixed inset-x-0 top-0 z-[200] max-h-screen overflow-y-auto rounded-b-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.nav
              className="mx-auto max-w-[440px] px-6 pb-6 pt-[116px]"
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              <motion.div variants={MOBILE_ITEM_VARIANTS}>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block border-b border-[#F3F4F6] py-3.5 text-lg font-medium text-[#1C1917] transition-colors hover:text-[#C47A1E]"
                >
                  {t("nav.home")}
                </Link>
              </motion.div>
              <motion.div variants={MOBILE_ITEM_VARIANTS}>
                <Link
                  to="/services"
                  onClick={closeMobileMenu}
                  className="block border-b border-[#F3F4F6] py-3.5 text-lg font-medium text-[#1C1917] transition-colors hover:text-[#C47A1E]"
                >
                  {t("nav.services")}
                </Link>
              </motion.div>
              <motion.div variants={MOBILE_ITEM_VARIANTS}>
                <button
                  type="button"
                  onClick={() => setMobileRolesOpen((value) => !value)}
                  className="flex w-full items-center justify-between border-b border-[#F3F4F6] py-3.5 text-left text-lg font-medium text-[#1C1917] transition-colors hover:text-[#C47A1E]"
                >
                  {t("nav.roles")}
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-200 ${
                      mobileRolesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {mobileRolesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-b border-[#F3F4F6]"
                    >
                      {roleLinks.map((role) => (
                        <Link
                          key={role.to}
                          to={role.to}
                          onClick={closeMobileMenu}
                          className="block py-2 pl-4 text-[15px] text-[#6B7280] transition-colors hover:text-[#C47A1E]"
                        >
                          {role.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div variants={MOBILE_ITEM_VARIANTS}>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="block border-b border-[#F3F4F6] py-3.5 text-lg font-medium text-[#1C1917] transition-colors hover:text-[#C47A1E]"
                >
                  {t("nav.contact")}
                </Link>
              </motion.div>
              <motion.div variants={MOBILE_ITEM_VARIANTS}>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block border-b border-[#F3F4F6] py-3.5 text-lg font-medium text-[#1C1917] transition-colors hover:text-[#C47A1E]"
                >
                  {t("nav.about")}
                </Link>
              </motion.div>

              <motion.div
                variants={MOBILE_ITEM_VARIANTS}
                className="mt-6"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.1em] text-[#9CA3AF]">
                  Langue / اللغة
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((language) => {
                    const active = language.code === currentLang.code;
                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => {
                          void changeLanguage(language.code);
                          closeMobileMenu();
                        }}
                        className={`rounded-lg border-[1.5px] px-4 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "border-[#C47A1E] bg-[#C47A1E] text-white"
                            : "border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]"
                        }`}
                      >
                        {language.flag} {language.code.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                variants={MOBILE_ITEM_VARIANTS}
                className="mt-6 flex flex-col gap-2"
              >
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg border-[1.5px] border-[#C47A1E] px-4 py-3 text-center text-sm font-semibold text-[#C47A1E]"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg bg-[#C47A1E] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  {t("nav.register")}
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
