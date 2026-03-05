import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import RoleToggle from "@/components/admin/RoleToggle";
import { Profile, UserRole } from "@/types";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrateur",
  visitor: "Visiteur",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!currentProfile || currentProfile.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Utilisateur
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">
                Rôle actuel
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Admin
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(profiles as Profile[])?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">
                    {p.full_name || "—"}
                  </p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.role === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
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
