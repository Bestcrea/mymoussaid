import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();
    if (!refreshToken) { logout(); return Promise.reject(error); }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post("/api/v1/auth/refresh", { refreshToken });
      setAccessToken(data.accessToken);
      failedQueue.forEach((p) => p.resolve(data.accessToken));
      failedQueue = [];
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch (err) {
      failedQueue.forEach((p) => p.reject(err));
      failedQueue = [];
      logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
