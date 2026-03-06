import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ProjectForm from "@/components/projects/ProjectForm";
import { updateProject } from "@/app/actions/projects";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
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

  const [{ data: project }, { data: profiles }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("profiles").select("*"),
  ]);

  if (!project) notFound();

  const action = updateProject.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl page-enter">
      <div className="flex items-center gap-4">
        <Link href={`/projects/${id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Modifier le projet</h1>
      </div>

      <div className="bg-white rounded-2xl card-shadow p-6">
        <ProjectForm
          action={action}
          initialData={project}
          profiles={profiles || []}
        />
      </div>
    </div>
  );
}
