"use client";

import { useState } from "react";
import { Profile, Project, ProjectStatus, ProjectType, STATUS_LABELS, TYPE_LABELS } from "@/types";

interface ProjectFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: Project;
  profiles: Profile[];
}

export default function ProjectForm({
  action,
  initialData,
  profiles,
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
            defaultValue={initialData?.type ?? "software"}
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
            Budget (€)
          </label>
          <input
            name="budget"
            type="number"
            min={0}
            step={0.01}
            defaultValue={initialData?.budget ?? ""}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Budget consommé (€)
          </label>
          <input
            name="budget_consumed"
            type="number"
            min={0}
            step={0.01}
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

      {/* Owner */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Responsable
        </label>
        <select
          name="owner_id"
          defaultValue={initialData?.owner_id ?? ""}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
        >
          <option value="">— Aucun —</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name || p.email}
            </option>
          ))}
        </select>
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
