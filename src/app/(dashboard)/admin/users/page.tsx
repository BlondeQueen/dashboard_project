import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RoleToggle from "@/components/admin/RoleToggle";
import { Profile, UserRole } from "@/types";
import { getCurrentUser, getCurrentProfile } from "@/utils/get-user";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrateur",
  visitor: "Visiteur",
};

export default async function AdminUsersPage() {
  // Parallel: current user identity + all profiles list
  const [user, currentProfile, supabase] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
    createClient(),
  ]);

  if (!user) redirect("/login");
  if (!currentProfile || currentProfile.role !== "admin") redirect("/dashboard");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h1>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-4 py-3 font-semibold text-slate-600">
                Utilisateur
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">
                Rôle actuel
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(profiles as Profile[])?.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    {p.full_name || "—"}
                  </p>
                  <p className="text-xs text-slate-400">{p.email}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      p.role === "admin"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.role === "admin" ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {ROLE_LABELS[p.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <RoleToggle profile={p} currentUserId={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
