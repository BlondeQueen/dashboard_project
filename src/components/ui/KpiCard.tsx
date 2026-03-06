"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, TrendingUp, CheckCircle, AlertTriangle, type LucideIcon } from "lucide-react";

export type KpiIconKey = "layers" | "trending-up" | "check-circle" | "alert-triangle";

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  "layers":           Layers,
  "trending-up":      TrendingUp,
  "check-circle":     CheckCircle,
  "alert-triangle":  AlertTriangle,
};

interface KpiCardProps {
  title: string;
  value: number;
  description: string;
  color: "emerald" | "amber" | "teal" | "rose";
  icon?: KpiIconKey;
}

const colorMap = {
  emerald: {
    gradient: "from-emerald-500 to-emerald-600",
    text: "text-emerald-600",
    iconShadow: "shadow-emerald-200",
  },
  amber: {
    gradient: "from-amber-400 to-amber-500",
    text: "text-amber-600",
    iconShadow: "shadow-amber-200",
  },
  teal: {
    gradient: "from-teal-500 to-teal-600",
    text: "text-teal-600",
    iconShadow: "shadow-teal-200",
  },
  rose: {
    gradient: "from-rose-500 to-rose-600",
    text: "text-rose-600",
    iconShadow: "shadow-rose-200",
  },
};

function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(end * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return count;
}

export default function KpiCard({
  title,
  value,
  description,
  color,
  icon,
}: KpiCardProps) {
  const animated = useCountUp(value);
  const c = colorMap[color];
  const Icon = icon ? ICON_MAP[icon] : null;

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-semibold text-slate-500 leading-tight">{title}</p>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.iconShadow} flex-shrink-0`}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <p className={`text-4xl font-bold tabular-nums ${c.text}`}>{animated}</p>
      <p className="text-xs text-slate-400 mt-1.5 font-medium">{description}</p>
    </div>
  );
}
