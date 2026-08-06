import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: "fr",
    supportedLngs: ["fr", "ar", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

i18n.on("languageChanged", (lng) => {
  const code = lng.split("-")[0] ?? lng;
  document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = code;
});

// Apply on first load
{
  const code = (i18n.language ?? "fr").split("-")[0] ?? "fr";
  document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = code;
}

export default i18n;
