import { createClient } from "@/utils/supabase/server";
import KpiCard from "@/components/ui/KpiCard";
import StatusBarChart from "@/components/charts/StatusBarChart";
import TypePieChart from "@/components/charts/TypePieChart";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import Link from "next/link";
import { Project, ProjectStatus, ProjectType } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const all = (projects as Project[]) || [];

  const kpi = {
    total: all.length,
    in_progress: all.filter((p) => p.status === "in_progress").length,
    completed: all.filter((p) => p.status === "completed").length,
    delayed: all.filter((p) => p.status === "delayed").length,
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total projets"
          value={kpi.total}
          description="Tous statuts confondus"
          color="indigo"
        />
        <KpiCard
          title="En cours"
          value={kpi.in_progress}
          description="Projets actifs"
          color="yellow"
        />
        <KpiCard
          title="Terminés"
          value={kpi.completed}
          description="Projets clôturés"
          color="green"
        />
        <KpiCard
          title="En retard"
          value={kpi.delayed}
          description="Nécessitent une attention"
          color="red"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Répartition par statut
          </h2>
          <StatusBarChart data={statusData} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Répartition par type
          </h2>
          <TypePieChart data={typeData} />
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Projets récents
          </h2>
          <Link
            href="/projects"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Voir tous →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.length === 0 && (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">
              Aucun projet pour le moment
            </p>
          )}
          {recent.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
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
