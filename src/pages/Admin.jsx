import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase, PLAN_COLORS, DOC_TYPES, formatDate } from '../lib/supabase'
import { LogoTeal } from '../components/Logo'
import { BadgeSVG } from '../components/Badge'

const NAV = [
  { key: 'overview',      label: 'Vue d\'ensemble',  icon: '◉' },
  { key: 'issuers',       label: 'Issuers',           icon: '◈' },
  { key: 'certificates',  label: 'Certificats',       icon: '◧' },
  { key: 'reviewers',     label: 'Réviseurs',         icon: '✦' },
]

const PLANS = ['bronze', 'silver', 'gold', 'platinum']

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')

  useEffect(() => {
    if (authLoading) return
    if (!user) { navigate('/login'); return }
    if (profile && profile.role !== 'admin') navigate('/dashboard')
  }, [user, authLoading, profile])

  if (authLoading || !profile) return (
    <div className="page-center">
      <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 32, height: 32 }} />
    </div>
  )
  if (profile.role !== 'admin') return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fefe' }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: '#0a2828', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <LogoTeal size={32} light={true} />
          <div style={{ marginTop: 8, fontSize: 10, fontWeight: 700, color: '#0d8f8f', letterSpacing: 2, textTransform: 'uppercase' }}>Admin</div>
        </div>

        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {NAV.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', background: tab === item.key ? 'rgba(13,143,143,0.2)' : 'transparent', color: tab === item.key ? '#0d8f8f' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: tab === item.key ? 600 : 400, cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'left', marginBottom: 4, transition: 'all 0.2s' }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Connecté en tant que</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
          </div>
          <button onClick={() => { signOut(); navigate('/login') }}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        {tab === 'overview'     && <OverviewTab />}
        {tab === 'issuers'      && <IssuersTab />}
        {tab === 'certificates' && <CertificatesTab />}
        {tab === 'reviewers'    && <ReviewersTab />}
      </main>
    </div>
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState({ certs: 0, verifs: 0, issuers: 0 })
  const [monthly, setMonthly] = useState([])

  useEffect(() => {
    async function load() {
      const [{ count: certs }, { count: verifs }, { count: issuers }, { data: certsData }] = await Promise.all([
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('verifications').select('*', { count: 'exact', head: true }),
        supabase.from('issuers').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('certificates').select('issued_at').order('issued_at', { ascending: true }),
      ])
      setStats({ certs: certs || 0, verifs: verifs || 0, issuers: issuers || 0 })

      // Group by month (last 6 months)
      const counts = {}
      ;(certsData || []).forEach(c => {
        const m = new Date(c.issued_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })
        counts[m] = (counts[m] || 0) + 1
      })
      const entries = Object.entries(counts).slice(-6)
      setMonthly(entries.map(([month, count]) => ({ month, count })))
    }
    load()
  }, [])

  const maxCount = Math.max(...monthly.map(m => m.count), 1)

  return (
    <div className="fade-in">
      <PageTitle>Vue d'ensemble</PageTitle>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Certificats émis',    value: stats.certs,   icon: '◧', color: '#0d8f8f' },
          { label: 'Vérifications',        value: stats.verifs,  icon: '🔍', color: '#c9a84c' },
          { label: 'Issuers actifs',       value: stats.issuers, icon: '◈', color: '#3d7a6e' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#8aadad' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div className="card">
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2828', marginBottom: 20 }}>Certifications par mois</div>
        {monthly.length === 0
          ? <div style={{ textAlign: 'center', color: '#8aadad', fontSize: 13, padding: '20px 0' }}>Aucune donnée</div>
          : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {monthly.map(({ month, count }) => (
                <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0d8f8f' }}>{count}</div>
                  <div style={{ width: '100%', height: Math.max(8, (count / maxCount) * 120), background: 'linear-gradient(to top, #0d8f8f, #4ab8b8)', borderRadius: '4px 4px 0 0', transition: 'height 0.4s' }} />
                  <div style={{ fontSize: 10, color: '#8aadad', whiteSpace: 'nowrap' }}>{month}</div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

// ── Issuers ───────────────────────────────────────────────────────────────────

function IssuersTab() {
  const [issuers, setIssuers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

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
      <PageTitle>Issuers <span style={{ fontSize: 16, fontWeight: 400, color: '#8aadad' }}>({issuers.length})</span></PageTitle>

      <div className="card">
        {loading
          ? <Spinner />
          : issuers.length === 0
            ? <Empty text="Aucun issuer enregistré" />
            : issuers.map(iss => {
                const pc = PLAN_COLORS[iss.plan] || PLAN_COLORS.bronze
                const certCount = iss.certificates?.[0]?.count ?? 0
                return (
                  <div key={iss.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
                    <BadgeSVG plan={iss.plan} size={40} />
                    <div style={{ flex: 1, minWidth: 160 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2828' }}>{iss.name}</div>
                      <div style={{ fontSize: 11, color: '#8aadad' }}>{iss.domain || '—'} · {certCount} certificat{certCount !== 1 ? 's' : ''}</div>
                    </div>

                    {/* Plan selector */}
                    <select
                      value={iss.plan}
                      onChange={e => changePlan(iss.id, e.target.value)}
                      disabled={updating === iss.id + '-plan'}
                      style={{ padding: '5px 10px', borderRadius: 7, border: `1.5px solid ${pc.border}`, background: pc.bg, color: pc.text, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                    >
                      {PLANS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>

                    {/* Active toggle */}
                    <button
                      onClick={() => toggleActive(iss.id, iss.is_active)}
                      disabled={updating === iss.id + '-toggle'}
                      style={{ padding: '5px 14px', borderRadius: 7, border: 'none', background: iss.is_active ? '#e8f7f7' : '#fef2f2', color: iss.is_active ? '#0d8f8f' : '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', minWidth: 84 }}
                    >
                      {updating === iss.id + '-toggle' ? '...' : iss.is_active ? '✓ Actif' : '✗ Inactif'}
                    </button>
                  </div>
                )
              })
        }
      </div>
    </div>
  )
}

// ── Certificates ──────────────────────────────────────────────────────────────

function CertificatesTab() {
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterIssuer, setFilterIssuer] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterDate, setFilterDate] = useState('')
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
    const matchDate   = !filterDate   || c.issued_at?.startsWith(filterDate)
    return matchIssuer && matchType && matchDate
  })

  return (
    <div className="fade-in">
      <PageTitle>Certificats <span style={{ fontSize: 16, fontWeight: 400, color: '#8aadad' }}>({filtered.length}/{certs.length})</span></PageTitle>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <input className="input-field" placeholder="Filtrer par issuer..." value={filterIssuer} onChange={e => setFilterIssuer(e.target.value)} />
        <select className="input-field" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Tous les types</option>
          {Object.entries(DOC_TYPES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
        </select>
        <input className="input-field" type="month" value={filterDate} onChange={e => setFilterDate(e.target.value)} title="Filtrer par mois" />
      </div>

      <div className="card">
        {loading
          ? <Spinner />
          : filtered.length === 0
            ? <Empty text="Aucun certificat trouvé" />
            : filtered.map(cert => {
                const pc = PLAN_COLORS[cert.issuers?.plan || 'bronze']
                return (
                  <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
                    {/* Valid indicator */}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: cert.is_valid ? '#0d8f8f' : '#dc2626', flexShrink: 0 }} />

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0a2828' }}>{cert.entity_name}</div>
                      <div style={{ fontSize: 11, color: '#8aadad' }}>
                        {DOC_TYPES[cert.document_type]?.fr || cert.document_type}
                        {cert.fiscal_year && ` · ${cert.fiscal_year}`}
                        {' · '}<span style={{ color: pc?.text }}>{cert.issuers?.name || '—'}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0d8f8f', marginBottom: 2 }}>{cert.id}</div>
                      <div style={{ fontSize: 10, color: '#8aadad' }}>{formatDate(cert.issued_at, 'fr').split(' à')[0]}</div>
                    </div>

                    {cert.is_valid ? (
                      <button
                        onClick={() => window.confirm(`Invalider ${cert.id} ?`) && invalidate(cert.id)}
                        disabled={invalidating === cert.id}
                        style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap' }}
                      >
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
                )
              })
        }
      </div>
    </div>
  )
}

// ── Reviewers ─────────────────────────────────────────────────────────────────

function ReviewersTab() {
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('users')
        .select('*, issuers(*)')
        .eq('role', 'reviewer')
        .order('created_at', { ascending: false })
      setReviewers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function toggleReviewer(id, currentRole) {
    const newRole = currentRole === 'reviewer' ? 'user' : 'reviewer'
    await supabase.from('users').update({ role: newRole }).eq('id', id)
    setReviewers(prev => prev.map(r => r.id === id ? { ...r, role: newRole } : r))
  }

  return (
    <div className="fade-in">
      <PageTitle>Réviseurs certifiés <span style={{ fontSize: 16, fontWeight: 400, color: '#8aadad' }}>({reviewers.length})</span></PageTitle>

      <div className="card">
        {loading
          ? <Spinner />
          : reviewers.length === 0
            ? <Empty text="Aucun réviseur certifié VeryTrust" />
            : reviewers.map(rev => (
                <div key={rev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0fafa', flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e8f7f7', border: '1.5px solid #a8dede', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✦</div>

                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0a2828' }}>{rev.issuers?.name || 'Réviseur'}</div>
                    <div style={{ fontSize: 11, color: '#8aadad' }}>
                      {rev.issuers?.domain || '—'}
                      {rev.created_at && ` · Depuis ${new Date(rev.created_at).toLocaleDateString('fr-FR')}`}
                    </div>
                  </div>

                  <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: rev.role === 'reviewer' ? '#e8f7f7' : '#fef2f2', color: rev.role === 'reviewer' ? '#0d8f8f' : '#dc2626', border: `1px solid ${rev.role === 'reviewer' ? '#a8dede' : '#fca5a5'}`, fontWeight: 700, letterSpacing: 0.5 }}>
                    {rev.role === 'reviewer' ? '✓ RÉVISEUR' : '✗ RETIRÉ'}
                  </span>

                  <button
                    onClick={() => toggleReviewer(rev.id, rev.role)}
                    style={{ padding: '5px 14px', borderRadius: 7, border: '1px solid #d4eded', background: 'white', color: '#4a7070', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                  >
                    {rev.role === 'reviewer' ? 'Retirer' : 'Rétablir'}
                  </button>
                </div>
              ))
        }
      </div>
    </div>
  )
}

// ── Shared UI atoms ───────────────────────────────────────────────────────────

function PageTitle({ children }) {
  return (
    <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 24 }}>
      {children}
    </h1>
  )
}

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: 32 }}>
      <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 24, height: 24, margin: '0 auto' }} />
    </div>
  )
}

function Empty({ text }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: '#8aadad', fontSize: 13 }}>{text}</div>
  )
}
