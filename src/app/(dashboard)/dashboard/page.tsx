import { createClient } from "@/utils/supabase/server";
import KpiCard from "@/components/ui/KpiCard";
import StatusBarChart from "@/components/charts/StatusBarChart";
import TypePieChart from "@/components/charts/TypePieChart";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import Link from "next/link";
import { Project, ProjectStatus, ProjectType } from "@/types";
import { ArrowRight } from "lucide-react";

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
    .select("*")
    .order("updated_at", { ascending: false });

  const all = (projects as Project[]) || [];

  const kpi = {
    total:       all.length,
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed:   all.filter((p) => p.status === "completed").length,
    delayed:     all.filter((p) => p.status === "delayed").length,
  };

  const statuses: ProjectStatus[] = ["planned", "in_progress", "completed", "delayed"];
  const statusData = statuses.map((s) => ({
    status: s,
    count: all.filter((p) => p.status === s).length,
  }));

  const types: ProjectType[] = ["infrastructure", "software", "research", "other"];
  const typeData = types.map((t) => ({
    type: t,
    count: all.filter((p) => p.type === t).length,
  }));

  const recent = all.slice(0, 5);

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500 capitalize">{formatDate()}</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <KpiCard
          title="Total projets"
          value={kpi.total}
          description="Tous statuts confondus"
          color="emerald"
          icon="layers"
        />
        <KpiCard
          title="En cours"
          value={kpi.in_progress}
          description="Projets actifs"
          color="amber"
          icon="trending-up"
        />
        <KpiCard
          title="Terminés"
          value={kpi.completed}
          description="Projets clôturés"
          color="teal"
          icon="check-circle"
        />
        <KpiCard
          title="En retard"
          value={kpi.delayed}
          description="Nécessitent une attention"
          color="rose"
          icon="alert-triangle"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">
            Répartition par statut
          </h2>
          <StatusBarChart data={statusData} />
        </div>
        <div className="bg-white rounded-2xl card-shadow p-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">
            Répartition par type
          </h2>
          <TypePieChart data={typeData} />
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Projets récents
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
          >
            Voir tous
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recent.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-400 text-sm">
              Aucun projet pour le moment
            </p>
          )}
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group"
            >
              {/* Color dot */}
              <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                  {p.name}
                </p>
              </div>
              <StatusBadge status={p.status} />
              <div className="w-28 hidden sm:block">
                <ProgressBar value={p.progress} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
