import { z } from "zod";

export const registerSchema = z.object({
  email:     z.string().email("Email invalide"),
  password:  z.string().min(8, "Minimum 8 caractères"),
  firstName: z.string().min(2, "Prénom requis"),
  lastName:  z.string().min(2, "Nom requis"),
  phone:     z.string().optional(),
  role:      z.enum(["CLIENT", "INTERVENANT", "SECRETAIRE"]),
  specialty: z.enum([
    "INGENIEUR_CIVIL","INGENIEUR_ENERGIE","INGENIEUR_STRUCTURE",
    "INGENIEUR_ENVIRONNEMENT","NOTAIRE","TOPOGRAPHE","ARCHITECTE",
    "PLOMBERIE","MENUISERIE","ELECTRICITE","PEINTURE",
    "TERRASSEMENT","BUREAU_CONTROLE","AUTRE",
  ]).optional(),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const createProjectSchema = z.object({
  title:       z.string().min(3, "Titre requis"),
  description: z.string().optional(),
  city:        z.string().optional(),
  address:     z.string().optional(),
  startDate:   z.string().datetime().optional(),
  endDate:     z.string().datetime().optional(),
});

export const updateProjectStageSchema = z.object({
  stage: z.enum([
    "CONCEPTION",
    "AUTORISATION",
    "APPEL_OFFRES",
    "REALISATION",
    "RECEPTION",
    "CONSTRUCTION",
    "TERMINE",
  ]),
});

export const createBidSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  task:        z.string().min(3),
  specialty:   z.string().optional(),
  deadline:    z.string().datetime().optional(),
  budget:      z.number().positive().optional(),
});

export const submitOfferSchema = z.object({
  content:  z.string().min(10, "Décrivez votre offre"),
  price:    z.number().positive().optional(),
  timeline: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message requis").max(5000),
});

export const uploadDocumentSchema = z.object({
  category: z
    .enum([
      "PLAN",
      "PERMIS",
      "RAPPORT",
      "CAHIER_CHARGES",
      "DEVIS",
      "APPEL_OFFRES",
      "FACTURE",
      "CONTRAT",
      "AUTRE",
    ])
    .optional()
    .default("AUTRE"),
  description: z.string().optional(),
});

export type RegisterInput  = z.infer<typeof registerSchema>;
export type LoginInput     = z.infer<typeof loginSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectStageInput = z.infer<typeof updateProjectStageSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>;
export type SubmitOfferInput = z.infer<typeof submitOfferSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
