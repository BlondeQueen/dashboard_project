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
      className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
    >
      <Trash2 className="w-4 h-4" />
      Supprimer
    </button>
  );
}
