import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { IntervenantSpecialty, UserRole } from "@/shared";
import { SPECIALTY_LABELS, USER_ROLE_LABELS } from "@/shared";
import { ACCOUNT_TYPES } from "../../constants/registration";
import { api } from "../../lib/api";

type AccountStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
type TabKey = "pending" | "APPROVED" | "REJECTED" | "all";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameAr: string | null;
  lastNameAr: string | null;
  phone: string | null;
  role: UserRole;
  specialty: IntervenantSpecialty | null;
  accountType: string | null;
  status: AccountStatus;
  civility: string | null;
  cinNumber: string | null;
  city: string | null;
  address: string | null;
  licenseNumber: string | null;
  regionalCouncil: string | null;
  billingType: string | null;
  billingName: string | null;
  billingCity: string | null;
  billingAddress: string | null;
  billingCin: string | null;
  billingIce: string | null;
  billingRc: string | null;
  rejectionReason: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
}

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "pending", label: "En attente" },
  { key: "APPROVED", label: "Approuvés" },
  { key: "REJECTED", label: "Refusés" },
  { key: "all", label: "Tous" },
];

function accountTypeLabel(accountType: string | null): string {
  if (!accountType) return "—";
  const found = ACCOUNT_TYPES.find((t) => t.id === accountType);
  return found?.title ?? accountType;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_BADGE: Record<AccountStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SUSPENDED: "bg-neutral-200 text-neutral-700",
};

const STATUS_LABEL: Record<AccountStatus, string> = {
  PENDING: "En attente",
  APPROVED: "Approuvé",
  REJECTED: "Refusé",
  SUSPENDED: "Suspendu",
};

function useAdminUsers(tab: TabKey) {
  return useQuery({
    queryKey: ["admin", "users", tab],
    queryFn: async () => {
      const url =
        tab === "pending"
          ? "/admin/users/pending"
          : tab === "all"
            ? "/admin/users"
            : `/admin/users?status=${tab}`;
      const { data } = await api.get<{ users: AdminUser[] }>(url);
      return data.users;
    },
  });
}

function useApproveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch<{ user: AdminUser }>(`/admin/users/${id}/approve`);
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

function useRejectUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.patch<{ user: AdminUser }>(`/admin/users/${id}/reject`, { reason });
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
      <span className="font-medium text-neutral-400">{label} :</span>
      <span className="text-neutral-600">{value}</span>
    </div>
  );
}

function UserCard({
  user,
  onApprove,
  onReject,
  isApproving,
}: {
  user: AdminUser;
  onApprove: () => void;
  onReject: () => void;
  isApproving: boolean;
}) {
  const specialtyLabel = user.specialty ? SPECIALTY_LABELS[user.specialty] : null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-neutral-900">
              {user.firstName} {user.lastName}
            </h3>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[user.status]}`}
            >
              {STATUS_LABEL[user.status]}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-neutral-500">{user.email}</p>
        </div>

        {user.status === "PENDING" && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={onReject}
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={onApprove}
              disabled={isApproving}
              className="rounded-lg bg-green-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isApproving ? "Approbation…" : "Approuver"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        <InfoRow label="Rôle" value={USER_ROLE_LABELS[user.role]} />
        <InfoRow label="Type de compte" value={accountTypeLabel(user.accountType)} />
        <InfoRow label="Spécialité" value={specialtyLabel} />
        <InfoRow label="Ville" value={user.city} />
        <InfoRow label="CIN" value={user.cinNumber} />
        <InfoRow label="Téléphone" value={user.phone} />
        <InfoRow label="Inscrit le" value={formatDate(user.createdAt)} />
      </div>

      {user.status === "REJECTED" && user.rejectionReason && (
        <div className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          <span className="font-semibold">Motif du refus :</span> {user.rejectionReason}
        </div>
      )}
    </div>
  );
}

function RejectModal({
  userName,
  onCancel,
  onConfirm,
  isSubmitting,
}: {
  userName: string;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    if (reason.trim().length < 3) {
      setError("Merci de préciser la raison du refus (3 caractères minimum).");
      return;
    }
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/40" onClick={onCancel} aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-neutral-900">Raison du refus</h2>
        <p className="mt-1 text-sm text-neutral-500">
          Expliquez pourquoi la demande de <span className="font-medium text-neutral-700">{userName}</span> est
          refusée. Cette raison sera envoyée par email.
        </p>

        <textarea
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError(null);
          }}
          className="mt-4 w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Ex : Documents d'identité illisibles, numéro de licence invalide…"
        />
        {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Envoi…" : "Confirmer le refus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const [tab, setTab] = useState<TabKey>("pending");
  const [rejectTarget, setRejectTarget] = useState<AdminUser | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: users = [], isLoading, isError } = useAdminUsers(tab);
  const { data: pendingUsers = [] } = useAdminUsers("pending");
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();

  async function handleApprove(id: string) {
    setActionError(null);
    setApprovingId(id);
    try {
      await approveUser.mutateAsync(id);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.response?.data?.error ?? "Impossible d'approuver ce compte."
        : "Une erreur inattendue est survenue.";
      setActionError(message);
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejectTarget) return;
    setActionError(null);
    try {
      await rejectUser.mutateAsync({ id: rejectTarget.id, reason });
      setRejectTarget(null);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? err.response?.data?.error ?? "Impossible de refuser ce compte."
        : "Une erreur inattendue est survenue.";
      setActionError(message);
    }
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Gestion des comptes</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Validez ou refusez les nouvelles demandes d&apos;inscription.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-b-2 border-brand-500 text-brand-600"
                : "border-b-2 border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t.label}
            {t.key === "pending" && pendingUsers.length > 0 && (
              <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
                {pendingUsers.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {isLoading && <p className="text-sm text-neutral-500">Chargement…</p>}

      {isError && (
        <p className="text-sm text-red-600">Impossible de charger les comptes utilisateurs.</p>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">Aucun compte à afficher pour cet onglet.</p>
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isApproving={approvingId === user.id && approveUser.isPending}
              onApprove={() => handleApprove(user.id)}
              onReject={() => {
                setActionError(null);
                setRejectTarget(user);
              }}
            />
          ))}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          userName={`${rejectTarget.firstName} ${rejectTarget.lastName}`}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleReject}
          isSubmitting={rejectUser.isPending}
        />
      )}
    </>
  );
}
