"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function checkAdmin() {
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

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }
  return { supabase, user };
}

export async function createProject(formData: FormData): Promise<void> {
  const { supabase, user } = await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const type = formData.get("type") as string;
  const progress = parseInt(formData.get("progress") as string) || 0;
  const budget = formData.get("budget")
    ? parseFloat(formData.get("budget") as string)
    : null;
  const budget_consumed = formData.get("budget_consumed")
    ? parseFloat(formData.get("budget_consumed") as string)
    : null;
  const start_date = (formData.get("start_date") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const owner_id = (formData.get("owner_id") as string) || user.id;
  const responsable_id = (formData.get("responsable_id") as string) || null;
  const github_url = (formData.get("github_url") as string) || null;
  const gitlab_url = (formData.get("gitlab_url") as string) || null;
  const app_url = (formData.get("app_url") as string) || null;
  const memberIds = formData.getAll("members") as string[];

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name,
      description: description || null,
      status,
      type,
      progress,
      budget,
      budget_consumed,
      start_date,
      end_date,
      owner_id,
      responsable_id,
      github_url,
      gitlab_url,
      app_url,
    })
    .select()
    .single();

  if (error || !project) {
    throw new Error(error?.message || "Failed to create project");
  }

  if (memberIds.length > 0) {
    await supabase.from("project_members").insert(
      memberIds.map((uid) => ({
        project_id: project.id,
        user_id: uid,
      }))
    );
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await checkAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const type = formData.get("type") as string;
  const progress = parseInt(formData.get("progress") as string) || 0;
  const budget = formData.get("budget")
    ? parseFloat(formData.get("budget") as string)
    : null;
  const budget_consumed = formData.get("budget_consumed")
    ? parseFloat(formData.get("budget_consumed") as string)
    : null;
  const start_date = (formData.get("start_date") as string) || null;
  const end_date = (formData.get("end_date") as string) || null;
  const owner_id = (formData.get("owner_id") as string) || null;
  const responsable_id = (formData.get("responsable_id") as string) || null;
  const github_url = (formData.get("github_url") as string) || null;
  const gitlab_url = (formData.get("gitlab_url") as string) || null;
  const app_url = (formData.get("app_url") as string) || null;
  const memberIds = formData.getAll("members") as string[];

  const { error } = await supabase
    .from("projects")
    .update({
      name,
      description: description || null,
      status,
      type,
      progress,
      budget,
      budget_consumed,
      start_date,
      end_date,
      owner_id,
      responsable_id,
      github_url,
      gitlab_url,
      app_url,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  // Auto-log the update (best-effort, no await needed for UX)
  try {
    await supabase.from("activity_logs").insert({
      project_id: id,
      user_id: (await supabase.auth.getUser()).data.user?.id ?? null,
      action: "updated",
      detail: `Statut: ${status} · Avancement: ${progress}%`,
    });
  } catch {
    // non-blocking
  }

  // Replace members
  await supabase.from("project_members").delete().eq("project_id", id);
  if (memberIds.length > 0) {
    await supabase.from("project_members").insert(
      memberIds.map((uid) => ({
        project_id: id,
        user_id: uid,
      }))
    );
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/dashboard");
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string): Promise<void> {
  const { supabase } = await checkAdmin();

  await supabase.from("project_members").delete().eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}
