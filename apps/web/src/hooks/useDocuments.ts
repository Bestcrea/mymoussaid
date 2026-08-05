import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document, DocumentCategory } from "@/shared";
import { api } from "../lib/api";

export function useDocuments(projectId: string | undefined) {
  return useQuery({
    queryKey: ["documents", projectId],
    queryFn: async () => {
      const { data } = await api.get<{ documents: Document[] }>(
        `/projects/${projectId}/documents`
      );
      return data.documents;
    },
    enabled: Boolean(projectId),
  });
}

export function useUploadDocument(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      category = "AUTRE",
    }: {
      file: File;
      category?: DocumentCategory;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);

      const { data } = await api.post<{ document: Document }>(
        `/projects/${projectId}/documents`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return data.document;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
    }: {
      id: string;
      projectId: string;
    }) => {
      await api.delete(`/documents/${id}`);
      return { id, projectId };
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
    },
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export type DocumentIconType = "pdf" | "image" | "word" | "excel" | "zip" | "other";

export function getDocumentIconType(mimeType: string): DocumentIconType {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "word";
  }
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "excel";
  }
  if (mimeType === "application/zip") return "zip";
  return "other";
}

export const DOCUMENT_ICON_CLASSES: Record<DocumentIconType, string> = {
  pdf: "bg-red-100 text-red-600",
  image: "bg-blue-100 text-blue-600",
  word: "bg-indigo-100 text-indigo-700",
  excel: "bg-green-100 text-green-600",
  zip: "bg-yellow-100 text-yellow-700",
  other: "bg-neutral-100 text-neutral-600",
};

export const DOCUMENT_ICON_SYMBOLS: Record<DocumentIconType, string> = {
  pdf: "PDF",
  image: "IMG",
  word: "DOC",
  excel: "XLS",
  zip: "ZIP",
  other: "FILE",
};
