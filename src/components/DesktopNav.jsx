import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

// Warm luxury light-mode palette
const C = {
  bg:      '#FDFBF7',
  text:    '#1A1A1A',   // charcoal — primary
  silver:  '#6B6867',   // stone-600 — secondary
  silver2: '#9E9890',   // stone-400 — muted / nav links default
  silver3: '#B0AA9F',   // taupe — borders / dividers
}

const ROUTE_LINKS = [
  (t) => [t.nav.flotte,      '/flotte'],
  (t) => [t.nav.experience,  '/experience'],
  (t) => [t.nav.entreprises, '/entreprises'],
  (t) => [t.nav.apropos,     '/a-propos'],
]

const LANGS = ['FR', 'EN', 'AR']

function LangSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {LANGS.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <span style={{
              fontFamily: FONT_EU, fontSize: 8,
              color: 'rgba(176,170,159,0.5)',
              padding: '0 6px', userSelect: 'none', lineHeight: 1,
            }}>
              |
            </span>
          )}
          <button
            onClick={() => setLang(l)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.18em',
              color: lang === l ? C.text : 'rgba(26,26,26,0.38)',
              fontWeight: lang === l ? 500 : 300,
              padding: '2px 0', transition: 'color 0.2s ease', lineHeight: 1,
            }}
            onMouseEnter={e => { if (lang !== l) e.currentTarget.style.color = 'rgba(26,26,26,0.72)' }}
            onMouseLeave={e => { if (lang !== l) e.currentTarget.style.color = 'rgba(26,26,26,0.38)' }}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}

export default function DesktopNav() {
  const { lang } = useLanguage()
  const t = T[lang]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(24px,5vw,72px)', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(253,251,247,0.92)',
      backdropFilter: 'blur(16px)',
      willChange: 'transform',
      borderBottom: '1px solid #E0DDD8',
    }}>
      {/* Logo — inverted to charcoal on light background */}
      <a href="/" style={{ textDecoration: 'none' }}>
        <img
          src="/logos/logo-slogan-white.svg"
          alt="PRYM"
          style={{ height: 40, filter: 'brightness(0)', opacity: 0.88 }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
        <span style={{ display: 'none', fontFamily: FONT_EU, fontSize: 13, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.text, fontWeight: 300 }}>
          PRYM
        </span>
      </a>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 'clamp(20px,2.5vw,40px)', alignItems: 'center' }}>
        {ROUTE_LINKS.map(fn => {
          const [label, href] = fn(t)
          return (
            <a key={href} href={href}
              style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silver2, textDecoration: 'none', transition: 'color 0.3s ease' }}
              onMouseEnter={e => e.target.style.color = C.text}
              onMouseLeave={e => e.target.style.color = C.silver2}>
              {label}
            </a>
          )
        })}

        <span style={{ width: 1, height: 14, background: 'rgba(176,170,159,0.4)', flexShrink: 0 }} />

        <LangSwitcher />

        <span style={{ width: 1, height: 14, background: 'rgba(176,170,159,0.4)', flexShrink: 0 }} />

        {/* CTA */}
        <a href="/reserver"
          style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.text, border: `1px solid ${C.silver3}`, padding: '10px 24px', textDecoration: 'none', transition: 'all 0.4s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.silver; e.currentTarget.style.background = 'rgba(26,26,26,0.05)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.silver3; e.currentTarget.style.background = 'transparent' }}>
          {t.nav.reserver}
        </a>
      </div>
    </nav>
  )
}
