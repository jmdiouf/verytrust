import { PLAN_COLORS } from '../lib/supabase'

const PLAN_CONFIG = {
  bronze: {
    ring1: '#7a3a1a', ring2: '#cd7f32', inner: '#fff8f0',
    accent: '#cd7f32', text: '#8b5a1a', banner: '#cd7f32',
    label: 'BRONZE', sublabel: 'Associate',
    desc: 'Logiciel certifié VeryTrust'
  },
  silver: {
    ring1: '#1a2535', ring2: '#3d7a6e', inner: '#f5f8f5',
    accent: '#3d7a6e', text: '#2a5040', banner: '#3d7a6e',
    label: 'SILVER', sublabel: 'Certified',
    desc: 'Expert-comptable certifié VeryTrust'
  },
  gold: {
    ring1: '#1a2535', ring2: '#c9a84c', inner: '#fffbea',
    accent: '#c9a84c', text: '#8b6914', banner: '#c9a84c',
    label: 'GOLD', sublabel: 'Fellow · CAC',
    desc: 'Commissaire aux Comptes certifié VeryTrust'
  },
  platinum: {
    ring1: '#1a2535', ring2: '#7090b0', inner: '#f0f6fc',
    accent: '#7090b0', text: '#2a4060', banner: '#7090b0',
    label: 'PLATINUM', sublabel: 'Grand Cabinet',
    desc: 'Cabinet international certifié VeryTrust'
  }
}

export function BadgeSVG({ plan = 'gold', size = 160, certId = '', date = '' }) {
  const c = PLAN_CONFIG[plan] || PLAN_CONFIG.gold

  return (
    <svg width={size} height={size} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring segments */}
      <path d="M80,8 A72,72 0 0,1 142,44 L130,51 A58,58 0 0,0 80,22 Z" fill={c.ring1}/>
      <path d="M142,44 A72,72 0 0,1 152,80 L138,80 A58,58 0 0,0 130,51 Z" fill={c.ring2}/>
      <path d="M152,80 A72,72 0 0,1 142,116 L130,109 A58,58 0 0,0 138,80 Z" fill={c.ring1}/>
      <path d="M142,116 A72,72 0 0,1 80,152 L80,138 A58,58 0 0,0 130,109 Z" fill={c.ring2}/>
      <path d="M80,152 A72,72 0 0,1 18,116 L30,109 A58,58 0 0,0 80,138 Z" fill={c.ring1}/>
      <path d="M18,116 A72,72 0 0,1 8,80 L22,80 A58,58 0 0,0 30,109 Z" fill={c.ring2}/>
      <path d="M8,80 A72,72 0 0,1 18,44 L30,51 A58,58 0 0,0 22,80 Z" fill={c.ring1}/>
      <path d="M18,44 A72,72 0 0,1 80,8 L80,22 A58,58 0 0,0 30,51 Z" fill={c.ring2} opacity="0.7"/>

      {/* White separators */}
      <line x1="80" y1="8" x2="80" y2="22" stroke="white" strokeWidth="3"/>
      <line x1="142" y1="44" x2="130" y2="51" stroke="white" strokeWidth="3"/>
      <line x1="152" y1="80" x2="138" y2="80" stroke="white" strokeWidth="3"/>
      <line x1="142" y1="116" x2="130" y2="109" stroke="white" strokeWidth="3"/>
      <line x1="80" y1="152" x2="80" y2="138" stroke="white" strokeWidth="3"/>
      <line x1="18" y1="116" x2="30" y2="109" stroke="white" strokeWidth="3"/>
      <line x1="8" y1="80" x2="22" y2="80" stroke="white" strokeWidth="3"/>
      <line x1="18" y1="44" x2="30" y2="51" stroke="white" strokeWidth="3"/>

      {/* Inner circle */}
      <circle cx="80" cy="80" r="52" fill={c.inner} stroke={c.accent} strokeWidth="1.5"/>

      {/* Africa silhouette watermark */}
      <path d="M72,42 C68,42 64,44 63,47 C62,50 62,52 61,55 C60,57 59,59 59,62 C59,65 60,67 60,70 C60,73 58,75 59,78 C60,81 62,82 63,85 C64,88 63,91 65,94 C67,97 69,99 70,102 C71,105 70,108 72,110 C74,112 76,112 77,114 C78,116 78,118 80,119 C82,120 84,118 85,116 C86,114 86,112 88,111 C90,110 92,110 93,108 C94,106 93,103 94,101 C95,98 97,96 97,93 C97,90 96,88 96,85 C96,82 97,80 97,77 C97,74 95,72 96,69 C97,66 98,64 97,61 C96,58 94,57 93,54 C92,51 92,48 90,46 C88,44 85,43 83,42 C81,42 79,42 76,42 C74,42 73,42 72,42Z" fill={c.accent} opacity="0.12"/>

      {/* VERYTRUST text arc */}
      <path id={`arc-${plan}`} d="M 36,72 A 44,44 0 0,1 124,72" fill="none"/>
      <text fontSize="10" fontFamily="Sora, sans-serif" fontWeight="700" fill={c.accent} letterSpacing="3">
        <textPath href={`#arc-${plan}`} startOffset="12%">VERYTRUST</textPath>
      </text>

      {/* Document icon */}
      <rect x="63" y="62" width="26" height="32" rx="3" fill="white" stroke={c.accent} strokeWidth="2"/>
      <line x1="68" y1="70" x2="84" y2="70" stroke={c.accent} strokeWidth="1.5"/>
      <line x1="68" y1="75" x2="84" y2="75" stroke={c.accent} strokeWidth="1.5"/>
      <line x1="68" y1="80" x2="78" y2="80" stroke={c.accent} strokeWidth="1.5"/>

      {/* Checkmark circle */}
      <circle cx="83" cy="89" r="9" fill={c.accent}/>
      <polyline points="79,89 82,92 88,85" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Banner ribbon */}
      <path d="M30,112 L20,124 L26,122 L28,128 L80,118 L132,128 L134,122 L140,124 L130,112 Z" fill={c.banner}/>
      <path d="M34,108 L126,108 L130,116 L80,120 L30,116 Z" fill={c.banner}/>

      {/* Stars */}
      <text x="38" y="117" fontSize="8" fill="white" textAnchor="middle">★</text>
      <text x="122" y="117" fontSize="8" fill="white" textAnchor="middle">★</text>

      {/* Level text */}
      <text x="80" y="117" fontSize="11" fontFamily="Sora, sans-serif" fontWeight="800" fill="white" textAnchor="middle" letterSpacing="2">{c.label}</text>

      {/* Cert ID if provided */}
      {certId && (
        <text x="80" y="148" fontSize="6" fontFamily="monospace" fill={c.text} textAnchor="middle" opacity="0.7">{certId}</text>
      )}
    </svg>
  )
}

