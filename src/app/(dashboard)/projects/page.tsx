import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import { Project, UserRole } from "@/types";
import { Plus, FolderOpen } from "lucide-react";
import { Suspense } from "react";
import { getCurrentProfile } from "@/utils/get-user";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    type?: string;
    owner_id?: string;
  }>;
}

async function ProjectsContent({ searchParams }: { searchParams: { search?: string; status?: string; type?: string; owner_id?: string } }) {
  const supabase = await createClient();

  const profile = await getCurrentProfile();
  const role = (profile?.role as UserRole) || "visitor";

  // Fetch responsables for the filter dropdown
  const { data: ownersRaw } = await supabase
    .from("responsables")
    .select("id, full_name, email")
    .order("full_name");
  const owners = (ownersRaw || []) as { id: string; full_name: string | null; email: string }[];

  let query = supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(id, full_name, email, role, created_at), responsable:responsables!projects_responsable_id_fkey(id, full_name, email, poste)")
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
  if (searchParams.owner_id) {
    query = query.eq("responsable_id", searchParams.owner_id);
  }

  const { data: projects, error: projectsError } = await query;
  if (projectsError) console.error("[projects] fetch error:", projectsError.message);
  const all = (projects as Project[]) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Projets</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {all.length} projet{all.length !== 1 ? "s" : ""} trouvé{all.length !== 1 ? "s" : ""}
          </p>
        </div>
        {role === "admin" && (
          <Link
            href="/projects/new"
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
          >
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-4 border border-slate-100/50 dark:border-slate-700/30">
        <ProjectFilters owners={owners} />
      </div>

      {/* Card grid */}
      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">Aucun projet trouvé</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Modifiez vos filtres ou créez un nouveau projet
          </p>
          {role === "admin" && (
            <Link
              href="/projects/new"
              className="mt-4 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer un projet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {all.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Chargement des projets…</div>}>
      <ProjectsContent searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
