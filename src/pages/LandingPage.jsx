import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import { BadgeSVG } from '../components/Badge'
import { useIsMobile } from '../hooks/useIsMobile'

const LEVELS = [
  { key: 'bronze', plan: 'bronze', color: '#cd7f32', bg: '#fdf6ee', border: '#e8c8a0', name: 'Bronze', sub: 'Associate', cond: ['Inscription ordre professionnel', 'Formation 8h complétée', 'Test ≥ 75%'] },
  { key: 'silver', plan: 'silver', color: '#3d7a6e', bg: '#f0faf5', border: '#a8d4c8', name: 'Silver', sub: 'Certified', cond: ['Associate depuis 12 mois', '10 missions notées ≥ 4/5', 'Formation avancée 16h'] },
  { key: 'gold', plan: 'gold', color: '#c9a84c', bg: '#fffbea', border: '#e8d88a', name: 'Gold', sub: 'Fellow · CAC', cond: ['Certified depuis 24 mois', '50 missions ≥ 4.5/5', 'Quota strict : 50/pays'] },
  { key: 'platinum', plan: 'platinum', color: '#7090b0', bg: '#e8f0f8', border: '#b0c8e0', name: 'Platinum', sub: 'Grand Cabinet', cond: ['Cabinet international reconnu', 'Accréditation VeryTrust', 'Processus audit validé'] },
]

