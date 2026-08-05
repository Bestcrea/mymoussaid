export type UserRole = "CLIENT" | "INTERVENANT" | "SECRETAIRE" | "ADMIN";

export type ProjectStage =
  | "CONCEPTION"
  | "AUTORISATION"
  | "APPEL_OFFRES"
  | "REALISATION"
  | "RECEPTION"
  | "CONSTRUCTION"
  | "TERMINE";

export type DocumentCategory =
  | "PLAN" | "PERMIS" | "RAPPORT" | "CAHIER_CHARGES"
  | "DEVIS" | "APPEL_OFFRES" | "FACTURE" | "CONTRAT" | "AUTRE";

export type BidStatus = "OUVERTE" | "EN_COURS" | "CLOTUREE" | "ANNULEE";
export type OfferStatus = "SOUMISE" | "EN_EVALUATION" | "ACCEPTEE" | "REFUSEE";

export type IntervenantSpecialty =
  | "INGENIEUR_CIVIL" | "INGENIEUR_ENERGIE" | "INGENIEUR_STRUCTURE"
  | "INGENIEUR_ENVIRONNEMENT" | "NOTAIRE" | "TOPOGRAPHE" | "ARCHITECTE"
  | "PLOMBERIE" | "MENUISERIE" | "ELECTRICITE" | "PEINTURE"
  | "TERRASSEMENT" | "BUREAU_CONTROLE" | "AUTRE";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  specialty?: IntervenantSpecialty;
  isVerified: boolean;
  city?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  dossierNumber: string;
  title: string;
  description?: string;
  stage: ProjectStage;
  city?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  owner: Pick<User, "id" | "firstName" | "lastName" | "email">;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  category: DocumentCategory;
  mimeType: string;
  size: number;
  version: number;
  url?: string;
  projectId: string;
  uploadedBy: Pick<User, "id" | "firstName" | "lastName">;
  createdAt: string;
}

export interface Bid {
  id: string;
  title: string;
  description: string;
  task: string;
  specialty?: IntervenantSpecialty;
  status: BidStatus;
  deadline?: string;
  budget?: number;
  projectId: string;
  offersCount: number;
  createdAt: string;
}

export interface Message {
  id: string;
  content: string;
  projectId: string;
  sender: Pick<User, "id" | "firstName" | "lastName">;
  createdAt: string;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
