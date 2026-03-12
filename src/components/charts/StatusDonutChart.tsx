"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProjectStatus, STATUS_LABELS } from "@/types";

const STATUS_COLORS: Record<ProjectStatus, string> = {
  planned:     "#6366f1",
  in_progress: "#f59e0b",
  completed:   "#10b981",
  delayed:     "#ef4444",
  suspended:   "#94a3b8",
};

interface Props {
  data: { status: ProjectStatus; count: number }[];
}

export default function StatusDonutChart({ data }: Props) {
  const total = data.reduce((acc, d) => acc + d.count, 0);
  const enriched = data.map((d) => ({
    ...d,
    color: STATUS_COLORS[d.status],
    label: STATUS_LABELS[d.status],
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Donut chart */}
      <div className="relative h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enriched}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={76}
              paddingAngle={3}
              strokeWidth={0}
            >
              {enriched.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => [`${v} projet${v !== 1 ? "s" : ""}`, ""]}
              contentStyle={{
                borderRadius: "0.75rem",
                border: "none",
                boxShadow: "0 4px 16px 0 rgb(0 0 0 / .12)",
                fontSize: "0.8125rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center count */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
            {total}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            projets
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-2">
        {enriched.map((d) => (
          <div key={d.status} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: d.color }}
              />
              <span className="text-slate-600 dark:text-slate-300">{d.label}</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 tabular-nums">
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
