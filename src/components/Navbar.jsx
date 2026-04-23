import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LogoTeal } from './Logo'
import { useAuth } from '../hooks/useAuth'

const LANGS = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'pt', flag: '🇵🇹', label: 'PT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
]

function changeLang(i18n, code) {
  i18n.changeLanguage(code)
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = code
}

export default function Navbar({ variant = 'light' }) {
  const { t, i18n } = useTranslation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = variant === 'dark'

  const textColor = isDark ? 'rgba(255,255,255,0.7)' : '#6a9090'
  const bg = isDark ? 'rgba(10,40,40,0.95)' : 'rgba(255,255,255,0.96)'
  const border = isDark ? 'rgba(255,255,255,0.08)' : '#e8f4f4'

  const linkStyle = {
    fontSize: 13, color: textColor,
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'Sora, sans-serif', transition: 'color 0.2s', padding: '4px 0',
  }
  const ctaStyle = {
    background: '#0d8f8f', color: 'white', border: 'none',
    borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'Sora, sans-serif', transition: 'background 0.2s',
  }
  const langBtnStyle = (active) => ({
    background: active ? '#0d8f8f' : 'none',
    border: `1px solid ${active ? '#0d8f8f' : (isDark ? 'rgba(255,255,255,0.2)' : '#d4eded')}`,
    borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600,
    cursor: 'pointer',
    color: active ? 'white' : textColor,
    fontFamily: 'Sora, sans-serif',
  })

  function close() { setMenuOpen(false) }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: bg, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${border}`,
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 64,
      }}>
        <Link to="/" onClick={close}><LogoTeal showText={true} /></Link>

        {/* Desktop nav */}
        <div className="nav-center">
          <button style={linkStyle} onClick={() => navigate('/')}>{t('nav_home')}</button>
          <button style={linkStyle} onClick={() => navigate('/verify')}>{t('nav_verify')}</button>
          <button style={linkStyle}>{t('nav_reviewers')}</button>
          <button style={linkStyle}>{t('nav_editors')}</button>
        </div>

        <div className="nav-right">
          <div style={{ display: 'flex', gap: 4 }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => changeLang(i18n, l.code)} style={langBtnStyle(i18n.language === l.code)}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          {user ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button style={ctaStyle} onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button style={{ ...linkStyle, fontSize: 12 }} onClick={signOut}>{t('logout')}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...linkStyle, padding: '9px 14px' }} onClick={() => navigate('/login')}>{t('nav_login')}</button>
              <button style={ctaStyle} onClick={() => navigate('/register')}>{t('nav_cta')}</button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          style={{ color: isDark ? 'white' : '#0a2828' }}
        >
          <span className="hamburger-line" style={{ transform: menuOpen ? 'rotate(45deg) translateY(7px)' : '' }} />
          <span className="hamburger-line" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="hamburger-line" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : '' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.8)', padding: '10px 0', textAlign: 'left' }} onClick={() => { navigate('/'); close() }}>{t('nav_home')}</button>
        <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.8)', padding: '10px 0', textAlign: 'left' }} onClick={() => { navigate('/verify'); close() }}>{t('nav_verify')}</button>
        <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.8)', padding: '10px 0', textAlign: 'left' }}>{t('nav_reviewers')}</button>
        <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.8)', padding: '10px 0', textAlign: 'left' }}>{t('nav_editors')}</button>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0', paddingTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => { changeLang(i18n, l.code); close() }} style={langBtnStyle(i18n.language === l.code)}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {user ? (
            <>
              <button style={{ ...ctaStyle, flex: 1 }} onClick={() => { navigate('/dashboard'); close() }}>Dashboard</button>
              <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.6)', padding: '9px 14px' }} onClick={() => { signOut(); close() }}>{t('logout')}</button>
            </>
          ) : (
            <>
              <button style={{ ...linkStyle, color: 'rgba(255,255,255,0.7)', padding: '9px 14px' }} onClick={() => { navigate('/login'); close() }}>{t('nav_login')}</button>
              <button style={{ ...ctaStyle, flex: 1 }} onClick={() => { navigate('/register'); close() }}>{t('nav_cta')}</button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
