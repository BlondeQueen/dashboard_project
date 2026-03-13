import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RoleToggle from "@/components/admin/RoleToggle";
import UserAvatar from "@/components/ui/UserAvatar";
import { Profile, UserRole } from "@/types";
import { getCurrentUser, getCurrentProfile } from "@/utils/get-user";
import { Users, ShieldCheck, Eye } from "lucide-react";
import { isAdminRole, isSuperadmin, SUPERADMIN_EMAIL } from "@/utils/authz";
import {
  createUserBySuperadmin,
  deleteUserBySuperadmin,
  updateUserCredentialsBySuperadmin,
} from "@/app/actions/users";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Superadmin",
  admin: "Administrateur",
  visitor: "Visiteur",
};

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [user, currentProfile, supabase] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
    createClient(),
  ]);

  if (!user) redirect("/login");
  if (!currentProfile || !isAdminRole(currentProfile.role)) redirect("/dashboard");
  const currentIsSuperadmin = isSuperadmin(currentProfile.role, currentProfile.email);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at");

  const all = (profiles as Profile[]) || [];
  const superadmins = all.filter((p) => p.role === "superadmin" || p.email?.toLowerCase() === SUPERADMIN_EMAIL).length;
  const admins   = all.filter((p) => p.role === "admin").length;
  const visitors = all.filter((p) => p.role === "visitor").length;

  return (
    <div className="space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestion des utilisateurs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{all.length} compte{all.length !== 1 ? "s" : ""} enregistré{all.length !== 1 ? "s" : ""}</p>
      </div>

      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          {params.success}
        </div>
      )}
      {params.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
          {params.error}
        </div>
      )}

      {currentIsSuperadmin && (
        <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-4">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Créer un utilisateur</h2>
          <form action={createUserBySuperadmin} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div className="md:col-span-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nom</label>
              <input
                name="full_name"
                type="text"
                placeholder="Nom complet"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="utilisateur@domaine.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="8 caractères minimum"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-sm"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Rôle</label>
              <select
                name="role"
                defaultValue="visitor"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-sm"
              >
                <option value="visitor">Visiteur</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
            <button
              type="submit"
              className="md:col-span-1 h-10 px-4 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Créer
            </button>
          </form>
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-5 flex items-center gap-4 border border-slate-100/50 dark:border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
            <Users className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{all.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-5 flex items-center gap-4 border border-slate-100/50 dark:border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-violet-900/50">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600 dark:text-violet-400 tabular-nums">{admins + superadmins}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admins + Superadmins</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-5 flex items-center gap-4 border border-slate-100/50 dark:border-slate-700/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg">
            <Eye className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-300 tabular-nums">{visitors}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Visiteurs</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow overflow-hidden border border-slate-100/50 dark:border-slate-700/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/40 bg-slate-50/60 dark:bg-white/5">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                Utilisateur
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden sm:table-cell">
                Rôle actuel
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden md:table-cell">
                Membre depuis
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">
                Admin ?
              </th>
              {currentIsSuperadmin && (
                <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 hidden xl:table-cell">
                  Gestion accès (Superadmin)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
            {all.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar fullName={p.full_name} email={p.email} size="md" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-100">
                        {p.full_name || "—"}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      p.role === "superadmin"
                        ? "bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                        : p.role === "admin"
                        ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.role === "superadmin" ? "bg-amber-500" : p.role === "admin" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {ROLE_LABELS[p.role]}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-400 dark:text-slate-500">
                  {new Date(p.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <RoleToggle
                    profile={p}
                    currentUserId={user.id}
                    canManageRoles={isAdminRole(currentProfile.role)}
                    isProtectedSuperadmin={(p.email || "").toLowerCase() === SUPERADMIN_EMAIL}
                  />
                </td>
                {currentIsSuperadmin && (
                  <td className="px-4 py-3 hidden xl:table-cell">
                    <form action={updateUserCredentialsBySuperadmin.bind(null, p.id)} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          name="full_name"
                          type="text"
                          defaultValue={p.full_name || ""}
                          placeholder="Nom"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-xs"
                        />
                        <input
                          name="email"
                          type="email"
                          defaultValue={p.email}
                          placeholder="Email"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-xs"
                        />
                        <input
                          name="password"
                          type="password"
                          placeholder="Nouveau mot de passe"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-xs"
                        />
                        <select
                          name="role"
                          defaultValue={(p.email || "").toLowerCase() === SUPERADMIN_EMAIL ? "superadmin" : p.role}
                          disabled={(p.email || "").toLowerCase() === SUPERADMIN_EMAIL}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 text-xs disabled:opacity-60"
                        >
                          <option value="visitor">Visiteur</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </div>
                      {(p.email || "").toLowerCase() === SUPERADMIN_EMAIL && (
                        <input type="hidden" name="role" value="superadmin" />
                      )}
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        Enregistrer
                      </button>
                    </form>
                    {(p.email || "").toLowerCase() !== SUPERADMIN_EMAIL && p.id !== user.id && (
                      <form action={deleteUserBySuperadmin.bind(null, p.id)} className="mt-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        >
                          Supprimer
                        </button>
                      </form>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
