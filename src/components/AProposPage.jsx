import { useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'
import { useIsMobile } from '../hooks/useIsMobile'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg:      'var(--c-bg)',
  silver:  'var(--c-silver)',
  silver2: 'var(--c-silver2)',
  silver3: 'var(--c-silver3)',
  pearl:   'var(--c-silver)',
  white:   'var(--c-text)',
}

const GUTTER = 'clamp(40px,7vw,120px)'

// Shared snap section style
const SNAP = {
  height: '100dvh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  overflow: 'hidden',
}

// Top padding clears the fixed navbar; bottom gives breathing room
const SEC_PAD = `clamp(72px,10vh,96px) ${GUTTER} clamp(32px,5vh,48px)`


export default function AProposPage() {
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const ta   = T[lang].apropos
  const isAR = lang === 'AR'

  useEffect(() => {
    document.title = 'À propos de PRYM — Né au Maroc, Pour le Monde'
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'PRYM Executive Transport est né de l\'hospitalité marocaine. Découvrez notre histoire, nos valeurs et notre positionnement unique entre le premium accessible et l\'ultra-luxe.')
  }, [])

  const gridInner = {
    display: isMobile ? 'flex' : 'grid',
    flexDirection: 'column',
    gridTemplateColumns: 'repeat(12,1fr)',
    gap: isMobile ? '32px 0' : `0 clamp(24px,3vw,56px)`,
    maxWidth: 1400, margin: '0 auto', width: '100%',
    alignItems: 'start',
  }

  return (
    <div style={{
      background: 'var(--c-bg)', color: 'var(--c-text)',
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── 1 · Hero ─────────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: `0 ${GUTTER} clamp(48px,8vh,80px)`,
        background: 'var(--c-hero-bg)',
        borderBottom: '1px solid var(--c-border)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--c-grid-line)' }} />

        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 28, position: 'relative', zIndex: 1 }}>
          {ta.hero.eyebrow}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(36px,6.5vw,80px)', letterSpacing: isAR ? '0.02em' : '0.06em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.05, marginBottom: 40, maxWidth: 860, position: 'relative', zIndex: 1 }}>
          {ta.hero.h1a}<br />
          <span style={{ color: C.silver }}>{ta.hero.h1b}</span>
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 80, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver), transparent)' : 'linear-gradient(90deg, var(--c-silver), transparent)', marginBottom: 36, position: 'relative', zIndex: 1, transformOrigin: isAR ? 'right' : 'left' }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px,1.6vw,18px)', color: C.pearl, lineHeight: 1.85, maxWidth: 580, position: 'relative', zIndex: 1 }}>
          {ta.hero.body}
        </motion.p>
      </section>

      {/* ── 2 · L'origine ────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', alignItems: 'center',
        padding: SEC_PAD,
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={gridInner}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ gridColumn: isMobile ? undefined : '1 / span 4' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 24 }}>
              {ta.origin.eyebrow}
            </p>
            <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px,3vw,36px)', letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 28, lineHeight: 1.2 }}>
              {ta.origin.title.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </h2>
            <div style={{ width: 40, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver3), transparent)' : 'linear-gradient(90deg, var(--c-silver3), transparent)' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '6 / span 7', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {ta.origin.body.map((text, i) => (
              <p key={i} style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.4vw,16px)', color: C.pearl, lineHeight: 1.9 }}>
                {text}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3 · Stats ────────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: SEC_PAD,
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 48 }}>
            {ta.stats.eyebrow}
          </motion.p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
            gap: isMobile ? '32px 24px' : 'clamp(24px,4vw,56px)',
          }}>
            {ta.stats.items.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}>
                <p style={{ fontFamily: FONT_EU, fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, letterSpacing: '0.06em', color: C.white, marginBottom: 8 }}>
                  {item.value}
                </p>
                <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silver3, marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: FONT_SE, fontStyle: 'italic', fontSize: 12, color: C.silver2 }}>
                  {item.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Notre Philosophie ────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', alignItems: 'center',
        padding: SEC_PAD,
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={gridInner}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ gridColumn: isMobile ? undefined : '1 / span 4' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 24 }}>
              {ta.philosophy.eyebrow}
            </p>
            <div style={{ width: 40, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver3), transparent)' : 'linear-gradient(90deg, var(--c-silver3), transparent)' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '6 / span 7' }}>
            <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px,1.5vw,18px)', color: C.pearl, lineHeight: 1.9 }}>
              {ta.philosophy.body}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 5 · Piliers ──────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: SEC_PAD,
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 48 }}>
            {ta.pillars.eyebrow}
          </motion.p>

          <div style={{
            display: isMobile ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: isMobile ? undefined : 'repeat(3,1fr)',
            gap: isMobile ? 40 : 'clamp(28px,4vw,56px)',
          }}>
            {ta.pillars.items.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                style={{ textAlign: isAR ? 'right' : 'left' }}>
                <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.35em', color: C.silver3, marginBottom: 12 }}>
                  {item.n}
                </p>
                <p style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(18px,2vw,24px)', letterSpacing: '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 16 }}>
                  {item.title}
                </p>
                <div style={{ width: 32, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver3), transparent)' : 'linear-gradient(90deg, var(--c-silver3), transparent)', marginBottom: 20, marginLeft: isAR ? 'auto' : 0 }} />
                <p style={{ fontFamily: FONT_SE, fontStyle: 'italic', fontSize: 13, color: C.silver2, lineHeight: 1.85 }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 · Positionnement ───────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', alignItems: 'center',
        padding: SEC_PAD,
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={gridInner}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ gridColumn: isMobile ? undefined : '1 / span 5', textAlign: isAR ? 'right' : 'left' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 28 }}>
              {ta.positioning.eyebrow}
            </p>
            <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px,3.5vw,44px)', letterSpacing: isAR ? '0.02em' : '0.08em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.15 }}>
              {ta.positioning.h2a}<br />
              <span style={{ color: C.silver }}>{ta.positioning.h2b}</span>
            </h2>
            <div style={{ width: 48, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver3), transparent)' : 'linear-gradient(90deg, var(--c-silver3), transparent)', marginTop: 36 }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '7 / span 6', display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 4, textAlign: isAR ? 'right' : 'left' }}>
            {ta.positioning.body.map((text, i) => (
              <p key={i} style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.4vw,16px)', color: C.pearl, lineHeight: 1.85 }}>
                {text}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 7 · Closing + footer ─────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: SEC_PAD,
        background: 'var(--c-closing-bg)',
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 1 }}
          style={{
            maxWidth: 1400, margin: '0 auto', width: '100%',
            display: isMobile ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: 'repeat(12,1fr)',
            gap: isMobile ? 0 : `0 clamp(24px,3vw,56px)`,
            alignItems: 'center',
          }}>

          <div style={{ gridColumn: isMobile ? undefined : '2 / span 8', textAlign: isAR ? 'right' : 'left' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 40 }}>
              {ta.closing.eyebrow}
            </p>

            <blockquote style={{
              fontFamily: FONT_SE, fontSize: 'clamp(20px,3vw,32px)',
              color: C.silver, lineHeight: 1.65,
              borderLeft:  isAR ? 'none' : '1px solid var(--c-silver3)',
              borderRight: isAR ? '1px solid var(--c-silver3)' : 'none',
              paddingLeft:  isAR ? 0 : 'clamp(24px,3vw,48px)',
              paddingRight: isAR ? 'clamp(24px,3vw,48px)' : 0,
              marginBottom: 48,
            }}>
              {ta.closing.quote.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </blockquote>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: isAR ? 'flex-end' : 'flex-start', marginBottom: 48 }}>
              <a href="/experience" style={{ display: 'inline-block', fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-bg)', background: 'var(--c-silver)', padding: '16px 40px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-silver)' }}>
                {ta.closing.ctaExp}
              </a>
              <a href="/reserver" style={{ display: 'inline-block', fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver)', border: '1px solid var(--c-silver3)', padding: '16px 40px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-silver)'; e.currentTarget.style.color = 'var(--c-text)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-silver3)'; e.currentTarget.style.color = 'var(--c-silver)' }}>
                {ta.closing.ctaBook}
              </a>
            </div>

            {/* Footer note inline — avoids a separate snap point */}
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
              {ta.footer}
            </p>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
