import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useMessageStore } from "../store/messageStore";

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  return socketInstance;
}

/** @deprecated use getSocket() — kept for API compatibility */
export const socket = {
  get connected() {
    return socketInstance?.connected ?? false;
  },
};

function setupNotifyListener(activeSocket: Socket) {
  activeSocket.off("message:notify");
  activeSocket.on("message:notify", (data: { projectId: string }) => {
    useMessageStore.getState().incrementUnread(data.projectId);
  });
}

export function connectSocket(): Socket | null {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;

  if (socketInstance?.connected) {
    return socketInstance;
  }

  disconnectSocket();

  socketInstance = io(window.location.origin, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  setupNotifyListener(socketInstance);

  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.off("message:notify");
    socketInstance.disconnect();
    socketInstance = null;
  }
  useMessageStore.getState().clearAll();
}

export function joinProject(projectId: string) {
  socketInstance?.emit("project:join", projectId);
}

export function leaveProject(projectId: string) {
  socketInstance?.emit("project:leave", projectId);
}
