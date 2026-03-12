import { createClient } from "@/utils/supabase/server";
import KpiCard from "@/components/ui/KpiCard";
import ChartsSection from "@/components/charts/ChartsSection";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import Link from "next/link";
import { Project, ProjectStatus } from "@/types";
import { ArrowRight, Calendar, User } from "lucide-react";

function formatDate() {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(id, full_name, email, role, created_at), responsable:responsables!projects_responsable_id_fkey(id, full_name, email, poste)")
    .order("updated_at", { ascending: false });

  const all = (projects as Project[]) || [];

  const kpi = {
    total:       all.length,
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed:   all.filter((p) => p.status === "completed").length,
    delayed:     all.filter((p) => p.status === "delayed").length,
    planned:     all.filter((p) => p.status === "planned").length,
    avgProgress:
      all.length > 0
        ? Math.round(all.reduce((acc, p) => acc + (p.progress ?? 0), 0) / all.length)
        : 0,
    totalBudget:    all.reduce((acc, p) => acc + (p.budget ?? 0), 0),
    totalConsumed:  all.reduce((acc, p) => acc + (p.budget_consumed ?? 0), 0),
  };

  const statuses: ProjectStatus[] = ["planned", "in_progress", "completed", "delayed"];
  const statusData = statuses.map((s) => ({
    status: s,
    count: all.filter((p) => p.status === s).length,
  }));

  const budgetData = all
    .filter((p) => p.budget && p.budget > 0)
    .slice(0, 6)
    .map((p) => ({
      name: p.name,
      budget: p.budget ?? 0,
      consumed: p.budget_consumed ?? 0,
    }));

  const recent = all.slice(0, 6);

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tableau de bord</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 capitalize">{formatDate()}</p>
      </div>

      {/* KPIs row 1 — counts */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <KpiCard title="Total projets"   value={kpi.total}       description="Tous statuts confondus" color="emerald" icon="layers"         />
        <KpiCard title="En cours"        value={kpi.in_progress} description="Projets actifs"         color="amber"   icon="trending-up"    />
        <KpiCard title="Terminés"        value={kpi.completed}   description="Projets clôturés"        color="teal"    icon="check-circle"   />
        <KpiCard title="En retard"       value={kpi.delayed}     description="Nécessitent attention"   color="rose"    icon="alert-triangle" />
      </div>

      {/* KPIs row 2 — metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <KpiCard title="Planifiés"         value={kpi.planned}       description="En attente de démarrage"  color="violet" icon="layers"        />
        <KpiCard title="Avancement moyen"  value={kpi.avgProgress}   description="Progression globale"      color="blue"   icon="trending-up"   format="percent" />
        <KpiCard title="Budget total"      value={kpi.totalBudget}   description="Enveloppe allouée"         color="emerald" icon="dollar-sign"  format="fcfa-compact" />
        <KpiCard title="Budget consommé"   value={kpi.totalConsumed} description="Dépenses cumulées"        color="amber"   icon="dollar-sign"  format="fcfa-compact" />
      </div>

      {/* Charts */}
      <ChartsSection statusData={statusData} budgetData={budgetData} />

      {/* Recent projects */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow overflow-hidden border border-slate-100/50 dark:border-slate-700/30">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Projets récents
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors"
          >
            Voir tous
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr] gap-4 px-6 py-2 border-b border-slate-50 dark:border-slate-700/20">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Projet</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Statut</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Responsable</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Évolution</span>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Fin prévue</span>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-700/30">
          {recent.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-400 text-sm">
              Aucun projet pour le moment
            </p>
          )}
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr] gap-2 sm:gap-4 px-6 py-4 hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors group items-center"
            >
              {/* Name */}
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {p.name}
              </p>

              {/* Status */}
              <div className="flex sm:justify-start">
                <StatusBadge status={p.status} />
              </div>

              {/* Responsable */}
              <div className="flex items-center gap-1.5 min-w-0">
                <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  {(p as any).responsable?.full_name || "—"}
                </span>
              </div>

              {/* Évolution */}
              <div className="w-full">
                <ProgressBar value={p.progress} />
              </div>

              {/* Date de fin */}
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>
                  {p.end_date
                    ? new Date(p.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                    : "—"
                  }
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
