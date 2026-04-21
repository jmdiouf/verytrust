import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LogoTeal } from '../components/Logo'

const PLANS = [
  { key: 'bronze', label: 'Bronze — Associate', desc: 'Logiciel ou outil certifié VeryTrust', color: '#cd7f32', bg: '#fdf6ee' },
  { key: 'silver', label: 'Silver — Certified', desc: 'Expert-comptable certifié VeryTrust', color: '#3d7a6e', bg: '#f0faf5' },
  { key: 'gold', label: 'Gold — Fellow CAC', desc: 'Commissaire aux Comptes certifié', color: '#c9a84c', bg: '#fffbea' },
  { key: 'platinum', label: 'Platinum — Grand Cabinet', desc: 'Cabinet international certifié', color: '#7090b0', bg: '#e8f0f8' },
]

export default function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', confirm: '', orgName: '', domain: '', plan: 'bronze' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setLoading(true); setError('')
    const { error } = await signUp(form.email, form.password, { org_name: form.orgName, domain: form.domain, plan: form.plan })
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  if (success) return (
    <div className="page-center">
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 900, color: '#0a2828', marginBottom: 12 }}>Vérifiez votre email</h2>
        <p style={{ fontSize: 14, color: '#6a9090', lineHeight: 1.7, marginBottom: 24 }}>Nous avons envoyé un lien de confirmation à <strong>{form.email}</strong>. Cliquez sur ce lien pour activer votre compte.</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Aller à la connexion</button>
      </div>
    </div>
  )

  return (
    <div className="page-center" style={{ padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><LogoTeal size={48} showText={false} /></div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 900, color: '#0a2828', marginBottom: 6 }}>Créer un compte</h1>
          <p style={{ fontSize: 13, color: '#6a9090' }}>Rejoignez le standard de confiance africain</p>
        </div>

        <div className="card" style={{ boxShadow: '0 8px 32px rgba(13,143,143,0.08)' }}>
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Nom de votre organisation</label>
              <input className="input-field" value={form.orgName} onChange={e => set('orgName', e.target.value)} placeholder="Cabinet Dupont & Associés" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Adresse email professionnelle</label>
              <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@cabinet.com" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Domaine web (optionnel)</label>
              <input className="input-field" value={form.domain} onChange={e => set('domain', e.target.value)} placeholder="cabinet.com" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Niveau de certification souhaité</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {PLANS.map(p => (
                  <div key={p.key} onClick={() => set('plan', p.key)} style={{ padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${form.plan === p.key ? p.color : '#e0ecec'}`, background: form.plan === p.key ? p.bg : 'white', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.label}</div>
                    <div style={{ fontSize: 10, color: '#8aadad', marginTop: 2 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Mot de passe</label>
              <input className="input-field" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 caractères" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label className="label">Confirmer le mot de passe</label>
              <input className="input-field" type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 14 }} disabled={loading}>
              {loading ? <span className="spinner" /> : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6a9090' }}>
          Déjà un compte ?{' '}
          <Link to="/login" style={{ color: '#0d8f8f', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
