"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/users";
import { Profile, UserRole } from "@/types";

interface RoleToggleProps {
  profile: Profile;
  currentUserId: string;
}

export default function RoleToggle({ profile, currentUserId }: RoleToggleProps) {
  const [role, setRole] = useState<UserRole>(profile.role);
  const [loading, setLoading] = useState(false);

  const isSelf = profile.id === currentUserId;

  const toggle = async () => {
    if (isSelf) return;
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
      disabled={loading || isSelf}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        ${role === "admin" ? "bg-indigo-600" : "bg-gray-300"}
        ${loading || isSelf ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      title={isSelf ? "Vous ne pouvez pas modifier votre propre rôle" : `Passer à ${role === "admin" ? "Visiteur" : "Admin"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          role === "admin" ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
