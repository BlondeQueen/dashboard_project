"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProjectStatus, ProjectType, STATUS_LABELS, TYPE_LABELS } from "@/types";
import { Search } from "lucide-react";

export default function ProjectFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
          defaultValue={search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
        />
      </div>

      <select
        value={status}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
      >
        <option value="">Tous les statuts</option>
        {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => updateFilter("type", e.target.value)}
        className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
      >
        <option value="">Tous les types</option>
        {(Object.keys(TYPE_LABELS) as ProjectType[]).map((t) => (
          <option key={t} value={t}>
            {TYPE_LABELS[t]}
          </option>
        ))}
      </select>
    </div>
  );
}
