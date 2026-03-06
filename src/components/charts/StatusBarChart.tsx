"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ProjectStatus, STATUS_COLORS, STATUS_LABELS } from "@/types";

interface StatusBarChartProps {
  data: { status: ProjectStatus; count: number }[];
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-semibold text-slate-800">{label}</p>
      <p className="text-emerald-600 font-bold">{payload[0].value} projet{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

export default function StatusBarChart({ data }: StatusBarChartProps) {
  const chartData = data.map((d) => ({
    name: STATUS_LABELS[d.status],
    count: d.count,
    color: STATUS_COLORS[d.status],
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "Inter" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="count" name="Projets" radius={[6, 6, 0, 0]} maxBarSize={52}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
