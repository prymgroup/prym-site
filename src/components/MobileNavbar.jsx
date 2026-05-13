import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'
import ThemeToggle from './ThemeToggle'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

const C = {
  bg:      'var(--c-bg)',
  text:    'var(--c-text)',
  silver:  'var(--c-silver)',
  silver2: 'var(--c-silver2)',
  silver3: 'var(--c-silver3)',
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
              fontFamily: FONT_EU, fontSize: 10,
              color: 'var(--c-border-faint)',
              padding: '0 8px', userSelect: 'none', lineHeight: 1,
            }}>
              |
            </span>
          )}
          <button
            onClick={() => setLang(l)}
            style={{
              background: 'none', border: 'none',
              fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.2em',
              color: lang === l ? C.text : 'var(--c-lang-muted)',
              fontWeight: lang === l ? 400 : 300,
              padding: '4px 0', transition: 'color 0.2s ease', lineHeight: 1,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  )
}

export default function MobileNavbar({ ctaLabel, ctaHref = '/reserver' }) {
  const [open, setOpen] = useState(false)
  const { lang } = useLanguage()
  const t = T[lang]
  const label = ctaLabel ?? t.nav.reserver

  return (
    <>
      {/* ── Bar ───────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--c-nav-bar-bg)',
        backdropFilter: 'blur(16px)',
        willChange: 'transform',
        borderBottom: '1px solid var(--c-border)',
      }}>
        {/* Hamburger — dark strokes on light bar */}
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu"
          style={{ background: 'none', border: 'none', padding: '8px 4px', color: C.silver, WebkitTapHighlightColor: 'transparent', lineHeight: 0 }}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <line x1="0" y1="1"  x2="22" y2="1"  stroke="currentColor" strokeWidth="0.8"/>
            <line x1="0" y1="7"  x2="22" y2="7"  stroke="currentColor" strokeWidth="0.8"/>
            <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="0.8"/>
          </svg>
        </button>

        {/* Logo — centred */}
        <a href="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none', lineHeight: 0 }}>
          <img src="/logos/silver-logo-full.svg" alt="PRYM" style={{ height: 32 }}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
          <span style={{ display: 'none', fontFamily: FONT_EU, fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.text, fontWeight: 300 }}>PRYM</span>
        </a>

        <a href={ctaHref}
          style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.silver, textDecoration: 'none', padding: '7px 0' }}>
          {label}
        </a>
      </nav>

      {/* ── Overlay drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'var(--c-nav-overlay)',
              backdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              padding: '80px 32px 48px',
            }}
          >
            {/* Close button */}
            <button onClick={() => setOpen(false)} aria-label="Fermer le menu"
              style={{ position: 'absolute', top: 14, right: 20, background: 'none', border: 'none', color: C.silver3, padding: 8, fontFamily: FONT_EU, fontSize: 16, WebkitTapHighlightColor: 'transparent', lineHeight: 1 }}>
              ✕
            </button>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {ROUTE_LINKS.map(fn => {
                const [lbl, href] = fn(t)
                return (
                  <a key={href} href={href}
                    style={{ fontFamily: FONT_EU, fontSize: 24, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.text, textDecoration: 'none', fontWeight: 300 }}>
                    {lbl}
                  </a>
                )
              })}
            </div>

            {/* Language + theme */}
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--c-border-faint)' }}>
              <p style={{
                fontFamily: FONT_EU, fontSize: 6, letterSpacing: '0.3em',
                color: 'var(--c-lang-muted)', textTransform: 'uppercase',
                margin: '0 0 14px',
              }}>
                {t.nav.lang}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <LangSwitcher />
                <span style={{ width: 1, height: 12, background: 'var(--c-pill-border)', flexShrink: 0 }} />
                <ThemeToggle />
              </div>
            </div>

            {/* CTA — dark fill button on light drawer */}
            <a href={ctaHref}
              style={{ marginTop: 'auto', display: 'block', textAlign: 'center', fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.bg, background: C.text, padding: '18px 40px', textDecoration: 'none' }}>
              {label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
