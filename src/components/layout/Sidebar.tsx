"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";
import { LayoutDashboard, FolderKanban, Users, UserCircle, Settings, X } from "lucide-react";

interface SidebarProps {
  role: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    roles: ["superadmin", "admin", "visitor"] as UserRole[],
  },
  {
    href: "/projects",
    label: "Projets",
    icon: FolderKanban,
    roles: ["superadmin", "admin", "visitor"] as UserRole[],
  },
  {
    href: "/users",
    label: "Mon compte",
    icon: Settings,
    roles: ["superadmin", "admin", "visitor"] as UserRole[],
  },
  {
    href: "/admin/users",
    label: "Utilisateurs",
    icon: Users,
    roles: ["superadmin", "admin"] as UserRole[],
  },
  {
    href: "/admin/responsables",
    label: "Responsables",
    icon: UserCircle,
    roles: ["superadmin", "admin"] as UserRole[],
  },
];

export default function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#0f1c2e] border-r border-slate-100 dark:border-slate-700/40 z-30
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex-shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-700/40">
          <Image
            src="/logo-quitus.png"
            alt="QUITUS"
            width={130}
            height={38}
            className="object-contain dark:brightness-[1.15]"
            priority
          />
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">Menu</p>
        </div>

        <nav className="px-3 space-y-0.5">
          {filteredItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  className={`w-4.5 h-4.5 flex-shrink-0 ${
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom version tag */}
        <div className="absolute bottom-6 left-0 right-0 px-5">
          <p className="text-[10px] text-slate-300 dark:text-slate-600 text-center">QUITUS Dashboard v1.0</p>
        </div>
      </aside>
    </>
  );
}
