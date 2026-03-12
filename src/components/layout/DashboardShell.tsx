"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { UserRole } from "@/types";
import { Menu } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
  role: UserRole;
  fullName: string | null;
  email: string;
}

export default function DashboardShell({
  children,
  role,
  fullName,
  email,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0a1221] overflow-hidden transition-colors duration-300">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between lg:hidden h-16 px-4 bg-white dark:bg-[#0f1c2e] border-b border-slate-100 dark:border-slate-700/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Header fullName={fullName} email={email} role={role} />
        </div>
        <div className="hidden lg:block">
          <Header fullName={fullName} email={email} role={role} />
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
