"use client";

import dynamic from "next/dynamic";
import { ProjectStatus, ProjectType } from "@/types";

const StatusBarChart = dynamic(() => import("./StatusBarChart"), {
  ssr: false,
  loading: () => (
    <div className="h-60 flex items-center justify-center text-slate-400 text-sm animate-pulse">
      Chargement du graphique…
    </div>
  ),
});

const TypePieChart = dynamic(() => import("./TypePieChart"), {
  ssr: false,
  loading: () => (
    <div className="h-60 flex items-center justify-center text-slate-400 text-sm animate-pulse">
      Chargement du graphique…
    </div>
  ),
});

interface ChartsSectionProps {
  statusData: { status: ProjectStatus; count: number }[];
  typeData: { type: ProjectType; count: number }[];
}

export default function ChartsSection({ statusData, typeData }: ChartsSectionProps) {
  return (
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
  );
}
