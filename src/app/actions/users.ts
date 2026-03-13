"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import { createAdminClient } from "@/utils/supabase/admin";
import { isAdminRole, isSuperadmin, SUPERADMIN_EMAIL } from "@/utils/authz";

function withMessage(path: string, type: "success" | "error", message: string) {
  const params = new URLSearchParams({ [type]: message });
  return `${path}?${params.toString()}`;
}

async function getActorProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}

export async function updateUserRole(
  userId: string,
  newRole: UserRole
): Promise<{ success?: boolean; error?: string }> {
  const { supabase, user, profile } = await getActorProfile();

  if (!profile || !isAdminRole(profile.role)) {
    return { error: "Non autorisé" };
  }

  if (userId === user.id) {
    return { error: "Vous ne pouvez pas modifier votre propre rôle" };
  }

  const { data: target } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", userId)
    .single();

  if (!target) return { error: "Utilisateur introuvable" };

  const actorIsSuperadmin = isSuperadmin(profile.role, profile.email);
  const targetIsProtected = (target.email || "").toLowerCase() === SUPERADMIN_EMAIL;

  if (targetIsProtected && newRole !== "superadmin") {
    return { error: "Le superadmin protégé ne peut pas perdre ses privilèges" };
  }

  if (!actorIsSuperadmin && (newRole === "superadmin" || targetIsProtected || target.role === "superadmin")) {
    return { error: "Seul le superadmin peut gérer ce compte" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateMyCredentials(formData: FormData): Promise<void> {
  const { supabase, user, profile } = await getActorProfile();

  if (!profile) redirect("/login");

  const fullName = ((formData.get("full_name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = ((formData.get("password") as string) || "").trim();

  if (!fullName && !email && !password) {
    redirect(withMessage("/users", "error", "Aucune modification détectée"));
  }

  if (password && password.length < 8) {
    redirect(withMessage("/users", "error", "Le mot de passe doit contenir au moins 8 caractères"));
  }

  const updateAuthPayload: {
    email?: string;
    password?: string;
    data?: { full_name?: string };
  } = {};

  if (email && email !== (profile.email || "").toLowerCase()) {
    updateAuthPayload.email = email;
  }
  if (password) {
    updateAuthPayload.password = password;
  }
  if (fullName && fullName !== (profile.full_name || "")) {
    updateAuthPayload.data = { full_name: fullName };
  }

  if (Object.keys(updateAuthPayload).length > 0) {
    const { error: authError } = await supabase.auth.updateUser(updateAuthPayload);
    if (authError) {
      redirect(withMessage("/users", "error", authError.message));
    }
  }

  const profileUpdate: { full_name?: string; email?: string } = {};
  if (fullName && fullName !== (profile.full_name || "")) profileUpdate.full_name = fullName;
  if (email && email !== (profile.email || "").toLowerCase()) profileUpdate.email = email;

  if (Object.keys(profileUpdate).length > 0) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);

    if (profileError) {
      redirect(withMessage("/users", "error", profileError.message));
    }
  }

  revalidatePath("/users");
  revalidatePath("/dashboard");
  redirect(withMessage("/users", "success", "Informations mises à jour"));
}

export async function updateUserCredentialsBySuperadmin(
  userId: string,
  formData: FormData
): Promise<void> {
  const { supabase, profile } = await getActorProfile();

  if (!profile || !isSuperadmin(profile.role, profile.email)) {
    redirect(withMessage("/admin/users", "error", "Seul le superadmin peut modifier les accès"));
  }

  const { data: target } = await supabase
    .from("profiles")
    .select("id, email, role, full_name")
    .eq("id", userId)
    .single();

  if (!target) {
    redirect(withMessage("/admin/users", "error", "Utilisateur introuvable"));
  }

  const fullName = ((formData.get("full_name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = ((formData.get("password") as string) || "").trim();
  const role = ((formData.get("role") as UserRole) || target.role) as UserRole;

  const targetIsProtected = (target.email || "").toLowerCase() === SUPERADMIN_EMAIL;
  if (targetIsProtected && role !== "superadmin") {
    redirect(withMessage("/admin/users", "error", "Le superadmin protégé ne peut pas être rétrogradé"));
  }

  if (password && password.length < 8) {
    redirect(withMessage("/admin/users", "error", "Le mot de passe doit contenir au moins 8 caractères"));
  }

  const adminClient = createAdminClient();

  const authUpdatePayload: {
    email?: string;
    password?: string;
    user_metadata?: { full_name?: string };
  } = {};

  if (email && email !== (target.email || "").toLowerCase()) authUpdatePayload.email = email;
  if (password) authUpdatePayload.password = password;
  if (fullName && fullName !== (target.full_name || "")) {
    authUpdatePayload.user_metadata = { full_name: fullName };
  }

  if (Object.keys(authUpdatePayload).length > 0) {
    const { error: authAdminError } = await adminClient.auth.admin.updateUserById(userId, authUpdatePayload);
    if (authAdminError) {
      redirect(withMessage("/admin/users", "error", authAdminError.message));
    }
  }

  const profileUpdate: { full_name?: string; email?: string; role?: UserRole } = { role };
  if (fullName) profileUpdate.full_name = fullName;
  if (email) profileUpdate.email = email;

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", userId);

  if (profileError) {
    redirect(withMessage("/admin/users", "error", profileError.message));
  }

  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  redirect(withMessage("/admin/users", "success", "Compte utilisateur mis à jour"));
}

export async function createUserBySuperadmin(formData: FormData): Promise<void> {
  const { supabase, profile } = await getActorProfile();

  if (!profile || !isSuperadmin(profile.role, profile.email)) {
    redirect(withMessage("/admin/users", "error", "Seul le superadmin peut créer des utilisateurs"));
  }

  const fullName = ((formData.get("full_name") as string) || "").trim();
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const password = ((formData.get("password") as string) || "").trim();
  const role = ((formData.get("role") as UserRole) || "visitor") as UserRole;

  if (!email || !password) {
    redirect(withMessage("/admin/users", "error", "Email et mot de passe sont obligatoires"));
  }

  if (password.length < 8) {
    redirect(withMessage("/admin/users", "error", "Le mot de passe doit contenir au moins 8 caractères"));
  }

  if (!["visitor", "admin", "superadmin"].includes(role)) {
    redirect(withMessage("/admin/users", "error", "Rôle invalide"));
  }

  const finalRole: UserRole = email === SUPERADMIN_EMAIL ? "superadmin" : role;
  const adminClient = createAdminClient();

  const { data: created, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (createError || !created.user) {
    redirect(withMessage("/admin/users", "error", createError?.message || "Création impossible"));
  }

  const displayName = fullName || email.split("@")[0];
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email,
      full_name: displayName,
      role: finalRole,
    })
    .eq("id", created.user.id);

  if (profileError) {
    await adminClient.auth.admin.deleteUser(created.user.id);
    redirect(withMessage("/admin/users", "error", profileError.message));
  }

  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  redirect(withMessage("/admin/users", "success", "Utilisateur créé"));
}

export async function deleteUserBySuperadmin(userId: string): Promise<void> {
  const { supabase, user, profile } = await getActorProfile();

  if (!profile || !isSuperadmin(profile.role, profile.email)) {
    redirect(withMessage("/admin/users", "error", "Seul le superadmin peut supprimer des utilisateurs"));
  }

  if (userId === user.id) {
    redirect(withMessage("/admin/users", "error", "Vous ne pouvez pas supprimer votre propre compte"));
  }

  const { data: target } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", userId)
    .single();

  if (!target) {
    redirect(withMessage("/admin/users", "error", "Utilisateur introuvable"));
  }

  if ((target.email || "").toLowerCase() === SUPERADMIN_EMAIL) {
    redirect(withMessage("/admin/users", "error", "Le superadmin protégé ne peut pas être supprimé"));
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    redirect(withMessage("/admin/users", "error", error.message));
  }

  revalidatePath("/admin/users");
  revalidatePath("/dashboard");
  redirect(withMessage("/admin/users", "success", "Utilisateur supprimé"));
}
