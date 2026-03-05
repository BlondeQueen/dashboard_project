import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/projects/ProjectForm";
import { createProject } from "@/app/actions/projects";
import { ArrowLeft } from "lucide-react";

export default async function NewProjectPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/projects");

  const { data: profiles } = await supabase.from("profiles").select("*");

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/projects" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau projet</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProjectForm action={createProject} profiles={profiles || []} />
      </div>
    </div>
  );
}
