# QUITUS Dashboard

Tableau de bord de gestion de portefeuille de projets (PPM) — construit avec **Next.js 15** et **Supabase**.

## Fonctionnalités

- **Authentification** sécurisée via Supabase Auth (email / mot de passe)
- **Deux rôles** : `Admin` (CRUD complet) et `Visiteur` (lecture seule)
- **Tableau de bord** avec KPIs (total, en cours, terminés, en retard) et graphiques (Recharts)
- **Gestion des projets** : création, modification, suppression, filtres par statut et type
- **Gestion des utilisateurs** : bascule de rôle admin/visiteur
- **Interface responsive** avec sidebar et navigation mobile

## Stack technique

| Technologie | Rôle |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework React (App Router, Server Components, Server Actions) |
| [Supabase](https://supabase.com/) | Base de données PostgreSQL + authentification |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styles |
| [Recharts](https://recharts.org/) | Graphiques (BarChart, PieChart) |
| [Lucide React](https://lucide.dev/) | Icônes |
| TypeScript | Typage statique |

## Prérequis

- Node.js **≥ 20.9.0** (recommandé : via [nvm](https://github.com/nvm-sh/nvm))
- Un projet [Supabase](https://supabase.com/) actif

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/BlondeQueen/dashboard_project.git
cd dashboard_project

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Puis éditer .env.local avec vos credentials Supabase
```

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

## Configuration de la base de données

Exécuter le fichier `supabase/schema.sql` dans l'éditeur SQL de votre projet Supabase.

Ce script crée :
- La table **`profiles`** (liée à `auth.users`)
- La table **`projects`**
- La table **`project_members`**
- Les triggers (création automatique du profil, mise à jour de `updated_at`)
- Les policies **Row Level Security** (RLS)

Après exécution, créer un premier utilisateur admin via le dashboard Supabase :

```sql
-- Donner le rôle admin à un utilisateur existant
UPDATE profiles SET role = 'admin' WHERE email = 'votre@email.com';
```

## Lancement en développement

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm start
```

## Structure du projet

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Page de connexion
│   ├── (dashboard)/
│   │   ├── dashboard/      # Tableau de bord KPI + graphiques
│   │   ├── projects/       # Liste, détail, création, modification
│   │   └── admin/users/    # Gestion des utilisateurs (admin)
│   └── actions/            # Server Actions (auth, projects, users)
├── components/
│   ├── admin/              # RoleToggle
│   ├── charts/             # StatusBarChart, TypePieChart
│   ├── layout/             # Sidebar, Header, DashboardShell
│   ├── projects/           # ProjectForm, ProjectFilters, DeleteProjectButton
│   └── ui/                 # StatusBadge, ProgressBar, KpiCard
├── types/                  # Types TypeScript partagés
└── utils/supabase/         # Clients Supabase (browser, server, middleware)
supabase/
└── schema.sql              # Schéma complet de la base de données
```

## Rôles et permissions

| Action | Admin | Visiteur |
|---|:---:|:---:|
| Voir le tableau de bord | ✅ | ✅ |
| Voir la liste des projets | ✅ | ✅ |
| Voir le détail d'un projet | ✅ | ✅ |
| Créer / modifier un projet | ✅ | ❌ |
| Supprimer un projet | ✅ | ❌ |
| Gérer les utilisateurs | ✅ | ❌ |
