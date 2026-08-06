import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRightStartOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  IdentificationIcon,
  MegaphoneIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import type { UserRole } from "@/shared";
import { SPECIALTY_LABELS, USER_ROLE_LABELS } from "@/shared";
import { api } from "../../lib/api";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import { useAuthStore } from "../../store/authStore";
import { useMessageStore } from "../../store/messageStore";

const NAV_ITEMS: Record<
  UserRole,
  Array<{
    to: string;
    label: string;
    icon: typeof HomeIcon;
    featured?: boolean;
  }>
> = {
  CLIENT: [
    { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
    { to: "/projects", label: "Mes projets", icon: FolderIcon },
    { to: "/documents", label: "Documents", icon: DocumentTextIcon },
    { to: "/bids", label: "Appels d'offres", icon: MegaphoneIcon },
    { to: "/messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
  ],
  INTERVENANT: [
    { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
    { to: "/bids", label: "Appels d'offres", icon: MegaphoneIcon, featured: true },
    { to: "/offers", label: "Mes offres", icon: DocumentTextIcon },
    { to: "/messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
    { to: "/profile", label: "Mon profil", icon: IdentificationIcon },
  ],
  SECRETAIRE: [
    { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
    { to: "/projects", label: "Projets", icon: FolderIcon },
    { to: "/documents", label: "Documents", icon: DocumentTextIcon },
    { to: "/bids", label: "Appels d'offres", icon: MegaphoneIcon },
    { to: "/messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
  ],
  ADMIN: [
    { to: "/dashboard", label: "Tableau de bord", icon: HomeIcon },
    { to: "/projects", label: "Projets", icon: FolderIcon },
    { to: "/documents", label: "Documents", icon: DocumentTextIcon },
    { to: "/bids", label: "Appels d'offres", icon: MegaphoneIcon },
    { to: "/messages", label: "Messages", icon: ChatBubbleLeftRightIcon },
    { to: "/admin/users", label: "Comptes", icon: UsersIcon },
  ],
};

const LANGUAGES = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
] as const;

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasUnread = useMessageStore((s) => s.hasUnread);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore — on déconnecte quand même côté client */
    }
    disconnectSocket();
    logout();
    navigate("/login", { replace: true });
  }

  function changeLanguage(code: string) {
    i18n.changeLanguage(code);
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-64 shrink-0 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-6 py-6 border-b border-neutral-100">
          <span className="block text-lg font-bold text-brand-600 leading-tight">
            MyMoussaid
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {(user ? NAV_ITEMS[user.role] : []).map((item) => {
            const Icon = item.icon;
            return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : item.featured
                      ? "bg-amber-50/70 text-amber-800 hover:bg-amber-100"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="flex-1">{item.label}</span>
              {item.featured && (
                <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
              )}
              {item.to === "/messages" && hasUnread && (
                <span
                  className="h-2 w-2 rounded-full bg-red-500 shrink-0"
                  aria-label={t("messages.unread")}
                />
              )}
            </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100 p-4">
          <div className="mb-3">
            <p className="mb-2 px-1 text-xs font-medium text-neutral-500">
              {t("nav.language")}
            </p>
            <div className="flex gap-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={[
                    "flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors",
                    i18n.language === lang.code
                      ? "bg-brand-600 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200",
                  ].join(" ")}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {user && (
            <div className="mb-3 rounded-xl border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800">
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-neutral-500">{user.email}</p>
                </div>
              </div>
              <p className="mt-3 w-fit max-w-full truncate rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                {USER_ROLE_LABELS[user.role]}
                {user.role === "INTERVENANT" && user.specialty
                  ? ` · ${SPECIALTY_LABELS[user.specialty]}`
                  : ""}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" aria-hidden />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
