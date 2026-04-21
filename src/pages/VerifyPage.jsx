import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase, formatDate, PLAN_COLORS, PLAN_LABELS, DOC_TYPES, generateQRCode } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { BadgeSVG } from '../components/Badge'

export default function VerifyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [searchId, setSearchId] = useState(id || '')
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [urlCopied, setUrlCopied] = useState(false)

  useEffect(() => {
    if (id) fetchCert(id)
    else setLoading(false)
  }, [id])

  async function fetchCert(certId) {
    setLoading(true)
    const { data, error } = await supabase
      .from('certificates')
      .select('*, issuers(name, domain, plan)')
      .eq('id', certId.toUpperCase())
      .single()
    if (error || !data) { setNotFound(true) }
    else {
      setCert(data)
      setNotFound(false)
      const qr = await generateQRCode(certId.toUpperCase())
      setQrDataUrl(qr)
      await supabase.from('verifications').insert({ certificate_id: certId.toUpperCase(), user_agent: navigator.userAgent })
    }
    setLoading(false)
  }

  const plan = cert?.issuers?.plan || 'bronze'
  const pc = PLAN_COLORS[plan] || PLAN_COLORS.bronze
  const pl = PLAN_LABELS[plan] || PLAN_LABELS.bronze
  const lang = i18n.language === 'fr' ? 'fr' : 'en'

  return (
    <div style={{ minHeight: '100vh', background: '#f0fafa' }}>
      <Navbar />

      {/* Search bar */}
      <div style={{ background: 'white', borderBottom: '1px solid #d4eded', padding: '16px 40px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 10 }}>
          <input
            className="input-field"
            placeholder="Entrez un identifiant VeryTrust (ex: VT-2026-A3B7C2D1)"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(`/verify/${searchId.trim()}`)}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={() => navigate(`/verify/${searchId.trim()}`)}>Vérifier</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 'calc(100vh - 180px)' }}>

        {loading && (
          <div style={{ textAlign: 'center', color: '#0d8f8f' }}>
            <div className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 32, height: 32, margin: '0 auto 16px' }} />
            <div style={{ fontSize: 14 }}>Vérification en cours...</div>
          </div>
        )}

        {!loading && !id && (
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 12 }}>Vérifier un document</h2>
            <p style={{ fontSize: 14, color: '#6a9090', lineHeight: 1.7 }}>Entrez l'identifiant VeryTrust inscrit sur le document (format VT-AAAA-XXXXXXXX) ou scannez le QR code.</p>
          </div>
        )}

        {!loading && id && (notFound || !cert?.is_valid) && (
          <div style={{ background: 'white', borderRadius: 20, border: '1px solid #f0c0c0', padding: '40px 32px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(220,50,50,0.08)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fef2f2', border: '2px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✗</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, color: '#dc2626', marginBottom: 8 }}>Document Invalide</h2>
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>Ce certificat est invalide ou n'existe pas dans notre base de données. Vérifiez l'identifiant et réessayez.</p>
            <div style={{ marginTop: 20, padding: 12, background: '#fef2f2', borderRadius: 8, fontFamily: 'monospace', fontSize: 12, color: '#dc2626' }}>{id}</div>
          </div>
        )}

        {!loading && cert?.is_valid && (
          <div style={{ width: '100%', maxWidth: 520, background: 'white', borderRadius: 20, border: `1px solid ${pc.border}`, overflow: 'hidden', boxShadow: '0 12px 48px rgba(13,143,143,0.10)' }} className="fade-in">

            {/* Header */}
            <div style={{ background: '#0d8f8f', padding: '32px 32px 28px', textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 11, letterSpacing: 3, opacity: 0.6, marginBottom: 16, fontWeight: 600 }}>✦ VERYTRUST</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <BadgeSVG plan={plan} size={80} />
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Document Authentique</div>
              <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
                Ce document a été enregistré et scellé. Toute modification le rendrait invalide.
              </div>
            </div>

            {/* Level explanation */}
            <div style={{ background: pc.bg, padding: '12px 32px', borderBottom: `1px solid ${pc.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: pc.main, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: pc.text, textTransform: 'uppercase', letterSpacing: 1 }}>{plan.toUpperCase()} · {pl[`fr`]}</span>
                <span style={{ fontSize: 11, color: pc.text, opacity: 0.7 }}> — {pl.desc_fr}</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 32px' }}>
              {[
                { icon: '⌂', label: 'Entreprise', value: cert.entity_name, hint: cert.entity_ref },
                { icon: '◧', label: 'Type de document', value: DOC_TYPES[cert.document_type]?.fr || cert.document_type, hint: `${cert.referentiel || ''}${cert.fiscal_year ? ` · Exercice ${cert.fiscal_year}` : ''}` },
                { icon: '◷', label: 'Certifié le', value: formatDate(cert.issued_at, 'fr'), hint: null },
                { icon: '#', label: 'Identifiant', value: cert.id, hint: null, mono: true },
                { icon: '✦', label: 'Certifié par', value: cert.issuers?.name, hint: 'Plateforme certifiée VeryTrust', badge: plan.toUpperCase() },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 0', borderBottom: '1px solid #f0fafa' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#e8f7f7', border: '1px solid #c0e4e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, color: '#0d8f8f', fontWeight: 900 }}>{row.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#8aadad', textTransform: 'uppercase', marginBottom: 3 }}>{row.label}</div>
                    <div style={{ fontSize: row.mono ? 13 : 14, fontWeight: 700, color: '#0a2828', fontFamily: row.mono ? 'monospace' : 'inherit', letterSpacing: row.mono ? 1 : 0, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {row.value}
                      {row.badge && <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 20, background: pc.bg, color: pc.main, border: `1px solid ${pc.border}`, fontWeight: 700, letterSpacing: 1, fontFamily: 'Sora, sans-serif' }}>{row.badge}</span>}
                    </div>
                    {row.hint && <div style={{ fontSize: 11, color: '#8aadad', marginTop: 2 }}>{row.hint}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: '20px 32px', background: '#f8fefe', borderTop: '1px solid #e8f4f4' }}>

              {/* QR Code re-partage */}
              {qrDataUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'white', border: '1px solid #d4eded', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                  <img src={qrDataUrl} alt="QR code de vérification" width={80} height={80} style={{ borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0a2828', marginBottom: 4 }}>Partager ce certificat</div>
                    <div style={{ fontSize: 10, color: '#8aadad', marginBottom: 10, lineHeight: 1.5 }}>Scannez pour vérifier ou partagez l'URL directe.</div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`https://verytrust.africa/verify/${cert.id}`)
                        setUrlCopied(true)
                        setTimeout(() => setUrlCopied(false), 2000)
                      }}
                      style={{ fontSize: 11, padding: '5px 12px', border: '1px solid #a8dede', borderRadius: 6, background: 'white', color: '#0d8f8f', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontWeight: 600 }}
                    >
                      {urlCopied ? '✓ Copié !' : '⎘ Copier l\'URL'}
                    </button>
                  </div>
                </div>
              )}

              <button style={{ width: '100%', padding: 13, background: '#0d8f8f', color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', marginBottom: 10 }}>
                ↓ Télécharger l'attestation de vérification
              </button>
              <div style={{ fontSize: 10, color: '#8aadad', textAlign: 'center', lineHeight: 1.5 }}>
                VeryTrust certifie l'authenticité du processus, non l'exactitude du contenu. La responsabilité des chiffres incombe au professionnel signataire.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
