import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateResponsable } from "@/app/actions/responsables";
import { getCurrentProfile } from "@/utils/get-user";
import { Responsable } from "@/types";
import { isAdminRole } from "@/utils/authz";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditResponsablePage({ params }: PageProps) {
  const { id } = await params;

  const profile = await getCurrentProfile();
  if (!profile || !isAdminRole(profile.role)) redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("responsables")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const r = data as Responsable;

  const action = updateResponsable.bind(null, id);

  return (
    <div className="space-y-6 max-w-lg page-enter">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/responsables"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Modifier le responsable</h1>
      </div>

      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6">
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nom complet *
            </label>
            <input
              name="full_name"
              type="text"
              required
              defaultValue={r.full_name}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Poste / Fonction
            </label>
            <input
              name="poste"
              type="text"
              defaultValue={r.poste ?? ""}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={r.email ?? ""}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Téléphone
            </label>
            <input
              name="phone"
              type="tel"
              defaultValue={r.phone ?? ""}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
            >
              Enregistrer
            </button>
            <Link
              href="/admin/responsables"
              className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-600/60 transition-all"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
