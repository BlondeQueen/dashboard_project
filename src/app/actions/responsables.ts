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

  if (!profile || profile.role !== "admin") redirect("/dashboard");
  return { supabase };
}

export async function createResponsable(formData: FormData): Promise<void> {
  const { supabase } = await checkAdmin();

  const full_name = (formData.get("full_name") as string).trim();
  const email = (formData.get("email") as string) || null;
  const poste = (formData.get("poste") as string) || null;
  const phone = (formData.get("phone") as string) || null;

  if (!full_name) throw new Error("Le nom est requis");

  const { error } = await supabase
    .from("responsables")
    .insert({ full_name, email, poste, phone });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/responsables");
  redirect("/admin/responsables");
}

export async function updateResponsable(
  id: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await checkAdmin();

  const full_name = (formData.get("full_name") as string).trim();
  const email = (formData.get("email") as string) || null;
  const poste = (formData.get("poste") as string) || null;
  const phone = (formData.get("phone") as string) || null;

  if (!full_name) throw new Error("Le nom est requis");

  const { error } = await supabase
    .from("responsables")
    .update({ full_name, email, poste, phone })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/responsables");
  redirect("/admin/responsables");
}

export async function deleteResponsable(id: string): Promise<void> {
  const { supabase } = await checkAdmin();

  const { error } = await supabase
    .from("responsables")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/responsables");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}
