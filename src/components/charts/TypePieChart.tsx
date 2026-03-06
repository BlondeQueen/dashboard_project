"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProjectType, TYPE_LABELS } from "@/types";

const TYPE_COLORS: Record<ProjectType, string> = {
  infrastructure: "#059669",
  software:       "#0ea5e9",
  research:       "#f59e0b",
  other:          "#94a3b8",
};

interface TypePieChartProps {
  data: { type: ProjectType; count: number }[];
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-800">{payload[0].name}</p>
      <p className="text-emerald-600 font-bold">{payload[0].value} projet{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function TypePieChart({ data }: TypePieChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: TYPE_LABELS[d.type],
      value: d.count,
      color: TYPE_COLORS[d.type],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-slate-400 text-sm">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={92}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={2}
          stroke="#fff"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ fontSize: 12, color: "#64748b", fontFamily: "Inter" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
