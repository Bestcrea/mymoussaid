import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import type { DocumentCategory } from "@ma/shared";
import { DOCUMENT_CATEGORY_LABELS } from "@ma/shared";
import { useProjects } from "../hooks/useProjects";
import {
  DOCUMENT_ICON_CLASSES,
  DOCUMENT_ICON_SYMBOLS,
  formatFileSize,
  getDocumentIconType,
  useDeleteDocument,
  useDocuments,
  useUploadDocument,
} from "../hooks/useDocuments";

const CATEGORIES = Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[];

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DocumentsPage() {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "ALL">(
    "ALL"
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const projectId = selectedProjectId || projects[0]?.id;
  const { data: documents = [], isLoading: documentsLoading } =
    useDocuments(projectId);
  const uploadDocument = useUploadDocument(projectId);
  const deleteDocument = useDeleteDocument();

  const filteredDocuments = useMemo(() => {
    if (categoryFilter === "ALL") return documents;
    return documents.filter((doc) => doc.category === categoryFilter);
  }, [documents, categoryFilter]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    setUploadError(null);
    try {
      await uploadDocument.mutateAsync({ file });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? t("documents.uploadError")
        : t("common.error");
      setUploadError(message);
    } finally {
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!projectId) return;
    if (!window.confirm(t("documents.deleteConfirm"))) return;

    try {
      await deleteDocument.mutateAsync({ id, projectId });
    } catch {
      window.alert(t("common.error"));
    }
  }

  function handleDownload(doc: { id: string; url?: string }) {
    if (doc.url) {
      window.open(doc.url, "_blank", "noopener,noreferrer");
      return;
    }
    window.open(`/api/v1/documents/${doc.id}/download`, "_blank");
  }

  const selectClass =
    "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          {t("documents.title")}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={projectId ?? ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className={selectClass}
            disabled={projectsLoading || projects.length === 0}
          >
            {projects.length === 0 ? (
              <option value="">{t("documents.noProject")}</option>
            ) : (
              projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))
            )}
          </select>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!projectId || uploadDocument.isPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {uploadDocument.isPending
              ? t("documents.uploading")
              : t("documents.upload")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.zip"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {uploadError}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-neutral-600">
          {t("documents.filterCategory")} :
        </span>
        <button
          type="button"
          onClick={() => setCategoryFilter("ALL")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            categoryFilter === "ALL"
              ? "bg-brand-600 text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {t("documents.allCategories")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              categoryFilter === cat
                ? "bg-brand-600 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {t(`documentCategories.${cat}`)}
          </button>
        ))}
      </div>

      {projectsLoading || documentsLoading ? (
        <p className="text-sm text-neutral-500">{t("common.loading")}</p>
      ) : !projectId ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">{t("documents.noProject")}</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">{t("documents.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const iconType = getDocumentIconType(doc.mimeType);
            return (
              <div
                key={doc.id}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${DOCUMENT_ICON_CLASSES[iconType]}`}
                  >
                    {DOCUMENT_ICON_SYMBOLS[iconType]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {doc.name}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {formatFileSize(doc.size)}
                    </p>
                    <span className="mt-2 inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                      {t(`documentCategories.${doc.category}`)}
                    </span>
                    <p className="mt-2 text-xs text-neutral-400">
                      {formatDate(doc.createdAt, i18n.language)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(doc)}
                    className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    {t("documents.download")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteDocument.isPending}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
