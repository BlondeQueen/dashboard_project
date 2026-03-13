"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/users";
import { Profile, UserRole } from "@/types";

interface RoleToggleProps {
  profile: Profile;
  currentUserId: string;
  canManageRoles: boolean;
  isProtectedSuperadmin: boolean;
}

export default function RoleToggle({
  profile,
  currentUserId,
  canManageRoles,
  isProtectedSuperadmin,
}: RoleToggleProps) {
  const [role, setRole] = useState<UserRole>(profile.role);
  const [loading, setLoading] = useState(false);

  const isSelf = profile.id === currentUserId;
  const isLocked = isSelf || isProtectedSuperadmin || role === "superadmin" || !canManageRoles;

  const toggle = async () => {
    if (isLocked) return;
    const newRole: UserRole = role === "admin" ? "visitor" : "admin";
    setLoading(true);
    const result = await updateUserRole(profile.id, newRole);
    if (!result.error) {
      setRole(newRole);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading || isLocked}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        ${role === "admin" || role === "superadmin" ? "bg-emerald-500" : "bg-slate-300"}
        ${loading || isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      title={
        isProtectedSuperadmin || role === "superadmin"
          ? "Superadmin protégé"
          : isSelf
            ? "Vous ne pouvez pas modifier votre propre rôle"
            : !canManageRoles
              ? "Seul le superadmin peut gérer les rôles"
              : `Passer à ${role === "admin" ? "Visiteur" : "Admin"}`
      }
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          role === "admin" || role === "superadmin" ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
