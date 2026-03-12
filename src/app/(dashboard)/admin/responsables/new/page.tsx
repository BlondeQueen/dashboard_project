import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createResponsable } from "@/app/actions/responsables";
import { getCurrentProfile } from "@/utils/get-user";
import { redirect } from "next/navigation";

export default async function NewResponsablePage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/dashboard");

  return (
    <div className="space-y-6 max-w-lg page-enter">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/responsables"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Nouveau responsable</h1>
      </div>

      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6">
        <form action={createResponsable} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nom complet *
            </label>
            <input
              name="full_name"
              type="text"
              required
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="Ex: NANFAH Elsa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Poste / Fonction
            </label>
            <input
              name="poste"
              type="text"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="Ex: Chef de projet IT"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="exemple@quitus.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Téléphone
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="+237 6XX XXX XXX"
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
