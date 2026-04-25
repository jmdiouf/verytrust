import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useIsMobile } from '../hooks/useIsMobile'
import { supabase, generateCertId, hashDocument, formatDate, PLAN_COLORS, DOC_TYPES, generateQRCode } from '../lib/supabase'
import { LogoTeal } from '../components/Logo'
import { BadgeSVG, generateSealSVG, generateRichSealSVG } from '../components/Badge'
import { getPaysList, getPaysNom, getOrdresForPays, getReferentielsForPays, SECTEURS, SPECIALITES } from '../lib/paysConfig'

const BASE_NAV = [
  { key: 'overview',      labelKey: 'nav_overview',   icon: '◉' },
  { key: 'certificates',  labelKey: 'nav_my_certs',   icon: '◧' },
  { key: 'new',           labelKey: 'nav_new_cert',   icon: '+' },
  { key: 'api',           labelKey: 'nav_api_keys',   icon: '⌘' },
  { key: 'profile',       labelKey: 'nav_profile',    icon: '◈' },
]

const ADMIN_NAV = [
  { key: 'validation',    label: 'Validation',          icon: '⊙' },
  { key: 'all_certs',     label: 'Tous les certificats', icon: '◫' },
  { key: 'admin_issuers', label: 'Gestion issuers',     icon: '◆' },
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
  const isAdmin = profile?.role === 'admin'

  if (authLoading) return <div className="page-center"><div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 32, height: 32 }} /></div>

  function NavBtn({ item, label }) {
    const active = tab === item.key
    return (
      <button key={item.key} onClick={() => selectTab(item.key)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: active ? 'rgba(13,143,143,0.2)' : 'transparent', color: active ? '#0d8f8f' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'left', marginBottom: 4, transition: 'all 0.2s' }}>
        <span style={{ fontSize: 16 }}>{item.icon}</span>{label}
      </button>
    )
  }

  const Sidebar = (
    <aside
      className={isMobile ? `dash-sidebar-overlay${sidebarOpen ? ' open' : ''}` : ''}
      style={{ width: 240, background: '#0a2828', display: 'flex', flexDirection: 'column', padding: '24px 0', position: isMobile ? 'fixed' : 'sticky', top: 0, height: '100vh', flexShrink: 0, zIndex: isMobile ? 200 : 'auto', transition: 'transform 0.25s ease' }}
    >
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <LogoTeal size={32} light={true} />
      </div>
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        {BASE_NAV.map(item => <NavBtn key={item.key} item={item} label={t(item.labelKey)} />)}

        {isAdmin && (
          <>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, padding: '14px 12px 4px', textTransform: 'uppercase' }}>
              Admin
            </div>
            {ADMIN_NAV.map(item => <NavBtn key={item.key} item={item} label={item.label} />)}
          </>
        )}
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

        {tab === 'overview'      && <OverviewTab stats={stats} certs={certs} plan={plan} pc={pc} profile={profile} />}
        {tab === 'certificates'  && <CertificatesTab certs={certs} loading={loadingCerts} />}
        {tab === 'new'           && <NewCertTab profile={profile} onSuccess={() => { fetchData(); setTab('certificates') }} />}
        {tab === 'api'           && <ApiTab profile={profile} />}
        {tab === 'profile'       && <ProfileTab profile={profile} user={user} />}
        {tab === 'validation'    && isAdmin && <DashValidationTab />}
        {tab === 'all_certs'     && isAdmin && <AllCertsTab />}
        {tab === 'admin_issuers' && isAdmin && <AdminIssuersTab />}
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
  const [form, setForm] = useState({
    entityName: '', entityRef: '', documentType: 'bilan',
    referentiel: 'SYSCOHADA Révisé 2017',
    fiscalYear: new Date().getFullYear().toString(),
    pays_societe: 'SN', secteur: 'commerce',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [richSealSvg, setRichSealSvg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [sealCopied, setSealCopied] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const isBlocked = profile?.status && profile.status !== 'active'

  if (isBlocked) {
    return (
      <div className="fade-in">
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_issue_cert')}</h1>
        <div style={{ background: '#fff7ed', border: '1.5px solid #fb923c', borderRadius: 14, padding: '24px 28px', maxWidth: 520 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#c2410c', marginBottom: 10 }}>⏳ Compte en cours de validation</div>
          <p style={{ fontSize: 14, color: '#9a3412', lineHeight: 1.7, margin: 0 }}>
            Votre compte est en cours de validation. Vous pourrez émettre des certificats dès que VeryTrust aura validé votre dossier.
          </p>
        </div>
      </div>
    )
  }

  function handlePaysChange(pays) {
    const refs = getReferentielsForPays(pays)
    setForm(f => ({ ...f, pays_societe: pays, referentiel: refs[0]?.code || 'SYSCOHADA Révisé 2017' }))
  }

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
        signature, seal_svg: sealSvg, is_valid: true,
        metadata: { pays_societe: form.pays_societe, secteur: form.secteur },
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
          ...(profile?.nom_affiche        ? [['Professionnel',    profile.nom_affiche]]        : []),
          ...(profile?.titre_professionnel ? [['Titre',           profile.titre_professionnel]] : []),
          ...(profile?.numero_inscription  ? [["N° inscription",  profile.numero_inscription]]  : []),
          ...(profile?.ordre_professionnel ? [['Ordre',           profile.ordre_professionnel]] : []),
          ...(profile?.pays_exercice       ? [["Pays d'exercice", getPaysNom(profile.pays_exercice)]] : []),
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
            { key: 'entityRef',  labelKey: 'dash_ref_label',     placeholder: 'SN-DKR-2024-B-12345', type: 'text' },
            { key: 'fiscalYear', labelKey: 'dash_year_label',    placeholder: '2024', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label className="label">{t(f.labelKey)}</label>
              <input className="input-field" type={f.type} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} required={f.key !== 'entityRef'} />
            </div>
          ))}

          {/* Pays de la société cliente */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Pays de la société cliente</label>
            <select className="input-field" value={form.pays_societe} onChange={e => handlePaysChange(e.target.value)}>
              {getPaysList().map(p => <option key={p.code} value={p.code}>{p.nom}</option>)}
            </select>
          </div>

          {/* Secteur d'activité */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">Secteur d'activité</label>
            <select className="input-field" value={form.secteur} onChange={e => set('secteur', e.target.value)}>
              {SECTEURS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </div>

          {/* Type de document */}
          <div style={{ marginBottom: 16 }}>
            <label className="label">{t('dash_type_label')}</label>
            <select className="input-field" value={form.documentType} onChange={e => set('documentType', e.target.value)}>
              {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select>
          </div>

          {/* Référentiel filtré par pays */}
          <div style={{ marginBottom: 24 }}>
            <label className="label">{t('dash_referentiel_label')}</label>
            <select className="input-field" value={form.referentiel} onChange={e => set('referentiel', e.target.value)}>
              {getReferentielsForPays(form.pays_societe).map(r => (
                <option key={r.code} value={r.code}>{r.labelFull}</option>
              ))}
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
  const { refreshProfile } = useAuth()
  const twoFaEnabled = profile?.two_factor_enabled

  const [profForm, setProfForm] = useState({
    pays_exercice: '', ordre_professionnel: '', numero_inscription: '',
    specialite: '', nom_affiche: '', titre_professionnel: '',
  })
  const [ordres, setOrdres] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('')

  useEffect(() => {
    if (!profile) return
    const pays = profile.pays_exercice || ''
    setProfForm({
      pays_exercice:      pays,
      ordre_professionnel: profile.ordre_professionnel || '',
      numero_inscription:  profile.numero_inscription  || '',
      specialite:          profile.specialite          || '',
      nom_affiche:         profile.nom_affiche         || '',
      titre_professionnel: profile.titre_professionnel || '',
    })
    if (pays) setOrdres(getOrdresForPays(pays))
  }, [profile])

  function setProf(k, v) {
    if (k === 'pays_exercice') {
      setOrdres(getOrdresForPays(v))
      setProfForm(f => ({ ...f, pays_exercice: v, ordre_professionnel: '' }))
    } else {
      setProfForm(f => ({ ...f, [k]: v }))
    }
  }

  async function handleSaveProf(e) {
    e.preventDefault()
    setSaving(true); setSaveMsg('')
    const { error } = await supabase.from('users').update({
      pays_exercice:      profForm.pays_exercice,
      ordre_professionnel: profForm.ordre_professionnel,
      numero_inscription:  profForm.numero_inscription,
      specialite:          profForm.specialite,
      nom_affiche:         profForm.nom_affiche,
      titre_professionnel: profForm.titre_professionnel,
    }).eq('id', user.id)
    setSaving(false)
    setSaveMsg(error ? `Erreur : ${error.message}` : 'Profil professionnel sauvegardé.')
    setTimeout(() => setSaveMsg(''), 4000)
  }

  async function handleDocumentUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowed.includes(file.type)) {
      setUploadError('Format non supporté. Utilisez PDF, JPG ou PNG.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Fichier trop volumineux (max 5 MB).')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `attestations/${user.id}-${Date.now()}.${ext}`
      const { error: e1 } = await supabase.storage.from('documents').upload(path, file, { upsert: true })
      if (e1) throw e1
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)
      const { error: e2 } = await supabase.from('users').update({
        document_url: publicUrl,
        document_type: ext,
        status: 'pending_review',
      }).eq('id', user.id)
      if (e2) throw e2
      setUploadSuccessMsg('Document soumis — validation sous 48h')
      await refreshProfile()
    } catch (err) {
      setUploadError(err.message)
    }
    setUploading(false)
  }

  const isError = saveMsg.startsWith('Erreur')
  const status = profile?.status
  const showDocBanner = status === 'pending_documents' || status === 'pending_review' || status === 'rejected'

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>{t('dash_profile_title')}</h1>

      {/* ── Status banner ── */}
      {showDocBanner && (
        <div style={{
          maxWidth: 480, marginBottom: 20,
          background: status === 'rejected' ? '#fef2f2' : '#fff7ed',
          border: `1.5px solid ${status === 'rejected' ? '#fca5a5' : '#fb923c'}`,
          borderRadius: 12, padding: '20px',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: status === 'rejected' ? '#dc2626' : '#c2410c' }}>
            {status === 'pending_review' ? '⏳ Document en cours de vérification'
              : status === 'rejected'   ? '✗ Dossier rejeté'
              :                           '⚠ Compte en attente de validation'}
          </div>

          {status === 'pending_documents' && (
            <p style={{ fontSize: 13, color: '#9a3412', margin: '0 0 12px', lineHeight: 1.6 }}>
              Pour activer votre compte et émettre des certificats, chargez votre attestation d'inscription à l'ordre professionnel.
            </p>
          )}
          {status === 'pending_review' && !uploadSuccessMsg && (
            <p style={{ fontSize: 13, color: '#9a3412', margin: '0 0 4px', lineHeight: 1.6 }}>
              Document soumis — validation sous 48h.
            </p>
          )}
          {status === 'rejected' && profile?.rejection_reason && (
            <p style={{ fontSize: 13, color: '#7f1d1d', margin: '0 0 12px', background: '#fee2e2', borderRadius: 6, padding: '8px 10px' }}>
              Motif : {profile.rejection_reason}
            </p>
          )}

          {uploadSuccessMsg && (
            <div style={{ fontSize: 13, color: '#0d8f8f', background: '#e8f7f7', border: '1px solid #a8dede', borderRadius: 7, padding: '8px 12px', marginBottom: 4 }}>
              ✓ {uploadSuccessMsg}
            </div>
          )}

          {!uploadSuccessMsg && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>
                Formats acceptés : <strong>PDF, JPG, PNG</strong> · Taille max : <strong>5 MB</strong>
              </p>
              {uploadError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, padding: '6px 10px', marginBottom: 10, fontSize: 12, color: '#dc2626' }}>
                  {uploadError}
                </div>
              )}
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px',
                background: status === 'pending_review' ? 'white' : '#c2410c',
                color: status === 'pending_review' ? '#c2410c' : 'white',
                border: status === 'pending_review' ? '1px solid #fb923c' : 'none',
                borderRadius: 8, cursor: uploading ? 'default' : 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: 'Sora, sans-serif',
                opacity: uploading ? 0.7 : 1,
              }}>
                {uploading ? '⏳ Envoi en cours...' : status === 'pending_review' ? '↑ Remplacer le document' : '↑ Charger l\'attestation'}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleDocumentUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
          )}
        </div>
      )}

      {/* ── Informations du compte ── */}
      <div className="card" style={{ maxWidth: 480, marginBottom: 20 }}>
        {[
          { label: t('dash_row_email'),  value: user?.email },
          { label: t('dash_row_org'),    value: profile?.issuers?.name },
          { label: t('dash_row_domain'), value: profile?.issuers?.domain || '—' },
          { label: t('dash_row_level'),  value: (profile?.issuers?.plan || 'bronze').toUpperCase() },
          { label: t('dash_row_since'),  value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—' },
          ...(status === 'active' ? [{ label: 'Statut', value: '✓ Compte validé' }] : []),
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0fafa', fontSize: 14 }}>
            <span style={{ color: '#8aadad', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</span>
            <span style={{ fontWeight: 600, color: row.label === 'Statut' ? '#0d8f8f' : '#0a2828' }}>{row.value}</span>
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

      {/* ── Formulaire profil professionnel ── */}
      <div className="card" style={{ maxWidth: 480 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0a2828', marginBottom: 6 }}>Profil Professionnel</h3>
        <p style={{ fontSize: 12, color: '#8aadad', marginBottom: 20 }}>Ces informations apparaîtront sur les certificats que vous émettez.</p>

        {saveMsg && (
          <div style={{ background: isError ? '#fef2f2' : '#e8f7f7', border: `1px solid ${isError ? '#fca5a5' : '#a8dede'}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: isError ? '#dc2626' : '#0d8f8f' }}>
            {saveMsg}
          </div>
        )}

        <form onSubmit={handleSaveProf}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Pays d'exercice</label>
            <select className="input-field" value={profForm.pays_exercice} onChange={e => setProf('pays_exercice', e.target.value)}>
              <option value="">— Sélectionner un pays —</option>
              {getPaysList().map(p => <option key={p.code} value={p.code}>{p.nom}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Ordre professionnel</label>
            <select className="input-field" value={profForm.ordre_professionnel} onChange={e => setProf('ordre_professionnel', e.target.value)} disabled={!profForm.pays_exercice}>
              <option value="">— Sélectionner un ordre —</option>
              {ordres.map(o => <option key={o.code} value={o.code}>{o.nom}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Numéro d'inscription</label>
            <input className="input-field" type="text" value={profForm.numero_inscription} onChange={e => setProf('numero_inscription', e.target.value)} placeholder="Ex : SN-EC-2019-00123" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Spécialité</label>
            <select className="input-field" value={profForm.specialite} onChange={e => setProf('specialite', e.target.value)}>
              <option value="">— Sélectionner une spécialité —</option>
              {SPECIALITES.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="label">Nom affiché sur les certificats</label>
            <input className="input-field" type="text" value={profForm.nom_affiche} onChange={e => setProf('nom_affiche', e.target.value)} placeholder="Ex : Jean-Maurice DIOUF" />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Titre professionnel</label>
            <input className="input-field" type="text" value={profForm.titre_professionnel} onChange={e => setProf('titre_professionnel', e.target.value)} placeholder="Ex : Expert-Comptable Diplômé" />
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 14 }} disabled={saving}>
            {saving ? <span className="spinner" /> : 'Sauvegarder le profil professionnel'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Admin : Validation ─────────────────────────────────────────────────────────

function DashValidationTab() {
  const { user } = useAuth()
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*, issuers(*)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: false })
    setPending(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleValidate(id) {
    setProcessing(id + '-v')
    await supabase.from('users').update({
      status: 'active',
      validated_at: new Date().toISOString(),
      validated_by: user.id,
      rejection_reason: null,
    }).eq('id', id)
    await load()
    setProcessing(null)
  }

  async function handleReject(id) {
    if (!rejectionReason.trim()) return
    setProcessing(id + '-r')
    await supabase.from('users').update({
      status: 'rejected',
      rejection_reason: rejectionReason.trim(),
    }).eq('id', id)
    setRejectingId(null)
    setRejectionReason('')
    await load()
    setProcessing(null)
  }

  async function handleRequestMore(id) {
    setProcessing(id + '-m')
    await supabase.from('users').update({
      status: 'pending_documents',
      rejection_reason: null,
    }).eq('id', id)
    await load()
    setProcessing(null)
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>
        Validation <span style={{ fontSize: 18, fontWeight: 400, color: '#8aadad' }}>({pending.length} en attente)</span>
      </h1>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 24, height: 24, margin: '0 auto' }} />
          </div>
        ) : pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>Aucun compte en attente de validation</div>
        ) : pending.map(u => (
          <div key={u.id} style={{ padding: '20px 0', borderBottom: '1px solid #f0fafa' }}>

            {/* Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff7ed', border: '1.5px solid #fb923c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>◈</div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2828' }}>{u.nom_affiche || u.issuers?.name || u.email}</div>
                <div style={{ fontSize: 11, color: '#8aadad', marginTop: 2 }}>{u.email}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 6 }}>
                  {u.pays_exercice    && <span style={{ fontSize: 11, color: '#4a7070' }}>🌍 {getPaysNom(u.pays_exercice)}</span>}
                  {u.ordre_professionnel && <span style={{ fontSize: 11, color: '#4a7070' }}>⚖ {u.ordre_professionnel}</span>}
                  {u.numero_inscription  && <span style={{ fontSize: 11, color: '#4a7070' }}>N° {u.numero_inscription}</span>}
                </div>
              </div>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: '#fff7ed', color: '#c2410c', border: '1px solid #fb923c', fontWeight: 700, flexShrink: 0 }}>EN ATTENTE</span>
            </div>

            {/* Document */}
            {u.document_url ? (
              <div style={{ marginBottom: 14 }}>
                <a href={u.document_url} target="_blank" rel="noreferrer"
                  style={{ fontSize: 12, color: '#0d8f8f', fontWeight: 600, padding: '6px 14px', border: '1px solid #a8dede', borderRadius: 7, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  📄 Voir le document ({(u.document_type || 'fichier').toUpperCase()}) ↗
                </a>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: '#fb923c', marginBottom: 14 }}>⚠ Aucun document uploadé</div>
            )}

            {/* Rejection form */}
            {rejectingId === u.id && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 14, marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: 8 }}>
                  Motif de rejet <span style={{ fontWeight: 400 }}>(obligatoire)</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Ex : Document illisible, attestation expirée..."
                  style={{ width: '100%', minHeight: 80, padding: '8px 12px', borderRadius: 7, border: '1px solid #fca5a5', fontFamily: 'Sora, sans-serif', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', background: 'white' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={() => handleReject(u.id)} disabled={!rejectionReason.trim() || processing === u.id + '-r'}
                    style={{ padding: '7px 16px', borderRadius: 7, border: 'none', background: '#dc2626', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', opacity: !rejectionReason.trim() ? 0.5 : 1 }}>
                    {processing === u.id + '-r' ? '...' : '✗ Confirmer le rejet'}
                  </button>
                  <button onClick={() => { setRejectingId(null); setRejectionReason('') }}
                    style={{ padding: '7px 14px', borderRadius: 7, border: '1px solid #d4eded', background: 'white', color: '#4a7070', fontSize: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                    Annuler
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            {rejectingId !== u.id && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button onClick={() => handleValidate(u.id)} disabled={!!processing}
                  style={{ padding: '7px 18px', borderRadius: 7, border: 'none', background: '#0d8f8f', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', minWidth: 100 }}>
                  {processing === u.id + '-v' ? '...' : '✓ Valider'}
                </button>
                <button onClick={() => { setRejectingId(u.id); setRejectionReason('') }} disabled={!!processing}
                  style={{ padding: '7px 18px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', minWidth: 100 }}>
                  ✗ Rejeter
                </button>
                <button onClick={() => handleRequestMore(u.id)} disabled={!!processing}
                  style={{ padding: '7px 18px', borderRadius: 7, border: '1px solid #d4eded', background: 'white', color: '#4a7070', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                  {processing === u.id + '-m' ? '...' : '↩ Demander complément'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin : Tous les certificats ───────────────────────────────────────────────

function AllCertsTab() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterIssuer, setFilterIssuer] = useState('')
  const [filterType, setFilterType] = useState('')
  const [invalidating, setInvalidating] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('certificates')
      .select('*, issuers(name, plan)')
      .order('issued_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function invalidate(id) {
    setInvalidating(id)
    await supabase.from('certificates').update({ is_valid: false }).eq('id', id)
    await load()
    setInvalidating(null)
  }

  const filtered = certs.filter(c => {
    const matchIssuer = !filterIssuer || c.issuers?.name?.toLowerCase().includes(filterIssuer.toLowerCase())
    const matchType   = !filterType   || c.document_type === filterType
    return matchIssuer && matchType
  })

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>
        Tous les certificats <span style={{ fontSize: 18, fontWeight: 400, color: '#8aadad' }}>({filtered.length}/{certs.length})</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <input className="input-field" placeholder="Filtrer par issuer..." value={filterIssuer} onChange={e => setFilterIssuer(e.target.value)} />
        <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Tous les types</option>
          {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 24, height: 24, margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>Aucun certificat trouvé</div>
        ) : filtered.map(cert => (
          <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: cert.is_valid ? '#0d8f8f' : '#dc2626', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2828' }}>{cert.entity_name}</div>
              <div style={{ fontSize: 11, color: '#8aadad' }}>
                {DOC_TYPES[cert.document_type]?.fr || cert.document_type}
                {cert.fiscal_year && ` · ${cert.fiscal_year}`}
                {' · '}<span style={{ color: '#0d8f8f' }}>{cert.issuers?.name || '—'}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0d8f8f', marginBottom: 2 }}>{cert.id}</div>
              <div style={{ fontSize: 10, color: '#8aadad' }}>{formatDate(cert.issued_at, 'fr').split(' à')[0]}</div>
            </div>
            {cert.is_valid ? (
              <button onClick={() => window.confirm(`Invalider ${cert.id} ?`) && invalidate(cert.id)} disabled={invalidating === cert.id}
                style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap' }}>
                {invalidating === cert.id ? '...' : '✗ Invalider'}
              </button>
            ) : (
              <span style={{ fontSize: 11, color: '#dc2626', fontWeight: 700, padding: '5px 12px' }}>INVALIDÉ</span>
            )}
            <a href={`/verify/${cert.id}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 11, color: '#0d8f8f', fontWeight: 600, padding: '5px 10px', border: '1px solid #a8dede', borderRadius: 6, whiteSpace: 'nowrap', textDecoration: 'none' }}>
              Voir ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Admin : Gestion issuers ────────────────────────────────────────────────────

function AdminIssuersTab() {
  const [issuers, setIssuers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  const PLANS = ['bronze', 'silver', 'gold', 'platinum']

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('issuers')
      .select('*, certificates(count)')
      .order('created_at', { ascending: false })
    setIssuers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function changePlan(id, plan) {
    setUpdating(id + '-plan')
    await supabase.from('issuers').update({ plan }).eq('id', id)
    await load()
    setUpdating(null)
  }

  async function toggleActive(id, current) {
    setUpdating(id + '-toggle')
    await supabase.from('issuers').update({ is_active: !current }).eq('id', id)
    await load()
    setUpdating(null)
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>
        Gestion issuers <span style={{ fontSize: 18, fontWeight: 400, color: '#8aadad' }}>({issuers.length})</span>
      </h1>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 24, height: 24, margin: '0 auto' }} />
          </div>
        ) : issuers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>Aucun issuer enregistré</div>
        ) : issuers.map(iss => {
          const pc = PLAN_COLORS[iss.plan] || PLAN_COLORS.bronze
          const certCount = iss.certificates?.[0]?.count ?? 0
          return (
            <div key={iss.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
              <BadgeSVG plan={iss.plan} size={40} />
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2828' }}>{iss.name}</div>
                <div style={{ fontSize: 11, color: '#8aadad' }}>{iss.domain || '—'} · {certCount} certificat{certCount !== 1 ? 's' : ''}</div>
              </div>
              <select value={iss.plan} onChange={e => changePlan(iss.id, e.target.value)} disabled={updating === iss.id + '-plan'}
                style={{ padding: '5px 10px', borderRadius: 7, border: `1.5px solid ${pc.border}`, background: pc.bg, color: pc.text, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
                {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
              <button onClick={() => toggleActive(iss.id, iss.is_active)} disabled={updating === iss.id + '-toggle'}
                style={{ padding: '5px 14px', borderRadius: 7, border: 'none', background: iss.is_active ? '#e8f7f7' : '#fef2f2', color: iss.is_active ? '#0d8f8f' : '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', minWidth: 84 }}>
                {updating === iss.id + '-toggle' ? '...' : iss.is_active ? '✓ Actif' : '✗ Inactif'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
