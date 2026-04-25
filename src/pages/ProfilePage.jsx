import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, PLAN_COLORS, PLAN_LABELS, DOC_TYPES, BASE_URL } from '../lib/supabase'
import { BadgeSVG } from '../components/Badge'
import Navbar from '../components/Navbar'
import { PAYS } from '../lib/paysConfig'
import { useIsMobile } from '../hooks/useIsMobile'

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2)
}

function getCountryName(code) {
  return PAYS[code]?.nom || code || ''
}

function getOrdreLabel(code, paysCode) {
  if (!code) return ''
  const ordre = PAYS[paysCode]?.ordres?.find(o => o.code === code)
  return ordre ? ordre.nom : code
}

// ── Skeleton loader ────────────────────────────────────────────────────────────
function Skeleton({ w = '100%', h = 16, r = 8, mb = 0 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, #e8f4f4 25%, #d4eded 50%, #e8f4f4 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      marginBottom: mb,
    }} />
  )
}

// ── Certificate card ───────────────────────────────────────────────────────────
function CertCard({ cert, plan, isMobile }) {
  const pc = PLAN_COLORS[plan] || PLAN_COLORS.bronze
  const docLabel = DOC_TYPES[cert.document_type]?.fr || cert.document_type || '—'
  const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date()
  const isValid = cert.is_valid && !isExpired
  const dateStr = cert.issued_at
    ? new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—'

  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`${BASE_URL}/verify/${cert.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center',
        gap: isMobile ? 12 : 18,
        padding: isMobile ? '14px 14px' : '16px 20px',
        background: 'white', borderRadius: 14,
        border: `1px solid ${hovered ? (isValid ? pc.main : '#fca5a5') : (isValid ? '#d4eded' : '#fee2e2')}`,
        textDecoration: 'none',
        boxShadow: hovered ? '0 4px 20px rgba(13,143,143,0.1)' : 'none',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
        background: isValid ? '#e8f7f7' : '#fef2f2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isValid ? (
          <svg width="19" height="19" fill="none" stroke="#0d8f8f" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <polyline points="9 15 11 17 15 12"/>
          </svg>
        ) : (
          <svg width="19" height="19" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="12" x2="15" y2="18"/><line x1="15" y1="12" x2="9" y2="18"/>
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#1a2535', fontFamily: 'Sora, sans-serif' }}>
            {cert.entity_name}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
            letterSpacing: 0.5, whiteSpace: 'nowrap',
            background: isValid ? pc.bg : '#fef2f2',
            color: isValid ? pc.text : '#dc2626',
            border: `1px solid ${isValid ? pc.border : '#fca5a5'}`,
          }}>
            {isValid ? 'VALIDE' : isExpired ? 'EXPIRÉ' : 'INVALIDÉ'}
          </span>
        </div>
        <div style={{ color: '#6a9090', fontSize: 12, display: 'flex', flexWrap: 'wrap', gap: '2px 10px' }}>
          <span>{docLabel}</span>
          {cert.fiscal_year && <span>· {cert.fiscal_year}</span>}
          {cert.referentiel && <span>· {cert.referentiel}</span>}
        </div>
      </div>

      {/* Date + ID */}
      {!isMobile && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: '#8aadad', marginBottom: 2 }}>{dateStr}</div>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#0d8f8f', fontWeight: 700 }}>{cert.id}</div>
        </div>
      )}

      <svg width="14" height="14" fill="none" stroke="#c0d8d8" strokeWidth="2.5" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </a>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { slug } = useParams()
  const isMobile = useIsMobile()
  const [profile, setProfile] = useState(null)
  const [issuer, setIssuer] = useState(null)
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setNotFound(false)

      const { data: user, error: userErr } = await supabase
        .from('users')
        .select('*, issuers(*)')
        .eq('slug', slug)
        .eq('is_profile_public', true)
        .eq('status', 'active')
        .single()

      if (userErr || !user) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProfile(user)
      setIssuer(user.issuers || null)

      if (user.issuer_id) {
        const { data: certs } = await supabase
          .from('certificates')
          .select('*')
          .eq('issuer_id', user.issuer_id)
          .order('issued_at', { ascending: false })
        setCertificates(certs || [])
      }

      setLoading(false)
    }
    load()
  }, [slug])

  function copyLink() {
    navigator.clipboard.writeText(`${BASE_URL}/pro/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0fafa' }}>
        <Navbar variant="light" />
        <div style={{ background: 'linear-gradient(135deg, #1a2535 0%, #0a2828 100%)', padding: isMobile ? '48px 20px 40px' : '64px 40px 56px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ width: 108, height: 108, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <div style={{ flex: 1, paddingTop: 8 }}>
              <Skeleton w="240px" h={32} r={8} mb={12} />
              <Skeleton w="180px" h={16} r={6} mb={10} />
              <Skeleton w="280px" h={12} r={6} />
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 40px' }}>
          <Skeleton w="100%" h={120} r={16} mb={16} />
          <Skeleton w="100%" h={80} r={16} />
        </div>
        <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      </div>
    )
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0fafa' }}>
        <Navbar variant="light" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '40px 20px', gap: 16 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#e8f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
          }}>
            <svg width="36" height="36" fill="none" stroke="#0d8f8f" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 28, color: '#1a2535', margin: 0, textAlign: 'center' }}>
            Profil introuvable
          </h2>
          <p style={{ fontFamily: 'Sora, sans-serif', color: '#6a9090', maxWidth: 400, textAlign: 'center', lineHeight: 1.65, fontSize: 14, margin: 0 }}>
            Ce profil est introuvable, non public, ou le compte n'est pas encore validé par VeryTrust.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Link to="/" style={{
              background: '#0d8f8f', color: 'white', borderRadius: 9,
              padding: '10px 22px', fontFamily: 'Sora, sans-serif',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}>
              Accueil
            </Link>
            <Link to="/verify" style={{
              background: 'white', color: '#0d8f8f',
              border: '1px solid #a8dede', borderRadius: 9,
              padding: '10px 22px', fontFamily: 'Sora, sans-serif',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}>
              Vérifier un certificat
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const plan = issuer?.plan || 'bronze'
  const pc = PLAN_COLORS[plan] || PLAN_COLORS.bronze
  const pl = PLAN_LABELS[plan] || PLAN_LABELS.bronze
  const countryName = getCountryName(profile.pays_exercice)
  const ordreName = getOrdreLabel(profile.ordre_professionnel, profile.pays_exercice)
  const profileName = profile.nom_affiche || profile.email || ''
  const validCerts = certificates.filter(c => c.is_valid)

  return (
    <div style={{ minHeight: '100vh', background: '#f0fafa', fontFamily: 'Sora, sans-serif' }}>
      <Navbar variant="light" />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a2535 0%, #0a3030 100%)',
        padding: isMobile ? '40px 20px 36px' : '60px 40px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 80% at 80% 50%, rgba(13,143,143,0.13) 0%, transparent 70%)',
        }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: isMobile ? 24 : 36,
          position: 'relative', zIndex: 1,
        }}>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profileName}
                style={{
                  width: 108, height: 108, borderRadius: '50%',
                  border: `3px solid ${pc.main}`,
                  objectFit: 'cover', display: 'block',
                  boxShadow: `0 0 0 6px ${pc.main}22`,
                }}
              />
            ) : (
              <div style={{
                width: 108, height: 108, borderRadius: '50%',
                background: `linear-gradient(135deg, ${pc.main}44, ${pc.main}88)`,
                border: `3px solid ${pc.main}`,
                boxShadow: `0 0 0 6px ${pc.main}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Fraunces, serif', fontSize: 36, fontWeight: 700,
                color: 'white',
              }}>
                {getInitials(profileName)}
              </div>
            )}
            {/* Verified badge */}
            <div style={{
              position: 'absolute', bottom: 2, right: 2,
              width: 26, height: 26, borderRadius: '50%',
              background: '#0d8f8f', border: '2.5px solid #1a2535',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <polyline points="2.5,6.5 5,9 9.5,3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Name, title, meta */}
          <div style={{ flex: 1, textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
              marginBottom: 6,
            }}>
              <h1 style={{
                fontFamily: 'Fraunces, serif', fontWeight: 700,
                fontSize: isMobile ? 26 : 34, color: 'white',
                margin: 0, lineHeight: 1.1,
              }}>
                {profileName}
              </h1>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5, padding: '3px 10px',
                borderRadius: 20, whiteSpace: 'nowrap',
                background: `${pc.main}28`, border: `1px solid ${pc.main}55`,
                color: pc.main,
              }}>
                ✓ VT VÉRIFIÉ
              </span>
            </div>

            {profile.titre_professionnel && (
              <p style={{ color: '#4dd4d4', fontWeight: 600, fontSize: 15, margin: '0 0 12px', letterSpacing: 0.2 }}>
                {profile.titre_professionnel}
              </p>
            )}

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '6px 16px',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              {countryName && (
                <MetaPill icon={<IconPin />}>{countryName}</MetaPill>
              )}
              {ordreName && (
                <MetaPill icon={<IconStar />}>{ordreName}</MetaPill>
              )}
              {profile.specialite && (
                <MetaPill icon={<IconBriefcase />}>{profile.specialite}</MetaPill>
              )}
              {profile.numero_inscription && (
                <MetaPill icon={<IconId />}>N° {profile.numero_inscription}</MetaPill>
              )}
            </div>

            {/* Action links */}
            <div style={{
              display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap',
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              {profile.linkedin_url && (
                <ExternalLink href={profile.linkedin_url} icon={<IconLinkedIn />}>LinkedIn</ExternalLink>
              )}
              {profile.website_url && (
                <ExternalLink href={profile.website_url} icon={<IconGlobe />}>Site web</ExternalLink>
              )}
              <button onClick={copyLink} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: copied ? `${pc.main}33` : 'rgba(255,255,255,0.07)',
                border: `1px solid ${copied ? pc.main : 'rgba(255,255,255,0.16)'}`,
                borderRadius: 8, padding: '7px 13px',
                color: copied ? pc.main : 'rgba(255,255,255,0.75)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.25s', fontFamily: 'Sora, sans-serif',
              }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                </svg>
                {copied ? 'Copié !' : 'Partager'}
              </button>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            flexShrink: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6,
          }}>
            <BadgeSVG plan={plan} size={isMobile ? 86 : 104} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: pc.main, fontSize: 10, fontWeight: 800, letterSpacing: 2 }}>
                {plan.toUpperCase()}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
                {pl.fr}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
      <div style={{
        background: 'white', borderBottom: '1px solid #e8f4f4',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: isMobile ? '12px 20px' : '14px 40px',
          display: 'flex', gap: isMobile ? 20 : 40,
          justifyContent: isMobile ? 'space-around' : 'flex-start',
        }}>
          <StatItem label="Certificats émis" value={certificates.length} />
          <StatItem label="Certif. valides" value={validCerts.length} color="#0d8f8f" />
          <StatItem label="Niveau" value={plan.charAt(0).toUpperCase() + plan.slice(1)} color={pc.main} />
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isMobile ? '24px 16px 48px' : '36px 40px 64px' }}>

        {/* Bio */}
        {profile.bio && (
          <div className="card fade-in" style={{ marginBottom: 20 }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700,
              color: '#1a2535', margin: '0 0 12px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 3, height: 18, background: '#0d8f8f', borderRadius: 2, display: 'inline-block' }} />
              À propos
            </h2>
            <p style={{ color: '#4a7070', lineHeight: 1.75, fontSize: 14, margin: 0 }}>
              {profile.bio}
            </p>
          </div>
        )}

        {/* Professional info grid */}
        <div className="card fade-in" style={{ marginBottom: 20 }}>
          <h2 style={{
            fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700,
            color: '#1a2535', margin: '0 0 16px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ width: 3, height: 18, background: '#0d8f8f', borderRadius: 2, display: 'inline-block' }} />
            Informations professionnelles
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 10,
          }}>
            {[
              { label: 'Cabinet / Organisation', value: issuer?.name },
              { label: "Pays d'exercice", value: countryName },
              { label: 'Ordre professionnel', value: ordreName },
              { label: "N° d'inscription", value: profile.numero_inscription },
              { label: 'Spécialité', value: profile.specialite },
              { label: 'Certification VeryTrust', value: `${plan.charAt(0).toUpperCase() + plan.slice(1)} · ${pl.fr}` },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} style={{
                padding: '12px 14px', background: '#f8fefe',
                borderRadius: 10, border: '1px solid #e8f4f4',
              }}>
                <div className="label" style={{ marginBottom: 4 }}>{label}</div>
                <div style={{ color: '#1a2535', fontSize: 13, fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{
              fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700,
              color: '#1a2535', margin: 0,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 3, height: 18, background: '#0d8f8f', borderRadius: 2, display: 'inline-block' }} />
              Documents certifiés
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 9px',
                borderRadius: 20, background: '#e8f7f7', color: '#0d8f8f',
              }}>
                {certificates.length}
              </span>
            </h2>
            {certificates.length > 0 && (
              <span style={{ fontSize: 11, color: '#8aadad' }}>
                {validCerts.length} valide{validCerts.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {certificates.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '44px 20px',
              background: 'white', borderRadius: 16,
              border: '1px solid #e8f4f4', color: '#8aadad',
            }}>
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ opacity: 0.4, marginBottom: 12 }}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <p style={{ fontSize: 13, margin: 0, fontFamily: 'Sora, sans-serif' }}>
                Aucun document certifié pour le moment.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {certificates.map(cert => (
                <CertCard key={cert.id} cert={cert} plan={plan} isMobile={isMobile} />
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 48, paddingTop: 24, borderTop: '1px solid #e8f4f4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 6, flexWrap: 'wrap',
          color: '#8aadad', fontSize: 11,
        }}>
          <svg width="12" height="12" fill="none" stroke="#0d8f8f" strokeWidth="2.5" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          <span>Profil certifié par VeryTrust · Réseau de confiance des professionnels africains ·</span>
          <Link to="/" style={{ color: '#0d8f8f', fontWeight: 600, textDecoration: 'none' }}>verytrust.app</Link>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  )
}

// ── Small helpers ──────────────────────────────────────────────────────────────

function MetaPill({ icon, children }) {
  return (
    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
      {icon}{children}
    </span>
  )
}

function ExternalLink({ href, icon, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.16)',
      borderRadius: 8, padding: '7px 13px',
      color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600,
      textDecoration: 'none', fontFamily: 'Sora, sans-serif',
    }}>
      {icon}{children}
    </a>
  )
}

function StatItem({ label, value, color = '#4a7070' }) {
  return (
    <div>
      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: '#8aadad', marginTop: 2 }}>{label}</div>
    </div>
  )
}

// ── Inline SVG icons ───────────────────────────────────────────────────────────
function IconPin() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IconStar() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}
function IconBriefcase() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  )
}
function IconId() {
  return (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10h2M16 14h2M8 10h.01"/><circle cx="8" cy="14" r="2"/>
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}
function IconGlobe() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
    </svg>
  )
}
