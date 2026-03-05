export type UserRole = "admin" | "visitor";

export type ProjectStatus = "planned" | "in_progress" | "completed" | "delayed";

export type ProjectType = "infrastructure" | "software" | "research" | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  type: ProjectType;
  progress: number;
  budget: number | null;
  budget_consumed: number | null;
  start_date: string | null;
  end_date: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile | null;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  profile?: Profile;
}

export interface KpiData {
  total: number;
  in_progress: number;
  completed: number;
  delayed: number;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: "Planifié",
  in_progress: "En cours",
  completed: "Terminé",
  delayed: "En retard",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  planned: "#6366f1",
  in_progress: "#f59e0b",
  completed: "#10b981",
  delayed: "#ef4444",
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  infrastructure: "Infrastructure",
  software: "Logiciel",
  research: "Recherche",
  other: "Autre",
};
