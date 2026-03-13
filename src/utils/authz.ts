import { UserRole } from "@/types";

export const SUPERADMIN_EMAIL = "admin@qps.net";

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "superadmin";
}

export function isSuperadmin(role: UserRole | null | undefined, email?: string | null): boolean {
  return role === "superadmin" || (email ?? "").toLowerCase() === SUPERADMIN_EMAIL;
}
