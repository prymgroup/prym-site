import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'
import RevealOnScroll from './RevealOnScroll'

const FONT_EU = '"Eurostile", "Russo One", "Helvetica Neue", Arial, sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'

const C = {
  bg:      '#FDFBF7',
  silver:  '#6B6867',
  silver2: '#9E9890',
  silver3: '#B0AA9F',
  white:   '#1A1A1A',
  body:    '#6B6867',
}

const GUTTER = 'clamp(40px, 6vw, 120px)'
const SEC_V  = 'clamp(120px, 14vw, 200px)'
const COL_GAP = 'clamp(24px, 3vw, 52px)'

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 900)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 900)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

function OlfactifVisual({ notes, credit, isAR }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {notes.map((note, i) => (
        <motion.div key={note}
          initial={{ opacity: 0, x: isAR ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 20, flexDirection: isAR ? 'row-reverse' : 'row' }}
        >
          <div style={{
            height: 1, flexShrink: 0,
            width: `${72 - i * 12}px`,
            background: isAR
              ? `linear-gradient(270deg, ${C.silver}, transparent)`
              : `linear-gradient(90deg, ${C.silver}, transparent)`,
          }} />
          <span style={{ fontFamily: FONT_SE, fontSize: 14, color: C.body, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {note}
          </span>
        </motion.div>
      ))}
      <p style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginTop: 12, textAlign: isAR ? 'right' : 'left' }}>
        {credit}
      </p>
    </div>
  )
}

function TempDisplay({ label, sub, isAR }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, direction: isAR ? 'rtl' : 'ltr' }}
    >
      <p style={{
        fontFamily: FONT_EU, fontWeight: 300,
        fontSize: 'clamp(80px, 18vw, 120px)',
        letterSpacing: '-0.02em', color: C.white, lineHeight: 1,
      }}>
        21°
      </p>
      <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
        {label}
      </p>
      <div style={{ width: 48, height: 1, background: C.silver3 }} />
      <p style={{ fontFamily: FONT_SE, fontSize: 12, color: C.silver3 }}>
        {sub}
      </p>
    </motion.div>
  )
}

function NDAList({ title, items, protect, isAR }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1 }}
      style={{ width: '100%', direction: isAR ? 'rtl' : 'ltr' }}
    >
      <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 28 }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {items.map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexDirection: isAR ? 'row-reverse' : 'row' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: `1px solid ${C.silver3}`, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_SE, fontSize: 14, color: C.body }}>
                {item}
              </span>
            </div>
            <span style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: isAR ? '0.02em' : '0.22em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
              {protect}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function Timeline({ steps, isAR }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, direction: isAR ? 'rtl' : 'ltr' }}>
      {steps.map((step, i) => (
        <motion.div key={step.label}
          initial={{ opacity: 0, x: isAR ? 16 : -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 18 }}
        >
          <div style={{
            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: step.active ? C.silver : 'transparent',
            border: `1px solid ${step.active ? C.silver : C.silver3}`,
          }} />
          <div style={{ flex: 1, height: 1, background: step.active ? `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver},transparent)` : '#E0DDD8' }} />
          <span style={{ fontFamily: FONT_SE, fontSize: 13, color: step.active ? C.silver : C.body, whiteSpace: 'nowrap' }}>
            {step.label}
          </span>
          <span style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.15em', color: step.active ? C.white : C.silver3, minWidth: 52, textAlign: isAR ? 'left' : 'right' }}>
            {step.time}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function Hero({ t, isAR }) {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: isAR ? 'flex-end' : 'flex-start', justifyContent: 'center',
      padding: `clamp(80px, 12vw, 140px) ${GUTTER}`,
      position: 'relative',
      background: `radial-gradient(ellipse at 30% 60%, #EDE9E3 0%, ${C.bg} 70%)`,
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(176,170,159,0.12) 80px)',
      }} />

      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
        style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.45em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 32 }}>
        {t.eyebrow}
      </motion.p>

      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(32px, 6vw, 72px)', letterSpacing: isAR ? '0.02em' : '0.12em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.05, marginBottom: 32, maxWidth: 900 }}>
        {t.h1a}<br />
        <span style={{ color: C.silver }}>{t.h1b}</span>
      </motion.h1>

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: 80, height: 1, background: `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver},transparent)`, marginBottom: 36, transformOrigin: isAR ? 'right' : 'left' }} />

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
        style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px, 1.8vw, 18px)', color: C.body, lineHeight: 1.8, maxWidth: 560, whiteSpace: 'pre-line' }}>
        {t.body}
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        style={{ position: 'absolute', bottom: 48, [isAR ? 'right' : 'left']: GUTTER, display: 'flex', flexDirection: 'column', alignItems: isAR ? 'flex-end' : 'flex-start', gap: 8 }}>
        <span style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>{t.discover}</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ width: 1, height: 32, background: `linear-gradient(180deg,${C.silver3},transparent)` }} />
      </motion.div>
    </section>
  )
}

