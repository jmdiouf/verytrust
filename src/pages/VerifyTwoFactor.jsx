import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as OTPAuth from 'otpauth'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { LogoTeal } from '../components/Logo'

export default function VerifyTwoFactor() {
  const { user, setTwoFactorVerified } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data: prof, error: dbError } = await supabase
        .from('users')
        .select('two_factor_secret')
        .eq('id', user.id)
        .single()

      if (dbError || !prof?.two_factor_secret) {
        throw new Error('Secret 2FA introuvable. Contactez le support.')
      }

      const totp = new OTPAuth.TOTP({
        issuer: 'VeryTrust',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(prof.two_factor_secret),
      })

      const delta = totp.validate({ token: code, window: 1 })
      if (delta === null) {
        setError('Code incorrect ou expiré. Réessayez.')
        setLoading(false)
        return
      }

      setTwoFactorVerified(true)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 380 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <LogoTeal size={48} showText={false} />
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: '#0a2828', marginBottom: 6 }}>
            Vérification 2FA
          </h1>
          <p style={{ fontSize: 13, color: '#6a9090' }}>
            Entrez le code affiché dans votre application d'authentification
          </p>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 32px rgba(13,143,143,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 20 }}>🔐</div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              className="input-field"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, letterSpacing: 12, marginBottom: 20 }}
              autoFocus
            />
            <button
              className="btn-primary"
              style={{ width: '100%', padding: 13, fontSize: 14 }}
              disabled={loading || code.length < 6}
            >
              {loading ? <span className="spinner" /> : 'Vérifier le code'}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: 11, color: '#8aadad' }}>
            Le code est renouvelé toutes les 30 secondes.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6a9090' }}>
          Problème d'accès ?{' '}
          <button
            onClick={async () => { await supabase.auth.signOut(); navigate('/login') }}
            style={{ background: 'none', border: 'none', color: '#0d8f8f', cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontSize: 13, fontWeight: 600 }}
          >
            Se déconnecter
          </button>
        </p>
      </div>
    </div>
  )
}
