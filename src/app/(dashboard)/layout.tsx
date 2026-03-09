import { redirect } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { getCurrentUser, getCurrentProfile } from "@/utils/get-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile(),
  ]);

  if (!user || !profile) {
    redirect("/login");
  }

  return (
    <DashboardShell
      role={profile.role}
      fullName={profile.full_name}
      email={user.email || ""}
    >
      {children}
    </DashboardShell>
  );
}
