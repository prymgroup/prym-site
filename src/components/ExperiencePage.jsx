import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile", "Russo One", "Helvetica Neue", Arial, sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'

const C = {
  bg:      '#0a0a0a',
  silver:  '#c6c6c6',
  silver2: '#706f6f',
  silver3: '#3c3c3b',
  white:   '#f6f6f6',
  body:    '#A0A0A0',
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

function DetailItem({ label, value, isAR }) {
  return (
    <div style={{ direction: isAR ? 'rtl' : 'ltr', textAlign: isAR ? 'right' : 'left' }}>
      <p style={{
        fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.28em',
        textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 10,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: FONT_SE, fontSize: 13, color: C.body,
        lineHeight: 1.8, whiteSpace: 'pre-line',
      }}>
        {value}
      </p>
    </div>
  )
}

function PhotoSlot({ caption }) {
  return (
    <div style={{
      width: '100%',
      height: 'max(40vh, 260px)',
      background: 'linear-gradient(180deg, #0d0d10 0%, #080808 100%)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: `0 ${GUTTER} clamp(24px, 4vw, 48px)`,
      marginTop: 'clamp(60px, 8vw, 100px)',
      marginBottom: 'clamp(60px, 8vw, 100px)',
    }}>
      <span style={{
        fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.4em',
        textTransform: 'uppercase', color: C.silver3, opacity: 0.45,
      }}>
        {caption}
      </span>
    </div>
  )
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
        fontSize: 'clamp(96px, 24vw, 130px)',
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
          <div key={item} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
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
          <div style={{ flex: 1, height: 1, background: step.active ? `linear-gradient(${isAR ? '270deg' : '90deg'},${C.silver},transparent)` : '#1c1c1c' }} />
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
      background: `radial-gradient(ellipse at 30% 60%, #141416 0%, ${C.bg} 70%)`,
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(60,60,59,0.07) 80px)',
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
    <motion.section
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ padding: `${SEC_V} ${GUTTER}`, borderTop: '1px solid #111', background: C.bg }}
    >
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
    </motion.section>
  )
}

function Narrative({ n, label, title, body, isAR }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', direction: isAR ? 'rtl' : 'ltr', textAlign: isAR ? 'right' : 'left' }}>
      <span style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.3em', color: C.silver3, display: 'block', marginBottom: 28 }}>
        {String(n).padStart(2, '0')} —
      </span>
      {label && (
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver2, marginBottom: 16 }}>
          {label}
        </p>
      )}
      <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px, 2.6vw, 32px)', letterSpacing: isAR ? '0.02em' : '0.08em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 'clamp(28px, 4vw, 36px)', lineHeight: 1.18 }}>
        {title.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
      </h2>
      <div style={{ width: 48, height: 1, background: C.silver3, marginBottom: 'clamp(28px, 4vw, 36px)' }} />
      <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px, 1.35vw, 15px)', color: C.body, lineHeight: 1.9 }}>
        {body}
      </p>
    </div>
  )
}

function Closing({ t, isAR }) {
  return (
    <motion.section
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1 }}
      style={{ padding: `clamp(80px, 12vw, 140px) ${GUTTER}`, textAlign: 'center', background: `radial-gradient(ellipse at 50% 0%, #141416 0%, ${C.bg} 60%)`, borderTop: '1px solid #111', direction: isAR ? 'rtl' : 'ltr' }}
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

  const tc  = (col) => ({ gridColumn: isMobile ? undefined : col })
  const mb  = (px)  => ({ marginBottom: isMobile ? 0 : px })

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      <Hero t={te.hero} isAR={isAR} />

      {/* 01 — CHAUFFEUR */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 4'), ...mb(48) }}>
          <Narrative n={s[0].n} label={s[0].label} title={s[0].title} body={s[0].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('6 / span 7') }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 'clamp(24px,3vw,32px)' }}>
            {s[0].details.map(d => <DetailItem key={d.label} label={d.label} value={d.value} isAR={isAR} />)}
          </div>
        </div>
      </Sec>

      {/* 02 — SIGNATURE OLFACTIVE */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1, ...mb(48) }}>
          <OlfactifVisual notes={s[1].fragranceNotes} credit={s[1].fragranceCredit} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[1].n} label={s[1].label} title={s[1].title} body={s[1].body} isAR={isAR} />
        </div>
      </Sec>

      <PhotoSlot caption={te.photoCaptions[0]} />

      {/* 03 — L'EAU, LA SERVIETTE */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 4'), ...mb(48) }}>
          <Narrative n={s[2].n} label={s[2].label} title={s[2].title} body={s[2].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('6 / span 6'), display: 'flex', flexDirection: 'column', gap: 'clamp(20px,3vw,36px)' }}>
          {s[2].details.map(d => <DetailItem key={d.label} label={d.label} value={d.value} isAR={isAR} />)}
        </div>
      </Sec>

      {/* 04 — TEMPÉRATURE */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 4'), order: isMobile ? 2 : 1, ...mb(48) }}>
          <TempDisplay label={s[3].tempLabel} sub={s[3].tempSub} isAR={isAR} />
        </div>
        <div style={{ ...tc('6 / span 7'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[3].n} label={s[3].label} title={s[3].title} body={s[3].body} isAR={isAR} />
        </div>
      </Sec>

      <PhotoSlot caption={te.photoCaptions[1]} />

      {/* 05 — NDA / DISCRÉTION */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 4'), ...mb(48) }}>
          <Narrative n={s[4].n} label={s[4].label} title={s[4].title} body={s[4].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('6 / span 6') }}>
          <NDAList title={s[4].ndaTitle} items={s[4].ndaItems} protect={s[4].ndaProtect} isAR={isAR} />
        </div>
      </Sec>

      {/* 06 — PONCTUALITÉ */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1, ...mb(48) }}>
          <Timeline steps={s[5].timeline} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[5].n} label={s[5].label} title={s[5].title} body={s[5].body} isAR={isAR} />
        </div>
      </Sec>

      <PhotoSlot caption={te.photoCaptions[2]} />

      {/* 07 — PERSONNALISATION */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 4'), ...mb(48) }}>
          <Narrative n={s[6].n} label={s[6].label} title={s[6].title} body={s[6].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('6 / span 7') }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 36 : 'clamp(24px,3vw,32px)' }}>
            {s[6].details.map(d => <DetailItem key={d.label} label={d.label} value={d.value} isAR={isAR} />)}
          </div>
        </div>
      </Sec>

      <Closing t={te.closing} isAR={isAR} />
    </div>
  )
}
