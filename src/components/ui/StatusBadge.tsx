import { ProjectStatus, STATUS_COLORS, STATUS_LABELS } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
}

// Softer background per status (10% opacity hue)
const BG: Record<ProjectStatus, string> = {
  planned:     "bg-slate-100  text-slate-700",
  in_progress: "bg-blue-50    text-blue-700",
  completed:   "bg-emerald-50 text-emerald-700",
  delayed:     "bg-rose-50    text-rose-700",
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
