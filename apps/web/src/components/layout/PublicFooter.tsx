import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Logo } from "../ui/Logo";
import { useLanguage, type LanguageCode } from "../../hooks/useLanguage";

const NAV_LINKS = [
  { to: "/", labelKey: "nav.home" },
  { to: "/services", labelKey: "nav.services" },
  { to: "/about", labelKey: "nav.about" },
  { to: "/contact", labelKey: "nav.contact" },
] as const;

const ROLE_LINKS = [
  { to: "/roles/manager", labelKey: "publicRoles.manager" },
  { to: "/roles/intervenant", labelKey: "publicRoles.intervenant" },
  { to: "/roles/secretaire", labelKey: "publicRoles.secretaire" },
  { to: "/roles/chef-projet", labelKey: "publicRoles.chef_projet" },
  { to: "/roles/partenaire", labelKey: "publicRoles.partenaire" },
] as const;

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C47A1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C47A1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C47A1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C47A1E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon /> },
  { label: "Facebook", href: "#", icon: <FacebookIcon /> },
] as const;

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-[#9CA3AF]">
      <span className="mt-0.5 min-w-4 shrink-0">{icon}</span>
      <span>{children}</span>
    </li>
  );
}

function FooterGlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

function FooterLanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { languages, currentLang, changeLanguage } = useLanguage();

  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const selectLanguage = (code: LanguageCode) => {
    void changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 text-[13px] text-[#9CA3AF] transition-colors hover:text-[#C47A1E]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <FooterGlobeIcon />
        <span>{currentLang.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute bottom-full right-0 z-[100] mb-2 min-w-[150px] overflow-hidden rounded-lg border border-white/10 bg-[#2d2521] py-1 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          {languages.map((language) => {
            const active = language.code === currentLang.code;
            return (
              <button
                key={language.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => selectLanguage(language.code)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-[13px] transition-colors ${
                  active
                    ? "font-medium text-[#C47A1E]"
                    : "text-white/80 hover:bg-[rgba(196,122,30,0.15)] hover:text-[#C47A1E]"
                }`}
              >
                <span aria-hidden>{language.flag}</span>
                <span>{language.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PublicFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="inline-block rounded-lg bg-white/[0.05] p-2">
              <Logo size="lg" variant="dark" linkTo="/" />
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-[#9CA3AF]">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-colors duration-200 hover:border-[#C47A1E] hover:bg-[#C47A1E]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.nav_title")}
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 transition-colors hover:text-brand-400"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.roles_title")}
            </h3>
            <ul className="space-y-2">
              {ROLE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-neutral-400 transition-colors hover:text-brand-400"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t("footer.contact_title")}
            </h3>
            <ul className="space-y-3">
              <ContactRow icon={<MapPinIcon />}>
                {t("topbar.address")}
              </ContactRow>
              <ContactRow icon={<PhoneIcon />}>{t("topbar.phone")}</ContactRow>
              <ContactRow icon={<MailIcon />}>
                <a
                  href="mailto:contact@mymoussaid.ma"
                  className="transition-colors hover:text-brand-400"
                >
                  contact@mymoussaid.ma
                </a>
              </ContactRow>
              <ContactRow icon={<ClockIcon />}>{t("footer.hours")}</ContactRow>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-brand-500/40 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-neutral-500">
              © 2026 MyMoussaid. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-5">
              <FooterLanguageSwitcher />
              <Link
                to="/privacy"
                className="text-sm text-neutral-400 transition-colors hover:text-brand-400"
              >
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
