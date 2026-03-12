"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, TrendingUp, CheckCircle, AlertTriangle, DollarSign, Users, type LucideIcon } from "lucide-react";

export type KpiIconKey = "layers" | "trending-up" | "check-circle" | "alert-triangle" | "dollar-sign" | "users";

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  "layers":          Layers,
  "trending-up":     TrendingUp,
  "check-circle":    CheckCircle,
  "alert-triangle":  AlertTriangle,
  "dollar-sign":     DollarSign,
  "users":           Users,
};

export type KpiFormat = "number" | "percent" | "fcfa" | "fcfa-compact";

interface KpiCardProps {
  title: string;
  value: number;
  description: string;
  color: "emerald" | "amber" | "teal" | "rose" | "violet" | "blue";
  icon?: KpiIconKey;
  format?: KpiFormat;
}

const colorMap = {
  emerald: { gradient: "from-emerald-500 to-emerald-600", text: "text-emerald-600 dark:text-emerald-400", iconShadow: "shadow-emerald-200 dark:shadow-emerald-900/50" },
  amber:   { gradient: "from-amber-400 to-amber-500",     text: "text-amber-600 dark:text-amber-400",     iconShadow: "shadow-amber-200 dark:shadow-amber-900/50"   },
  teal:    { gradient: "from-teal-500 to-teal-600",       text: "text-teal-600 dark:text-teal-400",       iconShadow: "shadow-teal-200 dark:shadow-teal-900/50"     },
  rose:    { gradient: "from-rose-500 to-rose-600",       text: "text-rose-600 dark:text-rose-400",       iconShadow: "shadow-rose-200 dark:shadow-rose-900/50"     },
  violet:  { gradient: "from-violet-500 to-violet-600",   text: "text-violet-600 dark:text-violet-400",   iconShadow: "shadow-violet-200 dark:shadow-violet-900/50" },
  blue:    { gradient: "from-blue-500 to-blue-600",       text: "text-blue-600 dark:text-blue-400",       iconShadow: "shadow-blue-200 dark:shadow-blue-900/50"     },
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

function formatValue(count: number, format: KpiFormat): string {
  switch (format) {
    case "percent":
      return `${count} %`;
    case "fcfa":
      return (
        new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count) +
        " FCFA"
      );
    case "fcfa-compact":
      if (Math.abs(count) >= 1_000_000)
        return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(count / 1_000_000) + "M FCFA";
      if (Math.abs(count) >= 1_000)
        return new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count / 1_000) + "K FCFA";
      return new Intl.NumberFormat("fr-FR").format(count) + " FCFA";
    default:
      return count.toLocaleString("fr-FR");
  }
}

export default function KpiCard({ title, value, description, color, icon, format = "number" }: KpiCardProps) {
  const animated = useCountUp(value);
  const c = colorMap[color];
  const Icon = icon ? ICON_MAP[icon] : null;

  const isFCFA = format === "fcfa" || format === "fcfa-compact";

  return (
    <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl p-6 card-shadow hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 animate-slide-up border border-slate-100/50 dark:border-slate-700/30">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-tight">{title}</p>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.iconShadow} flex-shrink-0`}
          >
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      <p className={`font-bold tabular-nums ${c.text} ${isFCFA ? "text-xl leading-snug" : "text-4xl"}`}>
        {formatValue(animated, format)}
      </p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">{description}</p>
    </div>
  );
}
