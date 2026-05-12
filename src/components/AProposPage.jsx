import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RevealOnScroll from './RevealOnScroll'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg:      '#FDFBF7',
  silver:  '#6B6867',
  silver2: '#9E9890',
  silver3: '#B0AA9F',
  pearl:   '#6B6867',
  white:   '#1A1A1A',
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
        background: `radial-gradient(ellipse at 30% 60%, #EDE9E3 0%, ${C.bg} 65%)`,
        borderBottom: `1px solid ${C.silver3}50`,
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
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}50` }}>
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

      {/* ── Notre Philosophie ───────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}50` }}>
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
              Notre Philosophie
            </p>
            <div style={{ width: 40, height: 1, background: `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver3},transparent)` }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
            style={{ gridColumn: isMobile ? undefined : '6 / span 7' }}>
            <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px,1.5vw,18px)', color: C.pearl, lineHeight: 1.9 }}>
              L'industrie du transport de direction s'était endormie sur ses acquis. PRYM est née d'une volonté radicale : redéfinir le standard. Moins de bruit, plus de justesse. Une approche architecturale du service où chaque détail a été pensé pour disparaître au profit de votre tranquillité.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Positionnement ──────────────────────────────────────────────── */}
      <section style={{ padding: `${SEC_V} ${GUTTER}`, borderBottom: `1px solid ${C.silver3}50` }}>
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
        background: `radial-gradient(ellipse at 50% 0%, #EDE9E3 0%, ${C.bg} 60%)`,
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

      <RevealOnScroll delay={0.1}>
        <div style={{ borderTop: `1px solid ${C.silver3}50`, padding: `28px ${GUTTER}`, background: C.bg }}>
          <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
            {ta.footer}
          </p>
        </div>
      </RevealOnScroll>
    </div>
  )
}
