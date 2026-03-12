import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Responsable } from "@/types";
import { deleteResponsable } from "@/app/actions/responsables";
import { UserCircle, Plus, Pencil, Trash2, Mail, Phone, Briefcase } from "lucide-react";
import { getCurrentProfile } from "@/utils/get-user";

export const dynamic = "force-dynamic";

async function DeleteButton({ id }: { id: string }) {
  const action = deleteResponsable.bind(null, id);
  return (
    <form action={action}>
      <button
        type="submit"
        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  );
}

export default async function ResponsablesPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();
  const { data } = await supabase
    .from("responsables")
    .select("*")
    .order("full_name");

  const responsables = (data || []) as Responsable[];

  return (
    <div className="space-y-6 max-w-4xl page-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Responsables</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {responsables.length} responsable{responsables.length !== 1 ? "s" : ""} enregistré{responsables.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/responsables/new"
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 overflow-hidden">
        {responsables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <UserCircle className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold">Aucun responsable</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Ajoutez des chefs de projet qui pourront être assignés aux projets
            </p>
            <Link
              href="/admin/responsables/new"
              className="mt-4 flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un responsable
            </Link>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-slate-100 dark:border-slate-700/40">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Nom</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Poste</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Contact</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Actions</span>
            </div>

            <div className="divide-y divide-slate-50 dark:divide-slate-700/30">
              {responsables.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50/60 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Nom */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                      {r.full_name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{r.full_name}</p>
                  </div>

                  {/* Poste */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {r.poste ? (
                      <>
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{r.poste}</span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="space-y-0.5 min-w-0">
                    {r.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.email}</span>
                      </div>
                    )}
                    {r.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">{r.phone}</span>
                      </div>
                    )}
                    {!r.email && !r.phone && (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/responsables/${r.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={r.id} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
