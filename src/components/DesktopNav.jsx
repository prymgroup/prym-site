import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'
import ThemeToggle from './ThemeToggle'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

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
              color: 'var(--c-border-faint)',
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
              color: lang === l ? 'var(--c-text)' : 'var(--c-lang-muted)',
              fontWeight: lang === l ? 400 : 300,
              padding: '2px 0', transition: 'color 0.2s ease', lineHeight: 1,
            }}
            onMouseEnter={e => { if (lang !== l) e.currentTarget.style.color = 'var(--c-silver2)' }}
            onMouseLeave={e => { if (lang !== l) e.currentTarget.style.color = 'var(--c-lang-muted)' }}
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
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 clamp(24px,5vw,72px)', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'var(--c-nav-bg)',
      backdropFilter: 'blur(16px)',
      willChange: 'transform',
      borderBottom: '1px solid var(--c-border)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      {/* Logo — native silver chrome */}
      <a href="/" style={{ textDecoration: 'none' }}>
        <img
          src="/logos/silver-logo-full.svg"
          alt="PRYM"
          style={{ height: 40 }}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
        <span style={{ display: 'none', fontFamily: FONT_EU, fontSize: 13, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--c-text)', fontWeight: 300 }}>
          PRYM
        </span>
      </a>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 'clamp(20px,2.5vw,40px)', alignItems: 'center' }}>
        {ROUTE_LINKS.map(fn => {
          const [label, href] = fn(t)
          return (
            <a key={href} href={href}
              aria-current={currentPath === href || currentPath === href + '/' ? 'page' : undefined}
              style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-text)', textDecoration: 'none', transition: 'color 0.3s ease', opacity: currentPath === href || currentPath === href + '/' ? 1 : 0.7 }}
              onMouseEnter={e => { e.target.style.opacity = '1' }}
              onMouseLeave={e => { if (currentPath !== href && currentPath !== href + '/') e.target.style.opacity = '0.7' }}>
              {label}
            </a>
          )
        })}

        <span style={{ width: 1, height: 14, background: 'var(--c-border-faint)', flexShrink: 0 }} />

        <LangSwitcher />

        <span style={{ width: 1, height: 14, background: 'var(--c-border-faint)', flexShrink: 0 }} />

        <ThemeToggle />

        <span style={{ width: 1, height: 14, background: 'var(--c-border-faint)', flexShrink: 0 }} />

        {/* CTA */}
        <a href="/reserver"
          style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-text)', border: '1px solid var(--c-silver)', padding: '10px 24px', textDecoration: 'none', transition: 'all 0.4s ease' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-silver2)'; e.currentTarget.style.background = 'var(--c-pill-bg)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-silver)'; e.currentTarget.style.background = 'transparent' }}>
          {t.nav.reserver}
        </a>
      </div>
    </nav>
  )
}
