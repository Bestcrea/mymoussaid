import type { ProjectStage, UserRole, IntervenantSpecialty, DocumentCategory } from "./types";

export const PROJECT_STAGES: Record<ProjectStage, { label: string; labelAr: string; order: number }> = {
  CONCEPTION:   { label: "Conception",    labelAr: "التصميم",        order: 1 },
  AUTORISATION: { label: "Autorisation",  labelAr: "الترخيص",        order: 2 },
  APPEL_OFFRES: { label: "Appels d'offres", labelAr: "طلبات العروض", order: 3 },
  REALISATION:  { label: "Réalisation",   labelAr: "الإنجاز",        order: 4 },
  RECEPTION:    { label: "Réception",     labelAr: "الاستلام",       order: 5 },
  CONSTRUCTION: { label: "Construction",  labelAr: "البناء",         order: 6 },
  TERMINE:      { label: "Terminé",       labelAr: "منتهي",          order: 7 },
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  CLIENT:       "Maître d'ouvrage",
  INTERVENANT:  "Intervenant",
  SECRETAIRE:   "Secrétaire / Mandataire",
  ADMIN:        "Administrateur",
};

export const SPECIALTY_LABELS: Record<IntervenantSpecialty, string> = {
  INGENIEUR_CIVIL:        "Ingénieur génie civil",
  INGENIEUR_ENERGIE:      "Ingénieur énergie",
  INGENIEUR_STRUCTURE:    "Ingénieur structure",
  INGENIEUR_ENVIRONNEMENT:"Ingénieur environnement",
  NOTAIRE:                "Notaire",
  TOPOGRAPHE:             "Topographe",
  ARCHITECTE:             "Architecte",
  PLOMBERIE:              "Plomberie",
  MENUISERIE:             "Menuiserie",
  ELECTRICITE:            "Électricité",
  PEINTURE:               "Peinture",
  TERRASSEMENT:           "Terrassement",
  BUREAU_CONTROLE:        "Bureau de contrôle",
  AUTRE:                  "Autre",
};

export const SUPPORTED_LOCALES = ["fr", "ar", "en"] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const MAX_FILE_SIZE_MB = 50;
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg", "image/png", "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  PLAN: "Plan",
  PERMIS: "Permis",
  RAPPORT: "Rapport",
  CAHIER_CHARGES: "Cahier des charges",
  DEVIS: "Devis",
  APPEL_OFFRES: "Appel d'offres",
  FACTURE: "Facture",
  CONTRAT: "Contrat",
  AUTRE: "Autre",
};
