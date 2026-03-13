import { redirect } from "next/navigation";
import { getCurrentProfile, getCurrentUser } from "@/utils/get-user";
import { updateMyCredentials } from "@/app/actions/users";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ success?: string; error?: string }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()]);

  if (!user || !profile) redirect("/login");

  return (
    <div className="space-y-6 max-w-2xl page-enter">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mon compte</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Modifiez vos informations de connexion
        </p>
      </div>

      {params.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
          {params.success}
        </div>
      )}

      {params.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
          {params.error}
        </div>
      )}

      <div className="bg-white dark:bg-[#0f1c2e] rounded-2xl card-shadow border border-slate-100/50 dark:border-slate-700/30 p-6">
        <form action={updateMyCredentials} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nom complet
            </label>
            <input
              name="full_name"
              type="text"
              defaultValue={profile.full_name || ""}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="Ex: NANFAH Elsa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Adresse email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={profile.email}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nouveau mot de passe
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              placeholder="Laisser vide pour ne pas modifier"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Minimum 8 caractères.</p>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
          >
            Enregistrer mes modifications
          </button>
        </form>
      </div>
    </div>
  );
}
