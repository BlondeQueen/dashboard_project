"use client";

import dynamic from "next/dynamic";
import { ProjectStatus, ProjectType } from "@/types";
import type { BudgetEntry } from "./BudgetBarChart";

const StatusDonutChart = dynamic(() => import("./StatusDonutChart"), {
  ssr: false,
  loading: () => (
    <div className="h-52 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm animate-pulse">
      Chargement…
    </div>
  ),
});

const BudgetBarChart = dynamic(() => import("./BudgetBarChart"), {
  ssr: false,
  loading: () => (
    <div className="h-52 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm animate-pulse">
      Chargement…
    </div>
  ),
});

interface ChartsSectionProps {
  statusData: { status: ProjectStatus; count: number }[];
  budgetData: BudgetEntry[];
}

export default function ChartsSection({ statusData, budgetData }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-6 border border-slate-100/50 dark:border-slate-700/30">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
          Répartition par statut
        </h2>
        <StatusDonutChart data={statusData} />
      </div>
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-6 border border-slate-100/50 dark:border-slate-700/30">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-5">
          Budget alloué vs consommé (FCFA)
        </h2>
        <BudgetBarChart data={budgetData} />
      </div>
    </div>
  );
}
