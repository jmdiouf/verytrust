import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { LogoTeal } from '../components/Logo'

export default function TwoFactorSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [totp, setTotp] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!user) return
    const secret = new OTPAuth.Secret({ size: 20 })
    const newTotp = new OTPAuth.TOTP({
      issuer: 'VeryTrust',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    })
    setTotp(newTotp)
    QRCode.toDataURL(newTotp.toString(), {
      width: 220,
      margin: 2,
      color: { dark: '#0a2828', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then(setQrDataUrl)
  }, [user])

  async function handleVerify(e) {
    e.preventDefault()
    if (!totp) return
    setLoading(true)
    setError('')
    const delta = totp.validate({ token: code.replace(/\s/g, ''), window: 1 })
    if (delta === null) {
      setError("Code incorrect. Vérifiez l'heure de votre appareil et réessayez.")
      setLoading(false)
      return
    }
    const { error: dbError } = await supabase
      .from('users')
      .update({ two_factor_secret: totp.secret.base32, two_factor_enabled: true })
      .eq('id', user.id)
    if (dbError) {
      setError('Erreur lors de la sauvegarde : ' + dbError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  if (success) return (
    <div className="page-center">
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: '#0a2828', marginBottom: 12 }}>
          2FA activée !
        </h2>
        <p style={{ fontSize: 14, color: '#6a9090', lineHeight: 1.7, marginBottom: 24 }}>
          L'authentification à double facteur est maintenant active. Votre compte est protégé.
        </p>
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>Retour au dashboard</button>
      </div>
    </div>
  )

  return (
    <div className="page-center" style={{ padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <LogoTeal size={48} showText={false} />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 6 }}>
            Activer la 2FA
          </h1>
          <p style={{ fontSize: 13, color: '#6a9090' }}>
            Protégez votre compte avec Google Authenticator
          </p>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 32px rgba(13,143,143,0.08)' }}>

          {/* Étape 1 — Scanner le QR */}
          <div style={{ marginBottom: 28 }}>
            <StepLabel n={1} text="Scannez ce QR code avec Google Authenticator" />
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16, background: '#f8fefe', borderRadius: 12, border: '1px solid #d4eded', marginBottom: 12 }}>
              {qrDataUrl
                ? <img src={qrDataUrl} alt="QR code 2FA" width={200} height={200} style={{ display: 'block' }} />
                : <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="spinner" style={{ borderTopColor: '#0d8f8f', borderColor: '#d4eded', width: 28, height: 28 }} />
                  </div>
              }
            </div>
            {totp && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#8aadad', marginBottom: 4 }}>Clé manuelle (si scan impossible)</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#0a2828', background: '#f0fafa', padding: '6px 12px', borderRadius: 6, display: 'inline-block', letterSpacing: 1, wordBreak: 'break-all' }}>
                  {totp.secret.base32}
                </div>
              </div>
            )}
          </div>

          {/* Étape 2 — Confirmer le code */}
          <div>
            <StepLabel n={2} text="Entrez le code à 6 chiffres pour confirmer" />
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleVerify}>
              <input
                className="input-field"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000 000"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                style={{ textAlign: 'center', fontSize: 24, fontWeight: 700, letterSpacing: 10, marginBottom: 16 }}
                autoFocus
              />
              <button
                className="btn-primary"
                style={{ width: '100%', padding: 13, fontSize: 14 }}
                disabled={loading || code.length < 6}
              >
                {loading ? <span className="spinner" /> : 'Confirmer et activer la 2FA'}
              </button>
            </form>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: '#0d8f8f', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontSize: 13 }}
          >
            ← Annuler
          </button>
        </p>
      </div>
    </div>
  )
}

function StepLabel({ n, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#0d8f8f', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {n}
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#0a2828' }}>{text}</span>
    </div>
  )
}
