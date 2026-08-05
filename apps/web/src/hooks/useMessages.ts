import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SendMessageInput } from "@ma/shared";
import { api } from "../lib/api";
import { getSocket, joinProject, leaveProject } from "../lib/socket";
import { useMessageStore } from "../store/messageStore";

export interface MessageItem {
  id: string;
  content: string;
  projectId: string;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface MessagesResponse {
  messages: MessageItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useMessages(projectId: string | undefined) {
  return useQuery({
    queryKey: ["messages", projectId],
    queryFn: async () => {
      const { data } = await api.get<MessagesResponse>(
        `/projects/${projectId}/messages`
      );
      return data;
    },
    enabled: Boolean(projectId),
  });
}

export function useSendMessage(projectId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const { data } = await api.post<{ message: MessageItem }>(
        `/projects/${projectId}/messages`,
        input
      );
      return data.message;
    },
    onSuccess: (message) => {
      queryClient.setQueryData<MessagesResponse>(
        ["messages", projectId],
        (old) => {
          if (!old) return old;
          if (old.messages.some((m) => m.id === message.id)) return old;
          return {
            ...old,
            messages: [...old.messages, message],
            total: old.total + 1,
          };
        }
      );
    },
  });
}

export function useRealtimeMessages(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const markProjectRead = useMessageStore((s) => s.markProjectRead);
  const setActiveProjectId = useMessageStore((s) => s.setActiveProjectId);

  useEffect(() => {
    if (!projectId) {
      setActiveProjectId(null);
      return;
    }

    setActiveProjectId(projectId);
    markProjectRead(projectId);
    joinProject(projectId);

    const activeSocket = getSocket();
    if (!activeSocket) return;

    function onNewMessage(message: MessageItem) {
      if (message.projectId !== projectId) return;

      queryClient.setQueryData<MessagesResponse>(
        ["messages", projectId],
        (old) => {
          if (!old) return old;
          if (old.messages.some((m) => m.id === message.id)) return old;
          return {
            ...old,
            messages: [...old.messages, message],
            total: old.total + 1,
          };
        }
      );
    }

    activeSocket.on("message:new", onNewMessage);

    return () => {
      activeSocket.off("message:new", onNewMessage);
      leaveProject(projectId);
      setActiveProjectId(null);
    };
  }, [projectId, queryClient, markProjectRead, setActiveProjectId]);
}
