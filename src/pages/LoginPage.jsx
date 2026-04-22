import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { LogoTeal } from '../components/Logo'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    // Check if 2FA is enabled for this user
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('two_factor_enabled, two_factor_secret')
        .eq('id', authUser.id)
        .single()
      if (prof?.two_factor_enabled && prof?.two_factor_secret) {
        navigate('/verify-2fa')
        return
      }
    }
    navigate('/dashboard')
  }

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><LogoTeal size={48} showText={false} /></div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 6 }}>Connexion</h1>
          <p style={{ fontSize: 13, color: '#6a9090' }}>Accédez à votre espace VeryTrust</p>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 32px rgba(13,143,143,0.08)' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Adresse email</label>
              <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@organisation.com" required />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label className="label">Mot de passe</label>
              <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: '#0d8f8f' }}>Mot de passe oublié ?</Link>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 14 }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Se connecter'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6a9090' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#0d8f8f', fontWeight: 600 }}>S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
