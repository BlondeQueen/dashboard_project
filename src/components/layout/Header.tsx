"use client";

import { signOut } from "@/app/actions/auth";
import { UserRole } from "@/types";
import { LogOut } from "lucide-react";

interface HeaderProps {
  fullName: string | null;
  email: string;
  role: UserRole;
}

const ROLE_CONFIG: Record<UserRole, { label: string; dot: string; badge: string }> = {
  admin:   { label: "Administrateur", dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
  visitor: { label: "Visiteur",       dot: "bg-slate-400",   badge: "bg-slate-100  text-slate-600"  },
};

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  }
  return email[0].toUpperCase();
}

export default function Header({ fullName, email, role }: HeaderProps) {
  const cfg = ROLE_CONFIG[role];
  const initials = getInitials(fullName, email);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Left — page context placeholder */}
      <div />

      {/* Right — user info + logout */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-200 flex-shrink-0">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>

        {/* Name + role badge */}
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {fullName || email}
          </p>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Logout */}
        <form action={signOut}>
          <button
            type="submit"
            title="Déconnexion"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Déconnexion</span>
          </button>
        </form>
      </div>
    </header>
  );
}
