-- ============================================
-- VERYTRUST — SCHEMA SUPABASE COMPLET
-- Coller dans : Supabase > SQL Editor > Run
-- ============================================

-- 1. ÉDITEURS CERTIFIÉS
CREATE TABLE IF NOT EXISTS issuers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  api_key TEXT UNIQUE NOT NULL DEFAULT concat('VT_KEY_', upper(substring(gen_random_uuid()::text, 1, 12))),
  plan TEXT DEFAULT 'bronze' CHECK (plan IN ('bronze','silver','gold','platinum')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILS UTILISATEURS (liés aux éditeurs)
-- Note: table nommée "profiles" pour correspondre au code frontend
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'issuer' CHECK (role IN ('issuer','reviewer','admin')),
  issuer_id UUID REFERENCES issuers(id),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CERTIFICATS
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  issuer_id UUID REFERENCES issuers(id),
  document_type TEXT,
  entity_name TEXT NOT NULL,
  entity_ref TEXT,
  referentiel TEXT,
  fiscal_year TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  signature TEXT,
  seal_svg TEXT,
  metadata JSONB DEFAULT '{}',
  is_valid BOOLEAN DEFAULT TRUE
);

-- 4. LOGS DE VÉRIFICATION
CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT REFERENCES certificates(id),
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- FONCTION HELPER : vérifier le rôle admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_own_issuer(iid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND issuer_id = iid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE issuers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- ── ISSUERS ───────────────────────────────────────────────────────────────────

-- Lecture publique (pour la vérification et le dashboard)
CREATE POLICY "issuers_public_read" ON issuers
  FOR SELECT USING (true);

-- Modification réservée aux admins
CREATE POLICY "issuers_admin_write" ON issuers
  FOR ALL USING (is_admin());

-- ── PROFILES ──────────────────────────────────────────────────────────────────

-- Lecture et modification de son propre profil
CREATE POLICY "profiles_own" ON profiles
  FOR ALL USING (id = auth.uid());

-- Lecture et modification par les admins (pour la gestion des rôles)
CREATE POLICY "profiles_admin_all" ON profiles
  FOR ALL USING (is_admin());

-- ── CERTIFICATES ──────────────────────────────────────────────────────────────

-- Lecture publique (pour la vérification)
CREATE POLICY "certificates_public_read" ON certificates
  FOR SELECT USING (true);

-- Insertion uniquement par l'émetteur propriétaire
CREATE POLICY "certificates_issuer_insert" ON certificates
  FOR INSERT WITH CHECK (is_own_issuer(issuer_id));

-- Mise à jour (invalidation) réservée aux admins
CREATE POLICY "certificates_admin_update" ON certificates
  FOR UPDATE USING (is_admin());

-- ── VERIFICATIONS ─────────────────────────────────────────────────────────────

-- Insertion publique (toute personne peut déclencher une vérification)
CREATE POLICY "verifications_public_insert" ON verifications
  FOR INSERT WITH CHECK (true);

-- Lecture réservée aux admins (les logs contiennent des IPs)
CREATE POLICY "verifications_admin_read" ON verifications
  FOR SELECT USING (is_admin());

-- ============================================
-- TRIGGER : créer le profil après signup
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_issuer_id UUID;
BEGIN
  INSERT INTO issuers (name, domain, plan)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'org_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'domain', ''),
    COALESCE(NEW.raw_user_meta_data->>'plan', 'bronze')
  )
  RETURNING id INTO new_issuer_id;

  INSERT INTO profiles (id, email, issuer_id, role)
  VALUES (NEW.id, NEW.email, new_issuer_id, 'issuer');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- MIGRATION : VALIDATION COMPTES PROFESSIONNELS
-- À exécuter dans Supabase > SQL Editor
-- ============================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending_documents',
  ADD COLUMN IF NOT EXISTS document_url TEXT,
  ADD COLUMN IF NOT EXISTS document_type TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS validated_by UUID;

-- Marquer les comptes admin existants comme actifs
UPDATE users SET status = 'active' WHERE role = 'admin';

-- ============================================
-- STORAGE : BUCKET "documents"
-- Créer le bucket dans Supabase > Storage > New bucket
-- Nom : documents  |  Public : true
-- Puis exécuter les policies ci-dessous :
-- ============================================

-- Permettre aux utilisateurs authentifiés d'uploader dans documents/
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "auth_users_upload_docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "public_read_docs" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "auth_users_update_docs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- MIGRATION : PROFILS PUBLICS UTILISATEURS
-- À exécuter dans Supabase > SQL Editor
-- ============================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
                  ADD COLUMN IF NOT EXISTS bio TEXT,
                  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
                  ADD COLUMN IF NOT EXISTS website_url TEXT,
                  ADD COLUMN IF NOT EXISTS photo_url TEXT,
                  ADD COLUMN IF NOT EXISTS is_profile_public BOOLEAN DEFAULT true;

UPDATE users
SET slug = LOWER(REGEXP_REPLACE(REPLACE(REPLACE(nom_affiche, ' ', '-'), '.', ''), '[^a-z0-9-]', '', 'g'))
WHERE slug IS NULL AND nom_affiche IS NOT NULL;

-- ============================================
-- DONNÉES DE TEST
-- ============================================

INSERT INTO issuers (name, domain, api_key, plan)
VALUES ('FINETA by Vallion', 'fineta.vercel.app', 'VT_KEY_FINETA_2026', 'gold')
ON CONFLICT DO NOTHING;

INSERT INTO certificates (id, issuer_id, document_type, entity_name, entity_ref, referentiel, fiscal_year, is_valid)
VALUES (
  'VT-2026-A3B7C2D1',
  (SELECT id FROM issuers WHERE name = 'FINETA by Vallion'),
  'bilan', 'Vallion SA', 'SN-DKR-2024-B-12345', 'SYSCOHADA', '2024', true
)
ON CONFLICT DO NOTHING;
