"use client";

import { useState } from "react";
import { Responsable, Project, ProjectStatus, ProjectType, STATUS_LABELS, TYPE_LABELS } from "@/types";

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: Project;
  responsables: Responsable[];
}

export default function ProjectForm({
  action,
  initialData,
  responsables,
}: ProjectFormProps) {
  const [progress, setProgress] = useState(initialData?.progress ?? 0);

  return (
    <form action={action} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Nom du projet *
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={initialData?.name}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData?.description ?? ""}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
        />
      </div>

      {/* Status & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Statut *
          </label>
          <select
            name="status"
            required
            defaultValue={initialData?.status ?? "planned"}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          >
            {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Type *
          </label>
          <select
            name="type"
            required
            defaultValue={initialData?.type ?? "web"}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          >
            {(Object.keys(TYPE_LABELS) as ProjectType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Avancement : {progress}%
        </label>
        <input
          name="progress"
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Budget (FCFA)
          </label>
          <input
            name="budget"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.budget ?? ""}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Budget consommé (FCFA)
          </label>
          <input
            name="budget_consumed"
            type="number"
            min={0}
            step={1}
            defaultValue={initialData?.budget_consumed ?? ""}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Date de début
          </label>
          <input
            name="start_date"
            type="date"
            defaultValue={initialData?.start_date ?? ""}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Date de fin prévue
          </label>
          <input
            name="end_date"
            type="date"
            defaultValue={initialData?.end_date ?? ""}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Liens */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Liens du projet
        </label>
        <div className="space-y-3">
          {/* GitHub */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-700" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Dépôt GitHub</label>
              <input
                name="github_url"
                type="url"
                defaultValue={initialData?.github_url ?? ""}
                placeholder="https://github.com/organisation/repo"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* GitLab */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-500" fill="currentColor">
                <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.49a.42.42 0 01.11-.18.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51 1.22 3.78a.84.84 0 01-.3.94z"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Dépôt GitLab</label>
              <input
                name="gitlab_url"
                type="url"
                defaultValue={initialData?.gitlab_url ?? ""}
                placeholder="https://gitlab.com/organisation/repo"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* App déployée */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">Application déployée</label>
              <input
                name="app_url"
                type="url"
                defaultValue={initialData?.app_url ?? ""}
                placeholder="https://mon-application.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsable */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Chef de projet / Responsable
        </label>
        <select
          name="responsable_id"
          defaultValue={initialData?.responsable_id ?? ""}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
        >
          <option value="">— Aucun —</option>
          {responsables.map((r) => (
            <option key={r.id} value={r.id}>
              {r.full_name}{r.poste ? ` — ${r.poste}` : ""}
            </option>
          ))}
        </select>
        {responsables.length === 0 && (
          <p className="mt-1.5 text-xs text-amber-600">
            Aucun responsable enregistré.{" "}
            <a href="/admin/responsables/new" className="underline font-medium">Ajouter un responsable</a>
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm shadow-emerald-200"
        >
          {initialData ? "Enregistrer les modifications" : "Créer le projet"}
        </button>
      </div>
    </form>
  );
}
