-- =============================================
-- PPM Dashboard - Supabase Schema (Version fusionnée & optimisée)
-- À exécuter dans Supabase Dashboard > SQL Editor
-- =============================================

-- =============================================
-- EXTENSIONS
-- =============================================
-- gen_random_uuid() est natif en PostgreSQL 14+, pas besoin d'extension uuid-ossp
-- On garde uuid-ossp uniquement si la version Supabase est ancienne
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: profiles
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  role        TEXT NOT NULL DEFAULT 'visitor'
              CHECK (role IN ('superadmin', 'admin', 'visitor')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MIGRATION: activer le rôle superadmin (si table existante)
-- =============================================
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE public.profiles
--   ADD CONSTRAINT profiles_role_check CHECK (role IN ('superadmin', 'admin', 'visitor'));
-- UPDATE public.profiles SET role = 'superadmin' WHERE email = 'admin@qps.net';

-- =============================================
-- TABLE: responsables
-- =============================================
CREATE TABLE IF NOT EXISTS public.responsables (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name  TEXT NOT NULL,
  email      TEXT,
  poste      TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.responsables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "responsables_select" ON public.responsables;
CREATE POLICY "responsables_select"
  ON public.responsables FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "responsables_insert_admin" ON public.responsables;
CREATE POLICY "responsables_insert_admin"
  ON public.responsables FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

DROP POLICY IF EXISTS "responsables_update_admin" ON public.responsables;
CREATE POLICY "responsables_update_admin"
  ON public.responsables FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

DROP POLICY IF EXISTS "responsables_delete_admin" ON public.responsables;
CREATE POLICY "responsables_delete_admin"
  ON public.responsables FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin')));

-- =============================================
-- TABLE: projects
-- =============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT,
  status           TEXT NOT NULL DEFAULT 'planned'
                   CHECK (status IN ('planned', 'in_progress', 'completed', 'delayed', 'suspended')),
  type             TEXT NOT NULL DEFAULT 'web'
                   CHECK (type IN ('web', 'mobile', 'web_mobile')),
  progress         INTEGER NOT NULL DEFAULT 0
                   CHECK (progress >= 0 AND progress <= 100),
  budget           NUMERIC(15, 2),
  budget_consumed  NUMERIC(15, 2),
  start_date       DATE,
  end_date         DATE,
  owner_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  responsable_id   UUID REFERENCES public.responsables(id) ON DELETE SET NULL,
  github_url       TEXT,
  gitlab_url       TEXT,
  app_url          TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- MIGRATION: Ajouter les colonnes URL (si table déjà existante)
-- À exécuter dans Supabase Dashboard > SQL Editor
-- =============================================
-- ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url TEXT;
-- ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gitlab_url TEXT;
-- ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS app_url TEXT;

-- =============================================
-- TABLE: project_members
-- =============================================
CREATE TABLE IF NOT EXISTS public.project_members (
  project_id  UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, user_id)
);

-- =============================================
-- TRIGGER 1: auto-créer un profil à l'inscription
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    -- Utilise full_name si fourni, sinon extrait la partie avant @ de l'email
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'visitor'
  )
  ON CONFLICT (id) DO NOTHING; -- Évite les doublons en cas de rejeu
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER 2: auto-mettre à jour updated_at sur projects
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.projects;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- ----------------------------
-- Policies: profiles
-- ----------------------------

-- Tout utilisateur connecté peut lire les profils
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Un utilisateur peut modifier son propre profil
DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Un admin peut modifier n'importe quel profil
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- ----------------------------
-- Policies: projects
-- ----------------------------

-- Tout utilisateur connecté peut lire les projets
DROP POLICY IF EXISTS "projects_select" ON public.projects;
CREATE POLICY "projects_select"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les admins peuvent créer un projet
DROP POLICY IF EXISTS "projects_insert_admin" ON public.projects;
CREATE POLICY "projects_insert_admin"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Seuls les admins peuvent modifier un projet
DROP POLICY IF EXISTS "projects_update_admin" ON public.projects;
CREATE POLICY "projects_update_admin"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Seuls les admins peuvent supprimer un projet
DROP POLICY IF EXISTS "projects_delete_admin" ON public.projects;
CREATE POLICY "projects_delete_admin"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- ----------------------------
-- Policies: project_members
-- ----------------------------

-- Tout utilisateur connecté peut voir les membres
DROP POLICY IF EXISTS "project_members_select" ON public.project_members;
CREATE POLICY "project_members_select"
  ON public.project_members FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les admins peuvent ajouter des membres
DROP POLICY IF EXISTS "project_members_insert_admin" ON public.project_members;
CREATE POLICY "project_members_insert_admin"
  ON public.project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Seuls les admins peuvent supprimer des membres
DROP POLICY IF EXISTS "project_members_delete_admin" ON public.project_members;
CREATE POLICY "project_members_delete_admin"
  ON public.project_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- =============================================
-- TABLE: activity_logs
-- =============================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL
              CHECK (action IN ('created', 'updated', 'status_change', 'comment')),
  detail      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_project
  ON public.activity_logs (project_id, created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur connecté peut lire les logs
DROP POLICY IF EXISTS "activity_logs_select" ON public.activity_logs;
CREATE POLICY "activity_logs_select"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Un utilisateur connecté peut insérer ses propres logs (ou logs système sans user)
DROP POLICY IF EXISTS "activity_logs_insert" ON public.activity_logs;
CREATE POLICY "activity_logs_insert"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
