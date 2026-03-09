import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import { Project, UserRole, TYPE_LABELS } from "@/types";
import { ArrowLeft, Edit } from "lucide-react";
import { getCurrentProfile } from "@/utils/get-user";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // All 3 fetches run in parallel: project data + members + current user profile
  const [{ data: project }, { data: membersData }, profile] = await Promise.all([
    supabase
      .from("projects")
      .select("*, owner:profiles!projects_owner_id_fkey(id, full_name, email, role, created_at)")
      .eq("id", id)
      .single(),
    supabase
      .from("project_members")
      .select("user_id, profile:profiles(id, full_name, email, role, created_at)")
      .eq("project_id", id),
    getCurrentProfile(),
  ]);

  if (!project) notFound();

  const p = project as Project;
  const role = (profile?.role as UserRole) || "visitor";

  return (
    <div className="space-y-6 max-w-3xl page-enter">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 flex-1">{p.name}</h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={p.status} />
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow p-6 space-y-5">
        {p.description && (
          <p className="text-slate-600 leading-relaxed">{p.description}</p>
        )}

        <div>
          <p className="text-sm font-semibold text-slate-500 mb-2">Avancement</p>
          <ProgressBar value={p.progress} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Type</p>
            <p className="font-semibold text-slate-800 mt-0.5">{TYPE_LABELS[p.type]}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Responsable</p>
            <p className="font-semibold text-slate-800 mt-0.5">
              {p.owner?.full_name || p.owner?.email || "—"}
            </p>
          </div>
          {p.start_date && (
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Début</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {new Date(p.start_date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
          {p.end_date && (
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Fin prévue</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {new Date(p.end_date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
          {p.budget !== null && (
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Budget</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {p.budget.toLocaleString("fr-FR")} €
              </p>
            </div>
          )}
          {p.budget_consumed !== null && (
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">Budget consommé</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {p.budget_consumed.toLocaleString("fr-FR")} €
                {p.budget && p.budget > 0 && (
                  <span className="ml-1 text-slate-400 text-xs">
                    ({Math.round((p.budget_consumed / p.budget) * 100)}%)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {membersData && membersData.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-2">Membres</p>
            <div className="flex flex-wrap gap-2">
              {membersData.map((m: any) => (
                <span
                  key={m.user_id}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-sm text-slate-700 font-medium"
                >
                  {m.profile?.full_name || m.profile?.email || m.user_id}
                </span>
              ))}
            </div>
          </div>
        )}

        {role === "admin" && (
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Link
              href={`/projects/${p.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-semibold shadow-sm shadow-emerald-200"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Link>
            <DeleteProjectButton projectId={p.id} />
          </div>
        )}
      </div>
    </div>
  );
}
