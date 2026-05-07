import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const C = { bg: '#0a0a0a', silver: '#c6c6c6', silver3: '#3c3c3b', white: '#f6f6f6' }

const ROUTE_LINKS = [
  (t) => [t.nav.flotte,      '/flotte'],
  (t) => [t.nav.experience,  '/experience'],
  (t) => [t.nav.entreprises, '/entreprises'],
  (t) => [t.nav.apropos,     '/a-propos'],
]

const LANGS = ['FR', 'EN', 'AR']

/* ── Language switcher — "FR | EN | AR" format ───────────────────── */
function LangSwitcher() {
  const { lang, setLang } = useLanguage()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {LANGS.map((l, i) => (
        <span key={l} style={{ display: 'flex', alignItems: 'center' }}>
          {i > 0 && (
            <span style={{
              fontFamily: FONT_EU, fontSize: 10,
              color: 'rgba(246,246,246,0.15)',
              padding: '0 8px', userSelect: 'none', lineHeight: 1,
            }}>
              |
            </span>
          )}
          <button
            onClick={() => setLang(l)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: FONT_EU, fontSize: 10,
              letterSpacing: '0.2em',
              color: lang === l ? C.white : 'rgba(246,246,246,0.4)',
              fontWeight: lang === l ? 500 : 300,
              padding: '4px 0',
              transition: 'color 0.2s ease',
              lineHeight: 1,
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

/**
 * Shared mobile hamburger navbar.
 * @param {string} ctaLabel – override right-side label  (default: from i18n)
 * @param {string} ctaHref  – override right-side href   (default: '/reserver')
 */
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
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.silver3}22`,
      }}>
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', color: C.silver, WebkitTapHighlightColor: 'transparent', lineHeight: 0 }}>
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <line x1="0" y1="1"  x2="22" y2="1"  stroke="currentColor" strokeWidth="0.8"/>
            <line x1="0" y1="7"  x2="22" y2="7"  stroke="currentColor" strokeWidth="0.8"/>
            <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="0.8"/>
          </svg>
        </button>

        <a href="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none' }}>
          <span style={{ fontFamily: FONT_EU, fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.white, fontWeight: 300 }}>
            PRYM
          </span>
        </a>

        <a href={ctaHref} style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.25em', textTransform: 'uppercase', color: C.silver, textDecoration: 'none', padding: '7px 0' }}>
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
            style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(10,10,10,0.97)', display: 'flex', flexDirection: 'column', padding: '80px 32px 48px' }}
          >
            <button onClick={() => setOpen(false)} aria-label="Fermer le menu"
              style={{ position: 'absolute', top: 14, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: C.silver3, padding: 8, fontFamily: FONT_EU, fontSize: 16, WebkitTapHighlightColor: 'transparent', lineHeight: 1 }}>
              ✕
            </button>

            {/* Nav links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              {ROUTE_LINKS.map(fn => {
                const [lbl, href] = fn(t)
                return (
                  <a key={href} href={href}
                    style={{ fontFamily: FONT_EU, fontSize: 24, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.white, textDecoration: 'none', fontWeight: 300 }}>
                    {lbl}
                  </a>
                )
              })}
            </div>

            {/* Language switcher — utility zone */}
            <div style={{
              marginTop: 48,
              paddingTop: 24,
              borderTop: `1px solid rgba(60,60,59,0.35)`,
            }}>
              <p style={{
                fontFamily: FONT_EU, fontSize: 6, letterSpacing: '0.3em',
                color: 'rgba(246,246,246,0.25)', textTransform: 'uppercase',
                margin: '0 0 14px',
              }}>
                {t.nav.lang}
              </p>
              <LangSwitcher />
            </div>

            {/* CTA */}
            <a href={ctaHref}
              style={{ marginTop: 'auto', display: 'block', textAlign: 'center', fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.bg, background: C.silver, padding: '18px 40px', textDecoration: 'none' }}>
              {label}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