function Sec({ children, isMobile }) {
  return (
    <section style={{ padding: `${SEC_V} ${GUTTER}`, borderTop: '1px solid #E0DDD8', background: C.bg }}>
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: 'column',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: isMobile ? 'clamp(40px, 10vw, 64px)' : `0 ${COL_GAP}`,
        maxWidth: 1400, margin: '0 auto',
        alignItems: 'start',
      }}>
        {children}
      </div>
    </section>
  )
}

function Narrative({ n, label, title, body, isAR }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', direction: isAR ? 'rtl' : 'ltr', textAlign: isAR ? 'right' : 'left' }}>

      {/* number + optional label */}
      <RevealOnScroll delay={0} y={16} style={{ marginBottom: 28 }}>
        <span style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.3em', color: C.silver3, display: 'block', marginBottom: label ? 16 : 0 }}>
          {String(n).padStart(2, '0')} —
        </span>
        {label && (
          <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver2 }}>
            {label}
          </p>
        )}
      </RevealOnScroll>

      {/* heading + rule */}
      <RevealOnScroll delay={0.1} y={20} style={{ marginBottom: 'clamp(28px, 4vw, 36px)' }}>
        <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px, 2.6vw, 32px)', letterSpacing: isAR ? '0.02em' : '0.08em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 'clamp(28px, 4vw, 36px)', lineHeight: 1.18 }}>
          {title.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
        </h2>
        <div style={{ width: 48, height: 1, background: C.silver3 }} />
      </RevealOnScroll>

      {/* body text */}
      <RevealOnScroll delay={0.22} y={16}>
        <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px, 1.35vw, 15px)', color: C.body, lineHeight: 1.9 }}>
          {body}
        </p>
      </RevealOnScroll>

    </div>
  )
}

/* ── 50/50 Split — Image placeholder ↔ 21° + NDA ─────────────────────────── */
function SplitSection({ s, isAR, isMobile }) {
  return (
    <motion.section
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1 }}
      style={{ borderTop: '1px solid #E0DDD8', background: C.bg }}
    >
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: isMobile ? 'auto' : 640,
      }}>

        {/* Left — image placeholder */}
        <div style={{
          background: '#EAE6DE',
          height: isMobile ? '72vw' : 'auto',
          minHeight: isMobile ? 280 : 640,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 'clamp(20px,3vw,40px)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 35% 55%, #DDD9D2 0%, #E8E4DC 70%)',
          }} />
          {/* Subtle vertical line texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(90deg, transparent, transparent 119px, rgba(176,170,159,0.12) 120px)',
          }} />
          <span style={{
            position: 'relative', zIndex: 1,
            fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.38em',
            textTransform: 'uppercase', color: C.silver3, opacity: 0.45,
          }}>
            Intérieur PRYM Signature — Cuir nappa
          </span>
        </div>

        {/* Right — 21° + NDA, vertically centered with breathing room */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 'clamp(52px, 9vw, 88px)',
          padding: isMobile
            ? `clamp(64px,14vw,80px) ${GUTTER}`
            : `clamp(80px,10vw,120px) clamp(56px,7vw,96px)`,
        }}>
          <TempDisplay label={s[3].tempLabel} sub={s[3].tempSub} isAR={isAR} />
          <NDAList title={s[4].ndaTitle} items={s[4].ndaItems} protect={s[4].ndaProtect} isAR={isAR} />
        </div>

      </div>
    </motion.section>
  )
}

