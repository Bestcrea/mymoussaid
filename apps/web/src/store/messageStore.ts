import { create } from "zustand";

interface MessageNotificationState {
  hasUnread: boolean;
  unreadByProject: Record<string, number>;
  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
  incrementUnread: (projectId: string) => void;
  markProjectRead: (projectId: string) => void;
  clearAll: () => void;
}

export const useMessageStore = create<MessageNotificationState>((set, get) => ({
  hasUnread: false,
  unreadByProject: {},
  activeProjectId: null,

  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),

  incrementUnread: (projectId) => {
    if (get().activeProjectId === projectId) return;

    set((state) => {
      const count = (state.unreadByProject[projectId] ?? 0) + 1;
      return {
        hasUnread: true,
        unreadByProject: { ...state.unreadByProject, [projectId]: count },
      };
    });
  },

  markProjectRead: (projectId) => {
    set((state) => {
      const next = { ...state.unreadByProject };
      delete next[projectId];
      const hasUnread = Object.keys(next).length > 0;
      return { unreadByProject: next, hasUnread };
    });
  },

  clearAll: () =>
    set({ hasUnread: false, unreadByProject: {}, activeProjectId: null }),
}));
