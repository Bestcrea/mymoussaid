import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateProjectInput, Project, ProjectStage, UpdateProjectStageInput } from "@/shared";
import { api } from "../lib/api";

export interface ProjectMember {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    specialty?: string | null;
  };
}

export interface ProjectDetail extends Project {
  secretary?: Pick<Project["owner"], "id" | "firstName" | "lastName" | "email"> | null;
  members: ProjectMember[];
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get<{ projects: Project[] }>("/projects");
      return data.projects;
    },
  });
}

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: async () => {
      const { data } = await api.get<{ project: ProjectDetail }>(`/projects/${id}`);
      return data.project;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await api.post<{ project: Project }>("/projects", input);
      return data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProjectStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stage,
    }: {
      id: string;
      stage: ProjectStage;
    }) => {
      const body: UpdateProjectStageInput = { stage };
      const { data } = await api.patch<{ project: Project }>(
        `/projects/${id}/stage`,
        body
      );
      return data.project;
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", project.id] });
    },
  });
}

export const STAGE_BADGE_CLASSES: Record<ProjectStage, string> = {
  CONCEPTION: "bg-blue-100 text-blue-800",
  AUTORISATION: "bg-orange-100 text-orange-800",
  APPEL_OFFRES: "bg-violet-100 text-violet-800",
  REALISATION: "bg-yellow-100 text-yellow-800",
  RECEPTION: "bg-green-100 text-green-800",
  CONSTRUCTION: "bg-red-100 text-red-800",
  TERMINE: "bg-neutral-200 text-neutral-700",
};

export const PROJECT_STAGE_ORDER: ProjectStage[] = [
  "CONCEPTION",
  "AUTORISATION",
  "APPEL_OFFRES",
  "REALISATION",
  "RECEPTION",
  "CONSTRUCTION",
  "TERMINE",
];