/* ── Full Screen Quote ─────────────────────────────────────────────────────── */
function FullScreenQuote() {
  return (
    <motion.section
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.4 }}
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `clamp(80px, 12vw, 140px) ${GUTTER}`,
        background: `radial-gradient(ellipse at 50% 50%, #EDE9E3 0%, ${C.bg} 70%)`,
        borderTop: '1px solid #E0DDD8',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background numeral — purely decorative */}
      <span aria-hidden style={{
        position: 'absolute',
        fontFamily: FONT_EU, fontWeight: 300,
        fontSize: 'clamp(160px, 35vw, 420px)',
        letterSpacing: '-0.04em',
        color: 'rgba(176,170,159,0.18)',
        lineHeight: 1,
        userSelect: 'none',
        pointerEvents: 'none',
        bottom: '-0.15em',
        right: GUTTER,
      }}>
        PRYM
      </span>

      <p style={{
        position: 'relative', zIndex: 1,
        fontFamily: FONT_EU, fontWeight: 300,
        fontSize: 'clamp(28px, 5.5vw, 72px)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: C.white,
        lineHeight: 1.2,
        textAlign: 'center',
        maxWidth: 1100,
      }}>
        Le silence est notre<br />
        <span style={{ color: C.silver }}>plus grand luxe.</span>
      </p>
    </motion.section>
  )
}

function Closing({ t, isAR }) {
  return (
    <motion.section
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1 }}
      style={{ padding: `clamp(80px, 12vw, 140px) ${GUTTER}`, textAlign: 'center', background: `radial-gradient(ellipse at 50% 0%, #EDE9E3 0%, ${C.bg} 60%)`, borderTop: '1px solid #E0DDD8', direction: isAR ? 'rtl' : 'ltr' }}
    >
      <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.45em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 24 }}>
        {t.eyebrow}
      </p>
      <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(24px, 4vw, 48px)', letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 20, lineHeight: 1.1 }}>
        {t.h2a}<br />
        <span style={{ color: C.silver }}>{t.h2b}</span>
      </h2>
      <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px, 1.5vw, 16px)', color: C.body, lineHeight: 1.8, maxWidth: 480, margin: '0 auto 48px', whiteSpace: 'pre-line' }}>
        {t.body}
      </p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/reserver" style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.bg, background: C.silver, padding: '16px 40px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
          onMouseEnter={e => e.target.style.background = C.white}
          onMouseLeave={e => e.target.style.background = C.silver}>
          {t.ctaBook}
        </a>
        <a href="/flotte" style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver, background: 'transparent', border: `1px solid ${C.silver3}`, padding: '16px 40px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
          onMouseEnter={e => e.target.style.borderColor = C.silver}
          onMouseLeave={e => e.target.style.borderColor = C.silver3}>
          {t.ctaFlotte}
        </a>
      </div>
    </motion.section>
  )
}

export default function ExperiencePage() {
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const te = T[lang].experience
  const isAR = lang === 'AR'
  const s = te.sections

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'L\'Expérience — PRYM Executive Transport'
  }, [])

  const tc = (col) => ({ gridColumn: isMobile ? undefined : col })

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      <Hero t={te.hero} isAR={isAR} />

      {/* 01 — CHAUFFEUR */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5') }}>
          <Narrative n={s[0].n} label={s[0].label} title={s[0].title} body={s[0].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(15px,1.5vw,17px)', color: C.silver2, lineHeight: 2, borderLeft: `1px solid ${C.silver3}`, paddingLeft: 'clamp(24px,3vw,40px)' }}>
            {s[0].details?.[0]?.value ?? s[0].body}
          </p>
        </div>
      </Sec>

      {/* 02 — SIGNATURE OLFACTIVE */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1 }}>
          <OlfactifVisual notes={s[1].fragranceNotes} credit={s[1].fragranceCredit} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[1].n} label={s[1].label} title={s[1].title} body={s[1].body} isAR={isAR} />
        </div>
      </Sec>

      {/* 50/50 — Image placeholder + 21° & NDA */}
      <SplitSection s={s} isAR={isAR} isMobile={isMobile} />

      {/* Full Screen Quote */}
      <FullScreenQuote />

      {/* 06 — PONCTUALITÉ */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1 }}>
          <Timeline steps={s[5].timeline} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[5].n} label={s[5].label} title={s[5].title} body={s[5].body} isAR={isAR} />
        </div>
      </Sec>

      <Closing t={te.closing} isAR={isAR} />
    </div>
  )
}
