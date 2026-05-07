import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg: '#0a0a0a',
  silver: '#c6c6c6',
  silver2: '#706f6f',
  silver3: '#3c3c3b',
  pearl: '#B0B0B0',
  white: '#f6f6f6',
}

const GUTTER = 'clamp(40px,7vw,120px)'
const SEC_V = 'clamp(100px,12vw,180px)'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

export default function AProposPage() {
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const ta = T[lang].apropos
  const isAR = lang === 'AR'

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'À propos de PRYM — Né au Maroc, Pour le Monde'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'PRYM Executive Transport est né de l\'hospitalité marocaine. Découvrez notre histoire, nos valeurs et notre positionnement unique entre le premium accessible et l\'ultra-luxe.')
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white, direction: isAR ? 'rtl' : 'ltr' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: `clamp(120px,16vw,200px) ${GUTTER} clamp(80px,10vw,140px)`,
        background: `radial-gradient(ellipse at 30% 60%, #141416 0%, ${C.bg} 65%)`,
        borderBottom: `1px solid ${C.silver3}18`,
        position: 'relative',
      }}>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 28, position: 'relative', zIndex: 1 }}>
          {ta.hero.eyebrow}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(36px,6.5vw,80px)', letterSpacing: isAR ? '0.02em' : '0.06em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.05, marginBottom: 40, maxWidth: 860, position: 'relative', zIndex: 1 }}>
          {ta.hero.h1a}<br />
          <span style={{ color: C.silver }}>{ta.hero.h1b}</span>
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 80, height: 1, background: `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver},transparent)`, marginBottom: 36, position: 'relative', zIndex: 1, transformOrigin: isAR ? 'right' : 'left' }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px,1.6vw,18px)', color: C.pearl, lineHeight: 1.85, maxWidth: 580, position: 'relative', zIndex: 1 }}>
          {ta.hero.body}
        </motion.p>
      </section>

      {/* ── L'origine ────────────────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}18` }}>
        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(12,1fr)',
          gap: isMobile ? '40px 0' : '0 clamp(24px,3vw,56px)',
          maxWidth: 1400, margin: '0 auto',
        }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ gridColumn: isMobile ? undefined : '1 / span 4' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 24 }}>
              {ta.origin.eyebrow}
            </p>
            <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px,3vw,36px)', letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 28, lineHeight: 1.2 }}>
              {ta.origin.title.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </h2>
            <div style={{ width: 40, height: 1, background: `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver3},transparent)` }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '6 / span 7', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {ta.origin.body.map((text, i) => (
              <p key={i} style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.4vw,16px)', color: C.pearl, lineHeight: 1.9 }}>
                {text}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Chiffres clés ────────────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}18` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 'clamp(56px,8vw,100px)' }}>
            {ta.stats.eyebrow}
          </motion.p>

          <div style={{ width: '100%', height: 1, background: `${C.silver3}30`, marginBottom: 'clamp(40px,5vw,72px)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: isMobile ? 'clamp(32px,5vw,56px) clamp(24px,4vw,40px)' : '0 clamp(24px,4vw,64px)' }}>
            {ta.stats.items.map((c, i) => (
              <motion.div key={c.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}>
                <p style={{ fontFamily: FONT_EU, fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '0.02em', color: C.white, marginBottom: 16, lineHeight: 1, fontWeight: 300 }}>
                  {c.value}
                </p>
                <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver, marginBottom: 8 }}>
                  {c.label}
                </p>
                <p style={{ fontFamily: FONT_SE, fontSize: 12, color: C.silver3 }}>
                  {c.sub}
                </p>
              </motion.div>
            ))}
          </div>

          <div style={{ width: '100%', height: 1, background: `${C.silver3}30`, marginTop: 'clamp(40px,5vw,72px)' }} />
        </div>
      </section>

      {/* ── Trois piliers ─────────────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}18` }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 'clamp(56px,8vw,100px)' }}>
            {ta.pillars.eyebrow}
          </motion.p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? '40px 0' : '0 clamp(32px,5vw,80px)' }}>
            {ta.pillars.items.map((v, i) => (
              <motion.div key={v.n}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.12, duration: 0.8 }}>
                <div style={{ width: '100%', height: 1, background: `${C.silver3}40`, marginBottom: 32 }} />
                <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase', color: C.silver3, marginBottom: 20 }}>
                  {v.n}
                </p>
                <h3 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(16px,1.8vw,20px)', letterSpacing: isAR ? '0.02em' : '0.14em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 28, lineHeight: 1.25 }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,15px)', color: C.pearl, lineHeight: 1.9 }}>
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Positionnement ──────────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}18` }}>
        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: 'repeat(12,1fr)',
          gap: isMobile ? '40px 0' : '0 clamp(24px,3vw,56px)',
          maxWidth: 1400, margin: '0 auto',
        }}>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            style={{ gridColumn: isMobile ? undefined : '1 / span 5', textAlign: isAR ? 'right' : 'left' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 28 }}>
              {ta.positioning.eyebrow}
            </p>
            <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px,3.5vw,44px)', letterSpacing: isAR ? '0.02em' : '0.08em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.15 }}>
              {ta.positioning.h2a}
              <br />
              <span style={{ color: C.silver }}>{ta.positioning.h2b}</span>
            </h2>
            <div style={{ width: 48, height: 1, background: `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver3},transparent)`, marginTop: 36 }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '7 / span 6', display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 4, textAlign: isAR ? 'right' : 'left' }}>
            {ta.positioning.body.map((text, i) => (
              <p key={i} style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.4vw,16px)', color: C.pearl, lineHeight: 1.85 }}>
                {text}
              </p>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── Closing manifeste ────────────────────────────────────────────── */}
      <section style={{
        padding: `clamp(120px,14vw,200px) ${GUTTER}`,
        background: `radial-gradient(ellipse at 50% 0%, #141416 0%, ${C.bg} 60%)`,
      }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}
          style={{
            maxWidth: 1400, margin: '0 auto',
            display: isMobile ? 'flex' : 'grid',
            flexDirection: 'column',
            gridTemplateColumns: 'repeat(12,1fr)',
            gap: isMobile ? '0' : '0 clamp(24px,3vw,56px)',
            alignItems: 'center',
          }}>

          <div style={{ gridColumn: isMobile ? undefined : '2 / span 8', textAlign: isAR ? 'right' : 'left' }}>
            <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.5em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 40 }}>
              {ta.closing.eyebrow}
            </p>
            <blockquote style={{
              fontFamily: FONT_SE,
              fontSize: 'clamp(20px,3vw,32px)',
              color: C.silver, lineHeight: 1.65,
              borderLeft: isAR ? 'none' : `1px solid ${C.silver3}`,
              borderRight: isAR ? `1px solid ${C.silver3}` : 'none',
              paddingLeft: isAR ? 0 : 'clamp(24px,3vw,48px)',
              paddingRight: isAR ? 'clamp(24px,3vw,48px)' : 0,
              marginBottom: 56,
            }}>
              {ta.closing.quote.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </blockquote>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: isAR ? 'flex-end' : 'flex-start' }}>
              <a href="/experience" style={{ display: 'inline-block', fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.bg, background: C.silver, padding: '16px 40px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.white}
                onMouseLeave={e => e.currentTarget.style.background = C.silver}>
                {ta.closing.ctaExp}
              </a>
              <a href="/reserver" style={{ display: 'inline-block', fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver, border: `1px solid ${C.silver3}`, padding: '16px 40px', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.silver; e.currentTarget.style.color = C.white }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.silver3; e.currentTarget.style.color = C.silver }}>
                {ta.closing.ctaBook}
              </a>
            </div>
          </div>

        </motion.div>
      </section>

      <div style={{ borderTop: `1px solid ${C.silver3}18`, padding: `28px ${GUTTER}`, background: C.bg }}>
        <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
          {ta.footer}
        </p>
      </div>
    </div>
  )
}
