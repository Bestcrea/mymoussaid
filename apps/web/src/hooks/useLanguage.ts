import { useTranslation } from "react-i18next";

export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function useLanguage() {
  const { i18n } = useTranslation();
  const activeCode = i18n.language?.split("-")[0];
  const currentLang =
    LANGUAGES.find((language) => language.code === activeCode) ?? LANGUAGES[0];

  const changeLanguage = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
    localStorage.setItem("i18n-language", code);
  };

  return { languages: LANGUAGES, currentLang, changeLanguage };
}
