import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage, type LanguageCode } from "../../hooks/useLanguage";
import { useScroll } from "../../contexts/ScrollContext";

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
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

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
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

function ChevronIcon({ open }: { open: boolean }) {
  return (
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
  );
}

function LanguageSwitcherTopBar() {
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
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 text-xs text-white/80 transition-colors duration-200 hover:text-[#C47A1E]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <GlobeIcon />
        <span>{currentLang.label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-[100] mt-1 min-w-[150px] overflow-hidden rounded-lg border border-white/10 bg-[#2d2521] py-1 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
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

export function TopBar() {
  const { topBarVisible } = useScroll();

  return (
    <motion.div
      initial={false}
      animate={{
        height: topBarVisible ? "var(--topbar-height)" : "0px",
        opacity: topBarVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: topBarVisible ? "visible" : "hidden" }}
      className="fixed inset-x-0 top-0 z-[51] w-full bg-[#1C1917] [--topbar-height:36px] md:[--topbar-height:40px]"
    >
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 md:h-10 md:px-12">
        <div className="flex items-center gap-6">
          <a
            href="tel:+212522000000"
            className="flex items-center gap-1.5 text-xs text-white/80 transition-colors duration-200 hover:text-[#C47A1E]"
          >
            <PhoneIcon />
            <span>+212 5 22 00 00 00</span>
          </a>

          <span className="hidden h-4 w-px bg-white/20 md:block" aria-hidden />

          <a
            href="https://maps.app.goo.gl/UuiVLoLcLvEF5SGT6"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-xs text-white/80 transition-colors duration-200 hover:text-[#C47A1E] md:flex"
          >
            <MapPinIcon />
            <span>Rue Omar Ibn Al Khattab, Khémisset</span>
          </a>
        </div>

        <LanguageSwitcherTopBar />
      </div>
    </motion.div>
  );
}
