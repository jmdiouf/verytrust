import { createClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes dans .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Plan colors ────────────────────────────────────────────────────────────────

export const PLAN_COLORS = {
  bronze:   { main: '#cd7f32', bg: '#fdf6ee', border: '#e8c8a0', text: '#8b5a1a' },
  silver:   { main: '#3d7a6e', bg: '#f0faf5', border: '#a8d4c8', text: '#2a5040' },
  gold:     { main: '#c9a84c', bg: '#fffbea', border: '#e8d88a', text: '#8b6914' },
  platinum: { main: '#7090b0', bg: '#e8f0f8', border: '#b0c8e0', text: '#2a4060' },
}

export const PLAN_LABELS = {
  bronze:   { fr: 'Associate',        en: 'Associate',       desc_fr: 'Logiciel ou outil certifié VeryTrust' },
  silver:   { fr: 'Certified',        en: 'Certified',       desc_fr: 'Expert-comptable certifié VeryTrust' },
  gold:     { fr: 'Fellow · CAC',     en: 'Fellow · CPA',    desc_fr: 'Commissaire aux Comptes certifié VeryTrust' },
  platinum: { fr: 'Grand Cabinet',    en: 'Grand Firm',      desc_fr: 'Cabinet international certifié VeryTrust' },
}

export const DOC_TYPES = {
  bilan:           { fr: 'Bilan',                      en: 'Balance Sheet' },
  compte_resultat: { fr: 'Compte de résultat',         en: 'Income Statement' },
  audit:           { fr: "Rapport d'audit",            en: 'Audit Report' },
  fiscal:          { fr: 'Déclaration fiscale',        en: 'Tax Return' },
  juridique:       { fr: 'Acte juridique',             en: 'Legal Act' },
  evaluation:      { fr: 'Rapport d\'évaluation',      en: 'Valuation Report' },
  autre:                    { fr: 'Autre document',                          en: 'Other document' },
  etats_financiers_complets: { fr: 'États Financiers Complets',               en: 'Complete Financial Statements' },
  etats_consolides:          { fr: 'États Financiers Consolidés',             en: 'Consolidated Financial Statements' },
  rapport_commissariat:      { fr: 'Rapport de Commissariat aux Comptes',     en: 'Statutory Audit Report' },
  rapport_revue_limitee:     { fr: 'Rapport de Revue Limitée',                en: 'Limited Review Report' },
  declaration_fiscale:       { fr: 'Déclaration Fiscale Annuelle',            en: 'Annual Tax Return' },
  rapport_audit_interne:     { fr: "Rapport d'Audit Interne",                 en: 'Internal Audit Report' },
  evaluation_immobiliere:    { fr: 'Évaluation Immobilière',                  en: 'Real Estate Valuation' },
  acte_juridique:            { fr: 'Acte Juridique',                          en: 'Legal Document' },
}

// ── Helpers ────────────────────────────────────────────────────────────────────

export function generateCertId() {
  const year = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `VT-${year}-${rand(4)}${rand(4)}`
}

export async function hashDocument(data) {
  const text = JSON.stringify(data)
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function formatDate(isoString, lang = 'fr') {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const locale = lang === 'fr' ? 'fr-FR' : 'en-GB'
  return d.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export async function generateQRCode(certId) {
  const url = `https://verytrust.africa/verify/${certId}`
  return QRCode.toDataURL(url, {
    width: 256,
    margin: 2,
    color: { dark: '#0a2828', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
}
