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
  infrastructure: "#6366f1",
  software: "#10b981",
  research: "#f59e0b",
  other: "#94a3b8",
};

interface TypePieChartProps {
  data: { type: ProjectType; count: number }[];
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
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