const SECTOR_ICONS = ['⚖', '§', '◈', '⌂', '✦', '◉', '♦', '▣']

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isMobile = useIsMobile()

  const sectionPad = isMobile ? '48px 20px' : '80px 40px'

  return (
    <div style={{ minHeight: '100vh', background: 'white' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ padding: isMobile ? '48px 20px 40px' : '80px 40px 64px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
        <div className="fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d8f8f' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: '#0d8f8f', textTransform: 'uppercase' }}>{t('hero_eyebrow')}</span>
          </div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 36 : 52, fontWeight: 900, lineHeight: 1.1, color: '#0a2828', marginBottom: 20 }}>
            {t('hero_title')}{' '}
            <em style={{ fontStyle: 'italic', color: '#0d8f8f' }}>{t('hero_title_em')}</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#6a9090', fontWeight: 300, marginBottom: 36, maxWidth: 480 }}>
            {t('hero_sub')}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: 14 }} onClick={() => navigate('/register')}>{t('hero_cta1')}</button>
            <button className="btn-secondary" style={{ fontSize: 14 }} onClick={() => navigate('/verify')}>{t('hero_cta2')}</button>
          </div>
        </div>

        {/* Mock card — hidden on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: 20, border: '1px solid #d4eded', padding: 28, boxShadow: '0 12px 48px rgba(13,143,143,0.10)', maxWidth: 320, width: '100%' }}>
              <div style={{ background: '#0d8f8f', borderRadius: 12, padding: '16px 20px', color: 'white', marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, opacity: 0.7, marginBottom: 4, textTransform: 'uppercase' }}>Vérification VeryTrust</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Vallion SA · Bilan 2024</div>
              </div>
              {[['Référentiel', 'SYSCOHADA 2017'], ['Certifié le', '12 avr. 2026'], ['Niveau', 'GOLD Fellow']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #f0fafa', fontSize: 12 }}>
                  <span style={{ color: '#8aadad', textTransform: 'uppercase', letterSpacing: 1, fontSize: 10 }}>{k}</span>
                  <span style={{ fontWeight: 700, color: k === 'Niveau' ? '#c9a84c' : '#0a2828' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, background: '#e8f7f7', borderRadius: 10, padding: '10px 14px' }}>
                <BadgeSVG plan="gold" size={44} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0d8f8f' }}>VERYTRUST CERTIFIED</div>
                  <div style={{ fontSize: 10, color: '#4a7070' }}>Généré par FINETA · Gold Fellow</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', borderTop: '1px solid #e8f4f4', borderBottom: '1px solid #e8f4f4', background: '#f8fefe' }}>
        {[['54', t('stat1')], ['140k+', t('stat2')], ['5', t('stat3')], ['3s', t('stat4')]].map(([n, l]) => (
          <div key={l} style={{ padding: isMobile ? '20px 16px' : '28px 40px', borderRight: '1px solid #e8f4f4', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 28 : 36, fontWeight: 900, color: '#0d8f8f', marginBottom: 4 }}>{n}</div>
            <div style={{ fontSize: 11, color: '#8aadad' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* LEVELS */}
      <section style={{ padding: sectionPad, maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d8f8f' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: '#0d8f8f', textTransform: 'uppercase' }}>{t('levels_eyebrow')}</span>
        </div>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 26 : 38, fontWeight: 900, color: '#0a2828', marginBottom: 40, maxWidth: 460 }}>{t('levels_title')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 20 }}>
          {LEVELS.map(l => (
            <div key={l.key} style={{ borderRadius: 14, border: `1px solid ${l.border}`, padding: isMobile ? 16 : 24, background: 'white', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,143,143,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
              <div style={{ marginBottom: 12 }}>
                <BadgeSVG plan={l.plan} size={isMobile ? 52 : 72} />
              </div>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1, background: l.bg, color: l.color, border: `1px solid ${l.border}`, marginBottom: 10 }}>
                ◆ {l.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 15 : 18, fontWeight: 900, color: '#0a2828', marginBottom: 8 }}>{l.sub}</div>
              <div style={{ fontSize: 12, color: '#6a9090', lineHeight: 1.6, marginBottom: isMobile ? 0 : 14 }}>{t(`${l.key}_desc`)}</div>
              {!isMobile && (
                <ul style={{ listStyle: 'none' }}>
                  {l.cond.map(c => (
                    <li key={c} style={{ fontSize: 11, color: '#4a7070', padding: '5px 0', borderBottom: '1px solid #f0fafa', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#0d8f8f', fontWeight: 700, fontSize: 10 }}>→</span>{c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTORS */}
      <div style={{ background: '#f0fafa', borderTop: '1px solid #d4eded', borderBottom: '1px solid #d4eded' }}>
        <section style={{ padding: sectionPad, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d8f8f' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: '#0d8f8f', textTransform: 'uppercase' }}>{t('sectors_eyebrow')}</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 26 : 36, fontWeight: 900, color: '#0a2828', marginBottom: 32 }}>{t('sectors_title')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 10 : 16 }}>
            {SECTOR_ICONS.map((icon, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: isMobile ? '16px 12px' : '20px 16px', border: '1px solid #e0f0f0', textAlign: 'center', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0d8f8f'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0f0f0'}>
                <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: '#0a2828', marginBottom: 4 }}>{t(`sector_${i}_name`)}</div>
                <div style={{ fontSize: 11, color: '#8aadad', lineHeight: 1.5 }}>{t(`sector_${i}_desc`)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA BAND */}
      <div style={{ background: '#0d8f8f', padding: isMobile ? '48px 20px' : '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: isMobile ? 24 : 32, fontWeight: 900, color: 'white', marginBottom: 12 }}>{t('cta_title')}</h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 28 }}>{t('cta_sub')}</p>
        <button onClick={() => navigate('/register')} style={{ background: 'white', color: '#0d8f8f', border: 'none', borderRadius: 9, padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}>
          {t('cta_btn')}
        </button>
      </div>

      {/* FOOTER */}
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '16px 20px' : '20px 40px', borderTop: '1px solid #e8f4f4', background: '#fafefe', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontWeight: 800, fontSize: 14, color: '#8aadad', letterSpacing: 1 }}>VERYTRUST</span>
        <span style={{ fontSize: 11, color: '#b8d0d0' }}>verytrust.africa · 2026 · Vallion</span>
      </footer>
    </div>
  )
}
