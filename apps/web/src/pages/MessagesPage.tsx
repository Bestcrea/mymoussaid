import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useProjects } from "../hooks/useProjects";
import {
  useMessages,
  useRealtimeMessages,
  useSendMessage,
  type MessageItem,
} from "../hooks/useMessages";
import { useMessageStore } from "../store/messageStore";
import { connectSocket } from "../lib/socket";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  isMine,
}: {
  message: MessageItem;
  isMine: boolean;
}) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
          isMine
            ? "bg-brand-500 text-white rounded-br-md"
            : "bg-neutral-100 text-neutral-900 rounded-bl-md",
        ].join(" ")}
      >
        {!isMine && (
          <p className="text-xs font-semibold mb-0.5 opacity-80">
            {message.sender.firstName} {message.sender.lastName}
          </p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={[
            "text-[10px] mt-1 text-right",
            isMine ? "text-brand-100" : "text-neutral-400",
          ].join(" ")}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: messagesData, isLoading: messagesLoading } =
    useMessages(selectedProjectId ?? undefined);
  const sendMessage = useSendMessage(selectedProjectId ?? undefined);
  const markProjectRead = useMessageStore((s) => s.markProjectRead);
  const unreadByProject = useMessageStore((s) => s.unreadByProject);

  useRealtimeMessages(selectedProjectId ?? undefined);

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    markProjectRead(projectId);
    setError(null);
    setDraft("");
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!selectedProjectId || !draft.trim()) return;

    setError(null);
    try {
      await sendMessage.mutateAsync({ content: draft.trim() });
      setDraft("");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? "Impossible d'envoyer le message."
          : "Erreur inattendue"
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const messages = messagesData?.messages ?? [];

  return (
    <div className="-mx-6 -my-8 flex h-[calc(100vh)] overflow-hidden">
      {/* Sidebar projets */}
      <aside className="w-72 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <div className="px-4 py-4 border-b border-neutral-100">
          <h1 className="text-lg font-bold text-neutral-900">Messages</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Vos projets</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {projectsLoading && (
            <p className="px-4 py-6 text-sm text-neutral-500">Chargement…</p>
          )}

          {!projectsLoading && projects.length === 0 && (
            <p className="px-4 py-6 text-sm text-neutral-500">
              Aucun projet disponible.
            </p>
          )}

          {projects.map((project) => {
            const unread = unreadByProject[project.id] ?? 0;
            const isActive = selectedProjectId === project.id;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => selectProject(project.id)}
                className={[
                  "w-full text-left px-4 py-3 border-b border-neutral-50 transition-colors",
                  isActive
                    ? "bg-brand-50 border-l-2 border-l-brand-500"
                    : "hover:bg-neutral-50 border-l-2 border-l-transparent",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {project.title}
                  </p>
                  {unread > 0 && (
                    <span className="shrink-0 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 truncate mt-0.5">
                  {project.dossierNumber}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Zone chat */}
      <div className="flex-1 flex flex-col bg-neutral-50 min-w-0">
        {!selectedProjectId ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-neutral-500">Sélectionnez un projet</p>
          </div>
        ) : (
          <>
            <div className="shrink-0 px-6 py-4 bg-white border-b border-neutral-200">
              <h2 className="text-base font-semibold text-neutral-900">
                {selectedProject?.title}
              </h2>
              <p className="text-xs text-neutral-400">
                {selectedProject?.dossierNumber}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messagesLoading && (
                <p className="text-sm text-neutral-500 text-center">
                  Chargement des messages…
                </p>
              )}

              {!messagesLoading && messages.length === 0 && (
                <p className="text-sm text-neutral-500 text-center py-8">
                  Aucun message. Commencez la conversation !
                </p>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isMine={message.sender.id === user?.id}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="mx-6 mb-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSend}
              className="shrink-0 px-6 py-4 bg-white border-t border-neutral-200 flex gap-3 items-end"
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Écrire un message…"
                rows={1}
                className="flex-1 resize-none rounded-xl border border-neutral-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim() || sendMessage.isPending}
                className="shrink-0 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {sendMessage.isPending ? "…" : "Envoyer"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
