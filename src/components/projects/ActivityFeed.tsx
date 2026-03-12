"use client";

import { useState } from "react";
import { ActivityLog, ActivityAction } from "@/types";
import { addActivityLog } from "@/app/actions/logs";
import { MessageSquare, RefreshCw, PlusCircle, Edit, Clock } from "lucide-react";

const ACTION_CONFIG: Record<ActivityAction, { label: string; icon: React.ElementType; color: string }> = {
  created:      { label: "Création",          icon: PlusCircle,  color: "text-emerald-500" },
  updated:      { label: "Mise à jour",        icon: Edit,        color: "text-blue-500"    },
  status_change:{ label: "Changement statut",  icon: RefreshCw,   color: "text-amber-500"   },
  comment:      { label: "Commentaire",        icon: MessageSquare, color: "text-violet-500" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `il y a ${d}j`;
}

interface ActivityFeedProps {
  projectId: string;
  logs: ActivityLog[];
}

export default function ActivityFeed({ projectId, logs }: ActivityFeedProps) {
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localLogs, setLocalLogs] = useState<ActivityLog[]>(logs);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await addActivityLog(projectId, "comment", comment.trim());
      // Optimistic update
      const optimistic: ActivityLog = {
        id: Date.now().toString(),
        project_id: projectId,
        user_id: null,
        action: "comment",
        detail: comment.trim(),
        created_at: new Date().toISOString(),
      };
      setLocalLogs((prev) => [optimistic, ...prev]);
      setComment("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow p-5 space-y-4 border border-slate-100/50 dark:border-slate-700/30">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
        Activité
      </p>

      {/* Comment form */}
      <form onSubmit={handleComment} className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Ajouter un commentaire…"
          className="flex-1 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all"
        />
        <button
          type="submit"
          disabled={submitting || !comment.trim()}
          className="px-3 py-2 bg-emerald-600 text-white rounded-xl font-semibold text-xs hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Envoyer
        </button>
      </form>

      {/* Feed */}
      <div className="space-y-3">
        {localLogs.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-400 dark:text-slate-500">Aucune activité pour le moment</p>
          </div>
        )}
        {localLogs.map((log) => {
          const cfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.updated;
          const Icon = cfg.icon;
          return (
            <div key={log.id} className="flex gap-3">
              <div className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                  <span className="font-semibold">{cfg.label}</span>
                  {log.detail && (
                    <span className="text-slate-500 dark:text-slate-400"> — {log.detail}</span>
                  )}
                </p>
                {log.profile && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {log.profile.full_name || log.profile.email}
                  </p>
                )}
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5">
                {timeAgo(log.created_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
