import { useTranslation } from "react-i18next";

export const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "en", label: "English", flag: "🇬🇧" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const activeCode = (i18n.language?.split("-")[0] ?? "fr") as LanguageCode;
  const currentLang =
    LANGUAGES.find((language) => language.code === activeCode) ?? LANGUAGES[0]!;

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
    localStorage.setItem("i18nextLng", code);
    localStorage.removeItem("i18n-language");
  };

  return { languages: LANGUAGES, currentLang, changeLanguage, t, i18n };
}