// Returns a rich SVG string (580×140) with badge, all infos and embedded QR code PNG
export function generateRichSealSVG({ plan, certId, entityName, documentType, issuedAt, issuerName, qrDataUrl }) {
  const c = PLAN_CONFIG[plan] || PLAN_CONFIG.bronze
  const date = new Date(issuedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = new Date(issuedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 140">
  <!-- Background -->
  <rect width="580" height="140" rx="8" fill="white"/>
  <!-- Left accent bar -->
  <rect x="0" y="0" width="5" height="140" rx="3" fill="${c.ring2}"/>

  <!-- Badge mini (scale 1.5 of 80×80 mini = 120×120) -->
  <g transform="translate(13, 10) scale(1.5)">
    <path d="M40,4 A36,36 0 0,1 71,22 L65,25.5 A29,29 0 0,0 40,11 Z" fill="${c.ring1}"/>
    <path d="M71,22 A36,36 0 0,1 76,40 L69,40 A29,29 0 0,0 65,25.5 Z" fill="${c.ring2}"/>
    <path d="M76,40 A36,36 0 0,1 71,58 L65,54.5 A29,29 0 0,0 69,40 Z" fill="${c.ring1}"/>
    <path d="M71,58 A36,36 0 0,1 40,76 L40,69 A29,29 0 0,0 65,54.5 Z" fill="${c.ring2}"/>
    <path d="M40,76 A36,36 0 0,1 9,58 L15,54.5 A29,29 0 0,0 40,69 Z" fill="${c.ring1}"/>
    <path d="M9,58 A36,36 0 0,1 4,40 L11,40 A29,29 0 0,0 15,54.5 Z" fill="${c.ring2}"/>
    <path d="M4,40 A36,36 0 0,1 9,22 L15,25.5 A29,29 0 0,0 11,40 Z" fill="${c.ring1}"/>
    <path d="M9,22 A36,36 0 0,1 40,4 L40,11 A29,29 0 0,0 15,25.5 Z" fill="${c.ring2}" opacity="0.7"/>
    <circle cx="40" cy="40" r="26" fill="white" stroke="${c.accent}" stroke-width="1"/>
    <rect x="30" y="28" width="16" height="20" rx="2" fill="none" stroke="${c.accent}" stroke-width="1.5"/>
    <line x1="33" y1="33" x2="43" y2="33" stroke="${c.accent}" stroke-width="1"/>
    <line x1="33" y1="37" x2="43" y2="37" stroke="${c.accent}" stroke-width="1"/>
    <line x1="33" y1="41" x2="39" y2="41" stroke="${c.accent}" stroke-width="1"/>
    <circle cx="43" cy="45" r="6" fill="${c.accent}"/>
    <polyline points="40.5,45 42.5,47 46,42.5" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
  </g>

  <!-- Vertical divider -->
  <line x1="148" y1="14" x2="148" y2="126" stroke="#d4eded" stroke-width="1"/>

  <!-- Text section -->
  <text x="162" y="32" font-family="Sora, sans-serif" font-size="10" font-weight="800" fill="${c.accent}" letter-spacing="2">VERYTRUST · ${c.label}</text>
  <text x="162" y="46" font-family="Sora, sans-serif" font-size="7.5" fill="${c.text}">${c.sublabel} — ${c.desc}</text>
  <line x1="162" y1="54" x2="440" y2="54" stroke="#e8f4f4" stroke-width="1"/>
  <text x="162" y="70" font-family="Sora, sans-serif" font-size="8" fill="#4a7070">${entityName} · ${documentType}</text>
  <text x="162" y="84" font-family="Sora, sans-serif" font-size="8" fill="#4a7070">Certifié par ${issuerName} · ${date} à ${time}</text>
  <text x="162" y="104" font-family="monospace" font-size="12" font-weight="700" fill="${c.text}" letter-spacing="2">${certId}</text>
  <text x="162" y="120" font-family="Sora, sans-serif" font-size="7" fill="${c.text}" opacity="0.45">verytrust.africa/verify/${certId}</text>

  <!-- QR Code PNG embedded -->
  <image x="450" y="10" width="120" height="120" href="${qrDataUrl}" preserveAspectRatio="xMidYMid meet"/>
  <text x="510" y="138" font-family="Sora, sans-serif" font-size="6" fill="${c.text}" opacity="0.5" text-anchor="middle">Scanner pour vérifier</text>

  <!-- Outer border -->
  <rect x="0.5" y="0.5" width="579" height="139" rx="7.5" fill="none" stroke="${c.accent}" stroke-width="1.5" opacity="0.35"/>
</svg>`
}

// Returns SVG string for embedding in PDFs
export function generateSealSVG({ plan, certId, entityName, documentType, issuedAt, issuerName }) {
  const c = PLAN_CONFIG[plan] || PLAN_CONFIG.bronze
  const date = new Date(issuedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 80">
  <!-- Badge mini -->
  <g transform="scale(0.6) translate(0,-8)">
    <path d="M40,4 A36,36 0 0,1 71,22 L65,25.5 A29,29 0 0,0 40,11 Z" fill="${c.ring1}"/>
    <path d="M71,22 A36,36 0 0,1 76,40 L69,40 A29,29 0 0,0 65,25.5 Z" fill="${c.ring2}"/>
    <path d="M76,40 A36,36 0 0,1 71,58 L65,54.5 A29,29 0 0,0 69,40 Z" fill="${c.ring1}"/>
    <path d="M71,58 A36,36 0 0,1 40,76 L40,69 A29,29 0 0,0 65,54.5 Z" fill="${c.ring2}"/>
    <path d="M40,76 A36,36 0 0,1 9,58 L15,54.5 A29,29 0 0,0 40,69 Z" fill="${c.ring1}"/>
    <path d="M9,58 A36,36 0 0,1 4,40 L11,40 A29,29 0 0,0 15,54.5 Z" fill="${c.ring2}"/>
    <path d="M4,40 A36,36 0 0,1 9,22 L15,25.5 A29,29 0 0,0 11,40 Z" fill="${c.ring1}"/>
    <path d="M9,22 A36,36 0 0,1 40,4 L40,11 A29,29 0 0,0 15,25.5 Z" fill="${c.ring2}" opacity="0.7"/>
    <circle cx="40" cy="40" r="26" fill="white" stroke="${c.accent}" stroke-width="1"/>
    <rect x="30" y="28" width="16" height="20" rx="2" fill="none" stroke="${c.accent}" stroke-width="1.5"/>
    <line x1="33" y1="33" x2="43" y2="33" stroke="${c.accent}" stroke-width="1"/>
    <line x1="33" y1="37" x2="43" y2="37" stroke="${c.accent}" stroke-width="1"/>
    <line x1="33" y1="41" x2="39" y2="41" stroke="${c.accent}" stroke-width="1"/>
    <circle cx="43" cy="45" r="6" fill="${c.accent}"/>
    <polyline points="40.5,45 42.5,47 46,42.5" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
  </g>
  <!-- Text info -->
  <text x="58" y="18" font-family="Sora, sans-serif" font-size="8" font-weight="700" fill="${c.accent}" letter-spacing="2">VERYTRUST · ${c.label}</text>
  <text x="58" y="30" font-family="Sora, sans-serif" font-size="7" fill="${c.text}">${c.sublabel} — ${c.desc}</text>
  <text x="58" y="42" font-family="Sora, sans-serif" font-size="7" fill="#4a7070">${entityName} · ${documentType}</text>
  <text x="58" y="54" font-family="Sora, sans-serif" font-size="7" fill="#4a7070">Certifié par ${issuerName} · ${date}</text>
  <text x="58" y="66" font-family="monospace" font-size="7" fill="${c.text}" letter-spacing="1">${certId}</text>
  <text x="58" y="76" font-family="Sora, sans-serif" font-size="6" fill="${c.text}" opacity="0.5">verytrust.africa/verify/${certId}</text>
  <!-- Border -->
  <rect x="1" y="1" width="478" height="78" rx="6" fill="none" stroke="${c.accent}" stroke-width="1" opacity="0.4"/>
</svg>`
}
