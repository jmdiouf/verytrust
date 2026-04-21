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

-- 2. UTILISATEURS (liés aux éditeurs)
CREATE TABLE IF NOT EXISTS users (
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
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE issuers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Certificats : lecture publique
CREATE POLICY "certificates_public_read" ON certificates
  FOR SELECT USING (true);

-- Certificats : écriture uniquement par l'émetteur
CREATE POLICY "certificates_issuer_insert" ON certificates
  FOR INSERT WITH CHECK (
    issuer_id IN (SELECT issuer_id FROM users WHERE id = auth.uid())
  );

-- Vérifications : insertion publique
CREATE POLICY "verifications_public_insert" ON verifications
  FOR INSERT WITH CHECK (true);

-- Users : lecture de son propre profil
CREATE POLICY "users_own_profile" ON users
  FOR ALL USING (id = auth.uid());

-- Issuers : lecture publique
CREATE POLICY "issuers_public_read" ON issuers
  FOR SELECT USING (true);

-- ============================================
-- TRIGGER : créer user profile après signup
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

  INSERT INTO users (id, email, issuer_id, role)
  VALUES (NEW.id, NEW.email, new_issuer_id, 'issuer');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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
