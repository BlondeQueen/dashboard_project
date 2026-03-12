export type UserRole = "admin" | "visitor";

export type ProjectStatus = "planned" | "in_progress" | "completed" | "delayed" | "suspended";

export type ProjectType = "web" | "mobile" | "web_mobile";

export type ActivityAction = "created" | "updated" | "status_change" | "comment";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

export interface Responsable {
  id: string;
  full_name: string;
  email: string | null;
  poste: string | null;
  phone: string | null;
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
  responsable_id: string | null;
  github_url: string | null;
  gitlab_url: string | null;
  app_url: string | null;
  created_at: string;
  updated_at: string;
  owner?: Profile | null;
  responsable?: Responsable | null;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  profile?: Profile;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  user_id: string | null;
  action: ActivityAction;
  detail: string | null;
  created_at: string;
  profile?: Profile | null;
}

export interface KpiData {
  total: number;
  in_progress: number;
  completed: number;
  delayed: number;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned:     "Planifié",
  in_progress: "En cours",
  completed:   "Terminé",
  delayed:     "En retard",
  suspended:   "Suspendu",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  planned:     "#6366f1",
  in_progress: "#f59e0b",
  completed:   "#10b981",
  delayed:     "#ef4444",
  suspended:   "#94a3b8",
};

export const TYPE_LABELS: Record<ProjectType, string> = {
  web:        "Application web",
  mobile:     "Application mobile",
  web_mobile: "Application web et mobile",
};
