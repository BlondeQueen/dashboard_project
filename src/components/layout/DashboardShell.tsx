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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-auto">
        <div className="flex items-center lg:hidden h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        <div className="hidden lg:block">
          <Header fullName={fullName} email={email} role={role} />
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
