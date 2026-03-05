"use client";

import { signOut } from "@/app/actions/auth";
import { UserRole } from "@/types";
import { LogOut, User } from "lucide-react";

interface HeaderProps {
  fullName: string | null;
  email: string;
  role: UserRole;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrateur",
  visitor: "Visiteur",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-indigo-100 text-indigo-700",
  visitor: "bg-gray-100 text-gray-700",
};

export default function Header({ fullName, email, role }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {fullName || email}
            </p>
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </form>
      </div>
    </header>
  );
}
