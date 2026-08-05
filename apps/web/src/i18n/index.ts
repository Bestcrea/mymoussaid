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
    resources: { fr: { translation: fr }, ar: { translation: ar }, en: { translation: en } },
    fallbackLng: "fr",
    supportedLngs: ["fr", "ar", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18n-language",
    },
  });

// Set RTL direction for Arabic
function applyDocumentLanguage(lng: string) {
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
}

i18n.on("languageChanged", applyDocumentLanguage);
applyDocumentLanguage(i18n.language);

export default i18n;
