import { ProjectStatus, STATUS_COLORS, STATUS_LABELS } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const BG: Record<ProjectStatus, string> = {
  planned:     "bg-slate-100 dark:bg-slate-700/60  text-slate-700 dark:text-slate-300",
  in_progress: "bg-blue-50 dark:bg-blue-900/40    text-blue-700 dark:text-blue-300",
  completed:   "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400",
  delayed:     "bg-rose-50 dark:bg-rose-900/40    text-rose-700 dark:text-rose-400",
  suspended:   "bg-slate-50 dark:bg-slate-800/60   text-slate-500 dark:text-slate-400",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${BG[status]}`}>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
