import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useIsMobile } from '../hooks/useIsMobile'
import { supabase, generateCertId, hashDocument, formatDate, PLAN_COLORS, DOC_TYPES, generateQRCode } from '../lib/supabase'
import { LogoTeal } from '../components/Logo'
import { BadgeSVG, generateSealSVG, generateRichSealSVG } from '../components/Badge'

const NAV_ITEMS = [
  { key: 'overview', labelKey: 'nav_overview', icon: '◉' },
  { key: 'certificates', labelKey: 'nav_my_certs', icon: '◧' },
  { key: 'new', labelKey: 'nav_new_cert', icon: '+' },
  { key: 'api', labelKey: 'nav_api_keys', icon: '⌘' },
  { key: 'profile', labelKey: 'nav_profile', icon: '◈' },
]

export default function Dashboard() {
  const { user, profile, signOut, loading: authLoading, twoFactorVerified } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [certs, setCerts] = useState([])
  const [stats, setStats] = useState({ total: 0, verifications: 0 })
  const [loadingCerts, setLoadingCerts] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/login'); return }
    if (profile?.two_factor_enabled && !twoFactorVerified) navigate('/verify-2fa')
  }, [user, authLoading, profile, twoFactorVerified])

  useEffect(() => {
    if (profile?.issuer_id) fetchData()
  }, [profile])

  async function fetchData() {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .eq('issuer_id', profile.issuer_id)
      .order('issued_at', { ascending: false })
    setCerts(data || [])
    setStats({ total: data?.length || 0, verifications: 0 })
    setLoadingCerts(false)
  }

  function selectTab(key) {
    setTab(key)
    setSidebarOpen(false)
  }

  const plan = profile?.issuers?.plan || 'bronze'
  const pc = PLAN_COLORS[plan] || PLAN_COLORS.bronze

  if (authLoading) return <div className="page-center"><div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 32, height: 32 }} /></div>

  const Sidebar = (
    <aside
      className={isMobile ? `dash-sidebar-overlay${sidebarOpen ? ' open' : ''}` : ''}
      style={{ width: 240, background: '#0a2828', display: 'flex', flexDirection: 'column', padding: '24px 0', position: isMobile ? 'fixed' : 'sticky', top: 0, height: '100vh', flexShrink: 0, zIndex: isMobile ? 200 : 'auto', transition: 'transform 0.25s ease' }}
    >
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <LogoTeal size={32} light={true} />
      </div>
      <nav style={{ flex: 1, padding: '20px 12px' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.key} onClick={() => selectTab(item.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: tab === item.key ? 'rgba(13,143,143,0.2)' : 'transparent', color: tab === item.key ? '#0d8f8f' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: tab === item.key ? 600 : 400, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'left', marginBottom: 4, transition: 'all 0.2s' }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {t(item.labelKey)}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{t('dash_connected_as')}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        </div>
        <button onClick={signOut} style={{ width: '100%', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>{t('logout')}</button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fefe' }}>
      {/* Backdrop (mobile only) */}
      {isMobile && (
        <div className={`dash-backdrop${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      )}

      {Sidebar}

      {/* Main */}
      <main style={{ flex: 1, padding: isMobile ? '20px 16px' : '32px 40px', overflowY: 'auto', minWidth: 0 }}>
        {/* Mobile header */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e8f4f4' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: '1px solid #d4eded', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 }}
              aria-label="Menu"
            >
              {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 18, height: 2, background: '#0a2828', borderRadius: 2 }} />)}
            </button>
            <LogoTeal size={24} />
          </div>
        )}

        {tab === 'overview' && <OverviewTab stats={stats} certs={certs} plan={plan} pc={pc} profile={profile} />}
        {tab === 'certificates' && <CertificatesTab certs={certs} loading={loadingCerts} />}
        {tab === 'new' && <NewCertTab profile={profile} onSuccess={() => { fetchData(); setTab('certificates') }} />}
        {tab === 'api' && <ApiTab profile={profile} />}
        {tab === 'profile' && <ProfileTab profile={profile} user={user} />}
      </main>
    </div>
  )
}

function OverviewTab({ stats, certs, plan, pc, profile }) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 24 : 30, fontWeight: 900, color: '#0a2828', marginBottom: 4 }}>{t('dash_title')}</h1>
        <p style={{ fontSize: 14, color: '#6a9090' }}>{t('dash_welcome', { name: profile?.issuers?.name || 'Organisation' })}</p>
      </div>

      {/* Plan badge */}
      <div style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
        <BadgeSVG plan={plan} size={isMobile ? 52 : 72} />
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: pc.text, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{t('dash_cert_level')}</div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 17 : 22, fontWeight: 900, color: pc.text }}>{plan.toUpperCase()} · VeryTrust</div>
          <div style={{ fontSize: 12, color: pc.text, opacity: 0.7, marginTop: 4 }}>{t('dash_domain')} {profile?.issuers?.domain || '—'}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: t('dash_certs_issued'), value: stats.total, icon: '◧' },
          { label: t('dash_verifications'), value: stats.verifications, icon: '🔍' },
          { label: t('dash_active_level'), value: plan.toUpperCase(), icon: '◆' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0d8f8f', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8aadad' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent certs */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a2828', marginBottom: 16 }}>{t('dash_recent_certs')}</h3>
        {certs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>{t('dash_no_certs')}</div>
        ) : (
          certs.slice(0, 5).map(c => <CertRow key={c.id} cert={c} />)
        )}
      </div>
    </div>
  )
}

function CertificatesTab({ certs, loading }) {
  const { t } = useTranslation()
  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_my_certs')}</h1>
      <div className="card">
        {loading ? <div style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 24, height: 24, margin: '0 auto' }} /></div>
          : certs.length === 0 ? <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>{t('dash_no_certs_yet')}</div>
          : certs.map(c => <CertRow key={c.id} cert={c} showCopy />)
        }
      </div>
    </div>
  )
}

function CertRow({ cert, showCopy }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  function copyUrl() {
    navigator.clipboard.writeText(`https://verytrust.africa/verify/${cert.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
      <BadgeSVG plan="bronze" size={36} />
      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2828' }}>{cert.entity_name}</div>
        <div style={{ fontSize: 11, color: '#8aadad' }}>{DOC_TYPES[cert.document_type]?.fr || cert.document_type} · {cert.fiscal_year}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#0d8f8f', marginBottom: 2 }}>{cert.id}</div>
        <div style={{ fontSize: 10, color: '#8aadad' }}>{formatDate(cert.issued_at, 'fr').split(' à')[0]}</div>
      </div>
      <a href={`/verify/${cert.id}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#0d8f8f', fontWeight: 600, padding: '5px 12px', border: '1px solid #a8dede', borderRadius: 6, textDecoration: 'none' }}>{t('verify_btn')}</a>
      {showCopy && (
        <button onClick={copyUrl} style={{ fontSize: 11, color: copied ? '#0d8f8f' : '#8aadad', padding: '5px 10px', border: '1px solid #d4eded', borderRadius: 6, background: 'white', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
          {copied ? '✓' : '⎘'}
        </button>
      )}
    </div>
  )
}

function NewCertTab({ profile, onSuccess }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ entityName: '', entityRef: '', documentType: 'bilan', referentiel: 'SYSCOHADA', fiscalYear: new Date().getFullYear().toString() })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [richSealSvg, setRichSealSvg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [sealCopied, setSealCopied] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const certId = generateCertId()
      const issuedAt = new Date().toISOString()
      const signature = await hashDocument({ ...form, certId, issuedAt, issuerId: profile?.issuer_id })
      const sealSvg = generateSealSVG({ plan: profile?.issuers?.plan || 'bronze', certId, entityName: form.entityName, documentType: DOC_TYPES[form.documentType]?.fr || form.documentType, issuedAt, issuerName: profile?.issuers?.name || 'VeryTrust' })
      const { data, error } = await supabase.from('certificates').insert({
        id: certId, issuer_id: profile.issuer_id,
        document_type: form.documentType, entity_name: form.entityName,
        entity_ref: form.entityRef, referentiel: form.referentiel,
        fiscal_year: form.fiscalYear, issued_at: issuedAt,
        signature, seal_svg: sealSvg, is_valid: true
      }).select().single()
      if (error) throw error
      const qr = await generateQRCode(certId)
      setQrDataUrl(qr)
      const richSeal = generateRichSealSVG({
        plan: profile?.issuers?.plan || 'bronze',
        certId, entityName: form.entityName,
        documentType: DOC_TYPES[form.documentType]?.fr || form.documentType,
        issuedAt, issuerName: profile?.issuers?.name || 'VeryTrust',
        qrDataUrl: qr,
      })
      setRichSealSvg(richSeal)
      setResult({ ...data, sealSvg })
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  function downloadQR() {
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = `verytrust-qr-${result.id}.png`
    a.click()
  }

  function copyUrl() {
    navigator.clipboard.writeText(`https://verytrust.africa/verify/${result.id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadSeal() {
    const blob = new Blob([richSealSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `verytrust-seal-${result.id}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copySeal() {
    navigator.clipboard.writeText(richSealSvg)
    setSealCopied(true)
    setTimeout(() => setSealCopied(false), 2000)
  }

  const sealPreviewUrl = richSealSvg
    ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(richSealSvg)
    : null

  if (result) return (
    <div className="fade-in" style={{ maxWidth: 640 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <BadgeSVG plan={profile?.issuers?.plan || 'bronze'} size={72} certId={result.id} />
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 900, color: '#0a2828', marginBottom: 4 }}>{t('dash_cert_success')}</h2>
          <div style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#0d8f8f' }}>{result.id}</div>
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 20, fontSize: 13, color: '#4a7070' }}>
        {[
          [t('dash_cert_company'), result.entity_name],
          [t('dash_cert_type'), DOC_TYPES[result.document_type]?.fr],
          [t('dash_cert_date'), formatDate(result.issued_at, 'fr')],
          [t('dash_cert_url'), `verytrust.africa/verify/${result.id}`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0fafa', fontSize: 12 }}>
            <span style={{ color: '#8aadad', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1 }}>{k}</span>
            <span style={{ fontWeight: 600, color: '#0a2828' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Rich seal preview */}
      {sealPreviewUrl && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2828', marginBottom: 12 }}>{t('dash_seal_for_pdf')}</div>
          <div style={{ background: '#f8fefe', borderRadius: 10, padding: 16, border: '1px solid #d4eded', marginBottom: 16, overflow: 'auto' }}>
            <img
              src={sealPreviewUrl}
              alt="Sceau VeryTrust"
              style={{ width: '100%', maxWidth: 580, height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: 12, flex: 1 }} onClick={downloadSeal}>
              {t('dash_download_seal')}
            </button>
            <button className="btn-secondary" style={{ fontSize: 12, flex: 1 }} onClick={copySeal}>
              {t(sealCopied ? 'dash_svg_copied' : 'dash_copy_svg')}
            </button>
          </div>
        </div>
      )}

      {/* QR + URL */}
      {qrDataUrl && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <div style={{ padding: 10, background: 'white', border: '1px solid #d4eded', borderRadius: 10, flexShrink: 0 }}>
            <img src={qrDataUrl} alt={`QR code ${result.id}`} width={100} height={100} style={{ display: 'block' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0a2828', marginBottom: 8 }}>{t('dash_qr_code')}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={downloadQR}>{t('dash_download_qr')}</button>
              <button className="btn-secondary" style={{ fontSize: 11 }} onClick={copyUrl}>{t(copied ? 'dash_url_copied' : 'dash_copy_url')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" style={{ flex: 1 }} onClick={onSuccess}>{t('dash_see_certs')}</button>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setResult(null); setQrDataUrl(null); setRichSealSvg(null) }}>{t('dash_new_cert_btn')}</button>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_issue_cert')}</h1>
      <div className="card" style={{ maxWidth: 560 }}>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { key: 'entityName', labelKey: 'dash_company_label', placeholder: 'Vallion SA', type: 'text' },
            { key: 'entityRef', labelKey: 'dash_ref_label', placeholder: 'SN-DKR-2024-B-12345', type: 'text' },
            { key: 'fiscalYear', labelKey: 'dash_year_label', placeholder: '2024', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label className="label">{t(f.labelKey)}</label>
              <input className="input-field" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} required={f.key !== 'entityRef'} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label className="label">{t('dash_type_label')}</label>
            <select className="input-field" value={form.documentType} onChange={e => set('documentType', e.target.value)}>
              {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label">{t('dash_referentiel_label')}</label>
            <select className="input-field" value={form.referentiel} onChange={e => set('referentiel', e.target.value)}>
              {['SYSCOHADA', 'SYSCOHADA Révisé 2017', 'PCB', 'RCSFD', 'IFRS', 'SYSCAM', 'SYCEBNL', 'Autre'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 14 }} disabled={loading}>
            {loading ? <span className="spinner" /> : t('dash_submit_cert')}
          </button>
        </form>
      </div>
    </div>
  )
}

function ApiTab({ profile }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const apiKey = profile?.issuers?.api_key || 'VT_KEY_XXXX'

  function copy() {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_api_title')}</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a2828', marginBottom: 12 }}>{t('dash_api_key_label')}</h3>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, background: '#f0fafa', padding: '10px 14px', borderRadius: 8, border: '1px solid #d4eded', color: '#0a2828', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apiKey}</div>
          <button className="btn-secondary" style={{ fontSize: 12, padding: '10px 16px', whiteSpace: 'nowrap' }} onClick={copy}>{t(copied ? 'dash_api_copied' : 'dash_api_copy')}</button>
        </div>
        <p style={{ fontSize: 11, color: '#8aadad', marginTop: 8 }}>{t('dash_api_warning')}</p>
      </div>
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a2828', marginBottom: 16 }}>{t('dash_api_example')}</h3>
        <pre style={{ background: '#0a2828', color: '#a8dede', padding: 20, borderRadius: 10, fontSize: 12, overflow: 'auto', lineHeight: 1.6 }}>{`// npm install @verytrust/sdk

import VeryTrust from '@verytrust/sdk'

const vt = new VeryTrust({ apiKey: '${apiKey}' })

// Issue a certificate
const cert = await vt.issue({
  documentType: 'bilan',
  entityName: 'Vallion SA',
  entityRef: 'SN-DKR-2024-B-12345',
  referentiel: 'SYSCOHADA',
  fiscalYear: '2024'
})

// Result
// cert.id       → "VT-2026-A3B7C2D1"
// cert.sealSvg  → SVG to embed in the PDF
// cert.verifyUrl → public verification URL`}</pre>
      </div>
    </div>
  )
}

function ProfileTab({ profile, user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const twoFaEnabled = profile?.two_factor_enabled

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_profile_title')}</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        {[
          { label: t('dash_row_email'), value: user?.email },
          { label: t('dash_row_org'), value: profile?.issuers?.name },
          { label: t('dash_row_domain'), value: profile?.issuers?.domain || '—' },
          { label: t('dash_row_level'), value: (profile?.issuers?.plan || 'bronze').toUpperCase() },
          { label: t('dash_row_since'), value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—' },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0fafa', fontSize: 14 }}>
            <span style={{ color: '#8aadad', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</span>
            <span style={{ fontWeight: 600, color: '#0a2828' }}>{row.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#0a2828', marginBottom: 2 }}>🔐 {t('dash_2fa_title')}</p>
              <p style={{ fontSize: 11, color: twoFaEnabled ? '#0d8f8f' : '#8aadad' }}>
                {twoFaEnabled ? t('dash_2fa_active_desc') : t('dash_2fa_inactive')}
              </p>
            </div>
            {twoFaEnabled
              ? <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#e8f7f7', color: '#0d8f8f', border: '1px solid #a8dede', fontWeight: 700 }}>{t('dash_2fa_badge')}</span>
              : <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => navigate('/2fa-setup')}>{t('dash_2fa_enable')}</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
