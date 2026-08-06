export const MOROCCAN_CITIES = [
  "Agadir",
  "Al Hoceima",
  "Beni Mellal",
  "Berkane",
  "Casablanca",
  "El Jadida",
  "Errachidia",
  "Essaouira",
  "Fès",
  "Guelmim",
  "Ifrane",
  "Kénitra",
  "Khémisset",
  "Khouribga",
  "Laâyoune",
  "Larache",
  "Marrakech",
  "Meknès",
  "Mohammedia",
  "Nador",
  "Ouarzazate",
  "Oujda",
  "Rabat",
  "Safi",
  "Salé",
  "Settat",
  "Tanger",
  "Taza",
  "Tétouan",
  "Tiznit",
] as const;

export const CROA_COUNCILS = [
  "CROA Casablanca-Settat",
  "CROA Rabat-Salé-Kénitra",
  "CROA Fès-Meknès",
  "CROA Marrakech-Safi",
  "CROA Tanger-Tétouan-Al Hoceima",
  "CROA Oriental",
  "CROA Souss-Massa",
  "CROA Béni Mellal-Khénifra",
  "CROA Drâa-Tafilalet",
  "CROA Guelmim-Oued Noun",
  "CROA Laâyoune-Sakia El Hamra",
  "CROA Dakhla-Oued Ed-Dahab",
] as const;

export type AccountTypeId =
  | "client"
  | "personne_morale"
  | "architecte"
  | "ingenieur"
  | "intervenant"
  | "entrepreneur"
  | "secretaire"
  | "partenaire";

export const ACCOUNT_TYPES: Array<{
  id: AccountTypeId;
  title: string;
  description: string;
  icon: "client" | "company" | "architect" | "engineer" | "specialist" | "builder" | "secretary" | "partner";
  isProfessional: boolean;
  needsCroa: boolean;
  needsSpecialty: boolean;
}> = [
  {
    id: "client",
    title: "Client",
    description: "Maître d'ouvrage",
    icon: "client",
    isProfessional: false,
    needsCroa: false,
    needsSpecialty: false,
  },
  {
    id: "personne_morale",
    title: "Personne morale",
    description: "Entreprise / Société",
    icon: "company",
    isProfessional: false,
    needsCroa: false,
    needsSpecialty: false,
  },
  {
    id: "architecte",
    title: "Architecte",
    description: "Ordre régional CROA",
    icon: "architect",
    isProfessional: true,
    needsCroa: true,
    needsSpecialty: false,
  },
  {
    id: "ingenieur",
    title: "Ingénieur",
    description: "Géomètre topographe",
    icon: "engineer",
    isProfessional: true,
    needsCroa: false,
    needsSpecialty: true,
  },
  {
    id: "intervenant",
    title: "Intervenant",
    description: "Spécialiste BTP",
    icon: "specialist",
    isProfessional: true,
    needsCroa: false,
    needsSpecialty: true,
  },
  {
    id: "entrepreneur",
    title: "Entrepreneur",
    description: "Construction",
    icon: "builder",
    isProfessional: true,
    needsCroa: false,
    needsSpecialty: true,
  },
  {
    id: "secretaire",
    title: "Secrétaire",
    description: "Mandataire admin",
    icon: "secretary",
    isProfessional: false,
    needsCroa: false,
    needsSpecialty: false,
  },
  {
    id: "partenaire",
    title: "Partenaire",
    description: "Bureau d'études",
    icon: "partner",
    isProfessional: true,
    needsCroa: false,
    needsSpecialty: true,
  },
];
