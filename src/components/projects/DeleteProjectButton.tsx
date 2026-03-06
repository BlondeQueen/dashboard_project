"use client";

import { deleteProject } from "@/app/actions/projects";
import { Trash2 } from "lucide-react";

interface DeleteProjectButtonProps {
  projectId: string;
}

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const handleDelete = async () => {
    if (confirm("Supprimer ce projet ? Cette action est irréversible.")) {
      await deleteProject(projectId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all text-sm font-semibold"
    >
      <Trash2 className="w-4 h-4" />
      Supprimer
    </button>
  );
}
