import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  useLanguage,
  type LanguageCode,
} from "../../hooks/useLanguage";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { languages, currentLang, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function selectLanguage(code: LanguageCode) {
    await changeLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 bg-transparent px-2 py-1.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:text-brand-500"
      >
        <span>
          {currentLang.flag} {currentLang.label}
        </span>
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg bg-white py-1 shadow-md"
          >
            {languages.map((lang) => {
              const active = lang.code === currentLang.code;
              return (
                <li key={lang.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => void selectLanguage(lang.code)}
                    className={[
                      "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors outline-none",
                      active
                        ? "bg-brand-50 font-medium text-brand-500"
                        : "text-gray-700 hover:bg-brand-50 hover:text-brand-500",
                    ].join(" ")}
                  >
                    <span aria-hidden>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
