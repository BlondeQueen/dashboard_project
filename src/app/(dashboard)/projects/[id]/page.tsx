import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import ActivityFeed from "@/components/projects/ActivityFeed";
import { Project, UserRole, TYPE_LABELS, ActivityLog } from "@/types";
import { ArrowLeft, Edit, Github, Globe, Calendar, User, Layers } from "lucide-react";
import { getCurrentProfile } from "@/utils/get-user";
import { isAdminRole } from "@/utils/authz";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: membersData }, { data: logsData }, profile] = await Promise.all([
    supabase
      .from("projects")
      .select("*, owner:profiles!projects_owner_id_fkey(id, full_name, email, role, created_at), responsable:responsables!projects_responsable_id_fkey(id, full_name, email, poste, phone)")
      .eq("id", id)
      .single(),
    supabase
      .from("project_members")
      .select("user_id, profile:profiles(id, full_name, email, role, created_at)")
      .eq("project_id", id),
    supabase
      .from("activity_logs")
      .select("*, profile:profiles(id, full_name, email, role, created_at)")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    getCurrentProfile(),
  ]);

  if (!project) notFound();

  const p = project as Project;
  const role = (profile?.role as UserRole) || "visitor";

  const budgetPct =
    p.budget && p.budget > 0 && p.budget_consumed !== null
      ? Math.round((p.budget_consumed / p.budget) * 100)
      : null;

  const budgetRemaining =
    p.budget !== null && p.budget_consumed !== null
      ? p.budget - p.budget_consumed
      : null;

  const TYPE_BADGE: Record<string, string> = {
    web:        "WEB",
    mobile:     "MOBILE",
    web_mobile: "WEB & MOBILE",
  };

  return (
    <div className="space-y-6 max-w-5xl page-enter">

      {/* ── Hero card ── */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6 space-y-4">

        {/* top row: back + badges + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-medium transition-colors mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux projets
          </Link>

          <StatusBadge status={p.status} />

          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider">
            {TYPE_BADGE[p.type] || p.type.toUpperCase()}
          </span>

          {/* Admin actions pushed right */}
          {isAdminRole(role) && (
            <div className="ml-auto flex items-center gap-2">
              <Link
                href={`/projects/${p.id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-600/60 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
              <DeleteProjectButton projectId={p.id} />
            </div>
          )}
        </div>

        {/* Title + description */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{p.name}</h1>
          {p.description && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{p.description}</p>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Progression globale</p>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT — Informations générales (3/5) */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
              Informations générales
            </h2>

            <div className="space-y-5">
              {/* Période */}
              {(p.start_date || p.end_date) && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Période</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {p.start_date
                        ? new Date(p.start_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                        : "—"
                      }
                      {" → "}
                      {p.end_date
                        ? new Date(p.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                        : "—"
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Chef de projet */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Chef de projet</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {(p as any).responsable?.full_name || "—"}
                  </p>
                  {(p as any).responsable?.poste && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{(p as any).responsable.poste}</p>
                  )}
                  {(p as any).responsable?.phone && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">{(p as any).responsable.phone}</p>
                  )}
                </div>
              </div>

              {/* Repositories */}
              {(p.github_url || p.gitlab_url || p.app_url) && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">Repositories</p>
                    <div className="flex flex-wrap gap-2">
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
                          <Github className="w-4 h-4" />
                          GitHub →
                        </a>
                      )}
                      {p.gitlab_url && (
                        <a href={p.gitlab_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.49a.42.42 0 01.11-.18.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51 1.22 3.78a.84.84 0 01-.3.94z"/>
                          </svg>
                          GitLab →
                        </a>
                      )}
                      {p.app_url && (
                        <a href={p.app_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors">
                          <Globe className="w-3.5 h-3.5" />
                          Application →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Type */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Layers className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-0.5">Type</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{TYPE_LABELS[p.type]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Budget + Participants (2/5) */}
        <div className="lg:col-span-2 space-y-5">

          {/* Budget card */}
          {(p.budget !== null || p.budget_consumed !== null) && (
            <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Budget</h2>

              {/* Alloué / Dépensé side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Alloué</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {p.budget !== null
                      ? p.budget.toLocaleString("fr-FR")
                      : "—"
                    }
                  </p>
                  {p.budget !== null && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">FCFA</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-0.5">Dépensé</p>
                  <p className={`text-lg font-bold leading-tight ${
                    budgetPct !== null && budgetPct > 100
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {p.budget_consumed !== null
                      ? p.budget_consumed.toLocaleString("fr-FR")
                      : "—"
                    }
                  </p>
                  {p.budget_consumed !== null && (
                    <p className="text-xs text-slate-400 dark:text-slate-500">FCFA</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {budgetPct !== null && (
                <>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        budgetPct > 100 ? "bg-rose-500" : budgetPct > 80 ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(budgetPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${
                      budgetPct > 100 ? "text-rose-500 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
                    }`}>
                      {budgetPct > 100 ? `⚠ ${budgetPct}% consommé` : `${budgetPct}% consommé`}
                    </span>
                    {budgetRemaining !== null && budgetRemaining >= 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Reste : {budgetRemaining.toLocaleString("fr-FR")} FCFA
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Participants card */}
          {membersData && membersData.length > 0 && (
            <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-5 space-y-3">
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Participants ({membersData.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {membersData.map((m: any) => (
                  <span
                    key={m.user_id}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-sm text-slate-700 dark:text-slate-200 font-medium"
                  >
                    {m.profile?.full_name || m.profile?.email || m.user_id}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Journal d'activité (full width) ── */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
          Journal d&apos;activité
        </h2>
        <ActivityFeed
          projectId={p.id}
          logs={(logsData as ActivityLog[]) || []}
        />
      </div>

    </div>
  );
}