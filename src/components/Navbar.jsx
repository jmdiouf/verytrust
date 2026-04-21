import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogoTeal, LogoGold } from './Logo'
import { useAuth } from '../hooks/useAuth'

const LANGS = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'pt', flag: '🇵🇹', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
]

export default function Navbar({ variant = 'light' }) {
  const { t, i18n } = useTranslation()
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const isDark = variant === 'dark'

  const styles = {
    nav: {
      position: 'sticky', top: 0, zIndex: 100,
      background: isDark ? 'rgba(10,40,40,0.95)' : 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e8f4f4'}`,
      padding: '0 40px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 64,
    },
    link: {
      fontSize: 13, color: isDark ? 'rgba(255,255,255,0.7)' : '#6a9090',
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: 'Sora, sans-serif', transition: 'color 0.2s', padding: '4px 0',
    },
    cta: {
      background: '#0d8f8f', color: 'white', border: 'none',
      borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'background 0.2s',
    },
    langBtn: {
      background: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#d4eded'}`,
      borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600,
      cursor: 'pointer', color: isDark ? 'rgba(255,255,255,0.6)' : '#6a9090',
      fontFamily: 'Sora, sans-serif',
    }
  }

  return (
    <nav style={styles.nav}>
      <Link to="/"><LogoTeal showText={true} /></Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <button style={styles.link} onClick={() => navigate('/')}>{t('nav_home')}</button>
        <button style={styles.link} onClick={() => navigate('/verify')}>{t('nav_verify')}</button>
        <button style={styles.link}>{t('nav_reviewers')}</button>
        <button style={styles.link}>{t('nav_editors')}</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Language selector */}
        <div style={{ display: 'flex', gap: 4 }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => {
                i18n.changeLanguage(l.code)
                document.documentElement.dir = l.code === 'ar' ? 'rtl' : 'ltr'
              }}
              style={{
                ...styles.langBtn,
                background: i18n.language === l.code ? '#0d8f8f' : 'none',
                color: i18n.language === l.code ? 'white' : (isDark ? 'rgba(255,255,255,0.6)' : '#6a9090'),
                borderColor: i18n.language === l.code ? '#0d8f8f' : (isDark ? 'rgba(255,255,255,0.2)' : '#d4eded'),
              }}
            >{l.flag} {l.label}</button>
          ))}
        </div>

        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={styles.cta} onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button style={{ ...styles.link, fontSize: 12 }} onClick={signOut}>{t('logout')}</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ ...styles.link, padding: '9px 14px' }} onClick={() => navigate('/login')}>{t('nav_login')}</button>
            <button style={styles.cta} onClick={() => navigate('/register')}>{t('nav_cta')}</button>
          </div>
        )}
      </div>
    </nav>
  )
}
