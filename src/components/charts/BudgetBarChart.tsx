"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatFCFA } from "@/utils/format";

export interface BudgetEntry {
  name: string;
  budget: number;
  consumed: number;
}

interface Props {
  data: BudgetEntry[];
}

function shortName(name: string): string {
  return name.length > 14 ? name.slice(0, 12) + "…" : name;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#1a2d49] rounded-xl shadow-xl p-3 text-xs min-w-[160px] border border-slate-100 dark:border-slate-600">
      <p className="font-bold text-slate-800 dark:text-slate-100 mb-2 truncate">{label}</p>
      <p className="text-slate-500 dark:text-slate-400">
        Budget :{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {formatFCFA(payload[0]?.value)}
        </span>
      </p>
      <p className="text-slate-500 dark:text-slate-400">
        Consommé :{" "}
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {formatFCFA(payload[1]?.value)}
        </span>
      </p>
    </div>
  );
}

export default function BudgetBarChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="h-52 flex items-center justify-center text-slate-400 text-sm">
        Aucune donnée budgétaire disponible
      </div>
    );
  }

  const displayData = data.slice(0, 6).map((d) => ({
    ...d,
    name: shortName(d.name),
    over: d.consumed > d.budget,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        barGap={3}
        barSize={6}
      >
        <XAxis
          type="number"
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : v >= 1_000
              ? `${(v / 1_000).toFixed(0)}K`
              : String(v)
          }
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="budget" name="Budget" fill="#10b981" radius={[0, 3, 3, 0]} />
        <Bar dataKey="consumed" name="Consommé" radius={[0, 3, 3, 0]}>
          {displayData.map((entry, i) => (
            <Cell key={i} fill={entry.over ? "#ef4444" : "#f59e0b"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
