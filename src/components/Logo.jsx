export function LogoGold({ size = 36, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32,4 A28,28 0 0,1 56.2,18 L50,21.5 A21,21 0 0,0 32,11 Z" fill="#1a2535"/>
        <path d="M56.2,18 A28,28 0 0,1 60,32 L53,32 A21,21 0 0,0 50,21.5 Z" fill="#1a2535"/>
        <path d="M60,32 A28,28 0 0,1 56.2,46 L50,42.5 A21,21 0 0,0 53,32 Z" fill="#1a2535"/>
        <path d="M56.2,46 A28,28 0 0,1 32,60 L32,53 A21,21 0 0,0 50,42.5 Z" fill="#1a2535"/>
        <path d="M32,60 A28,28 0 0,1 7.8,46 L14,42.5 A21,21 0 0,0 32,53 Z" fill="#1a2535"/>
        <path d="M7.8,46 A28,28 0 0,1 4,32 L11,32 A21,21 0 0,0 14,42.5 Z" fill="#1a2535"/>
        <path d="M4,32 A28,28 0 0,1 7.8,18 L14,21.5 A21,21 0 0,0 11,32 Z" fill="#c9a84c"/>
        <path d="M7.8,18 A28,28 0 0,1 32,4 L32,11 A21,21 0 0,0 14,21.5 Z" fill="#c9a84c"/>
        <circle cx="32" cy="32" r="19" fill="white"/>
        <path d="M29,17 C27,17 25.5,18 25,20 C24.5,21.5 24,22.5 23.5,24 C23,25.5 23,27 23.5,28.5 C24,30 24,31.5 23.5,33 C23,34.5 23.5,36 24.5,37.5 C25.5,39 26,40.5 27,42 C28,43.5 29,44.5 30,45.5 C31,46.5 32,47 33,46 C34,45 34,43.5 35,42.5 C36,41.5 37.5,41 38,39.5 C38.5,38 38,36.5 38.5,35 C39,33.5 40,32.5 39.5,31 C39,29.5 38.5,28.5 39,27 C39.5,25.5 40,24.5 39,23 C38,21.5 37,21 36,19.5 C35,18 33.5,17 32,17 C31,17 30,17 29,17Z" fill="#c9a84c" opacity="0.25"/>
        <rect x="27" y="27" width="12" height="15" rx="1.5" fill="none" stroke="#1a2535" stroke-width="1.5"/>
        <line x1="29.5" y1="31" x2="36.5" y2="31" stroke="#1a2535" stroke-width="1"/>
        <line x1="29.5" y1="34" x2="36.5" y2="34" stroke="#1a2535" stroke-width="1"/>
        <line x1="29.5" y1="37" x2="33.5" y2="37" stroke="#1a2535" stroke-width="1"/>
        <circle cx="37" cy="39" r="5" fill="#c9a84c"/>
        <polyline points="34.5,39 36.5,41 39.5,36.5" fill="none" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1, color: '#1a2535' }}>
          VERY<span style={{ color: '#c9a84c' }}>TRUST</span>
        </span>
      )}
    </div>
  )
}

export function LogoTeal({ size = 36, showText = true, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M32,4 A28,28 0 0,1 56.2,18 L50,21.5 A21,21 0 0,0 32,11 Z" fill="#1a2535"/>
        <path d="M56.2,18 A28,28 0 0,1 60,32 L53,32 A21,21 0 0,0 50,21.5 Z" fill="#1a2535"/>
        <path d="M60,32 A28,28 0 0,1 56.2,46 L50,42.5 A21,21 0 0,0 53,32 Z" fill="#1a2535"/>
        <path d="M56.2,46 A28,28 0 0,1 32,60 L32,53 A21,21 0 0,0 50,42.5 Z" fill="#1a2535"/>
        <path d="M32,60 A28,28 0 0,1 7.8,46 L14,42.5 A21,21 0 0,0 32,53 Z" fill="#1a2535"/>
        <path d="M7.8,46 A28,28 0 0,1 4,32 L11,32 A21,21 0 0,0 14,42.5 Z" fill="#1a2535"/>
        <path d="M4,32 A28,28 0 0,1 7.8,18 L14,21.5 A21,21 0 0,0 11,32 Z" fill="#0d8f8f"/>
        <path d="M7.8,18 A28,28 0 0,1 32,4 L32,11 A21,21 0 0,0 14,21.5 Z" fill="#0d8f8f"/>
        <circle cx="32" cy="32" r="19" fill="white"/>
        <path d="M29,17 C27,17 25.5,18 25,20 C24.5,21.5 24,22.5 23.5,24 C23,25.5 23,27 23.5,28.5 C24,30 24,31.5 23.5,33 C23,34.5 23.5,36 24.5,37.5 C25.5,39 26,40.5 27,42 C28,43.5 29,44.5 30,45.5 C31,46.5 32,47 33,46 C34,45 34,43.5 35,42.5 C36,41.5 37.5,41 38,39.5 C38.5,38 38,36.5 38.5,35 C39,33.5 40,32.5 39.5,31 C39,29.5 38.5,28.5 39,27 C39.5,25.5 40,24.5 39,23 C38,21.5 37,21 36,19.5 C35,18 33.5,17 32,17 C31,17 30,17 29,17Z" fill="#0d8f8f" opacity="0.2"/>
        <rect x="27" y="27" width="12" height="15" rx="1.5" fill="none" stroke="#1a2535" stroke-width="1.5"/>
        <line x1="29.5" y1="31" x2="36.5" y2="31" stroke="#1a2535" stroke-width="1"/>
        <line x1="29.5" y1="34" x2="36.5" y2="34" stroke="#1a2535" stroke-width="1"/>
        <line x1="29.5" y1="37" x2="33.5" y2="37" stroke="#1a2535" stroke-width="1"/>
        <circle cx="37" cy="39" r="5" fill="#0d8f8f"/>
        <polyline points="34.5,39 36.5,41 39.5,36.5" fill="none" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {showText && (
        <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1, color: light ? 'white' : '#1a2535' }}>
          VERY<span style={{ color: '#0d8f8f' }}>TRUST</span>
        </span>
      )}
    </div>
  )
}
