import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import ProjectFilters from "@/components/projects/ProjectFilters";
import { Project, UserRole } from "@/types";
import { Plus } from "lucide-react";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
  }>;
}

async function ProjectsContent({ searchParams }: { searchParams: { search?: string; status?: string; type?: string } }) {
  const supabase = await createClient();

  // Get current user role
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()
    : { data: null };

  const role = (profile?.role as UserRole) || "visitor";

  let query = supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(id, full_name, email, role, created_at)")
    .order("created_at", { ascending: false });

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }
  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.type) {
    query = query.eq("type", searchParams.type);
  }

  const { data: projects } = await query;
  const all = (projects as Project[]) || [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
        {role === "admin" && (
          <Link
            href="/projects/new"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <ProjectFilters />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Nom
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 hidden sm:table-cell">
                  Statut
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 hidden md:table-cell">
                  Avancement
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 hidden lg:table-cell">
                  Responsable
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {all.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    Aucun projet trouvé
                  </td>
                </tr>
              )}
              {all.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                    {p.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                        {p.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell w-40">
                    <ProgressBar value={p.progress} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                    {p.owner?.full_name || p.owner?.email || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ProjectsContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
