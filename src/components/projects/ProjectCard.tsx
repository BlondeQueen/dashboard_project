import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Project, TYPE_LABELS } from "@/types";
import { Calendar, User, Github, Globe } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project: p }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${p.id}`}
      className="group flex flex-col bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow hover:shadow-xl dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-slate-100/50 dark:border-slate-700/30"
    >
      {/* Top colored bar based on status */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{
          background:
            p.status === "completed"   ? "#10b981" :
            p.status === "in_progress" ? "#f59e0b" :
            p.status === "delayed"     ? "#ef4444" :
                                          "#6366f1",
        }}
      />

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
            {p.name}
          </h3>
          <StatusBadge status={p.status} />
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {p.description}
          </p>
        )}

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Avancement</p>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">{p.progress}%</p>
          </div>
          <ProgressBar value={p.progress} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-50 dark:border-slate-700/40">
          {/* Type badge */}
          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            {TYPE_LABELS[p.type]}
          </span>

          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
            {/* Responsable */}
            {(p as any).responsable && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline truncate max-w-[80px]">
                  {(p as any).responsable.full_name?.split(" ")[0] || "—"}
                </span>
              </span>
            )}
            {/* Dates */}
            {p.end_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(p.end_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            )}
            {/* Links */}
            {p.github_url && <Github className="w-3 h-3" />}
            {p.app_url && <Globe className="w-3 h-3" />}
          </div>
        </div>
      </div>
    </Link>
  );
}
