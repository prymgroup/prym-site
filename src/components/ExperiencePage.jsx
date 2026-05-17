import { useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'
import RevealOnScroll from './RevealOnScroll'
import { useIsMobile } from '../hooks/useIsMobile'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'

const C = {
  bg:      'var(--c-bg)',
  silver:  'var(--c-silver)',
  silver2: 'var(--c-silver2)',
  silver3: 'var(--c-silver3)',
  white:   'var(--c-text)',
  body:    'var(--c-silver)',
}

const GUTTER  = 'clamp(40px, 6vw, 120px)'
const COL_GAP = 'clamp(24px, 3vw, 52px)'

// Shared snap base
const SNAP = {
  height: '100dvh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  overflow: 'hidden',
}

// Top pad clears the fixed navbar
const SEC_PAD = `clamp(72px,10vh,96px) ${GUTTER} clamp(32px,5vh,48px)`


/* ── Sub-components ────────────────────────────────────────────────────────── */
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
            height: 1, flexShrink: 0, width: `${72 - i * 12}px`,
            background: isAR
              ? 'linear-gradient(270deg, var(--c-silver), transparent)'
              : 'linear-gradient(90deg, var(--c-silver), transparent)',
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
      <p style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(80px, 18vw, 120px)', letterSpacing: '-0.02em', color: C.white, lineHeight: 1 }}>
        21°
      </p>
      <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.4em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3 }}>
        {label}
      </p>
      <div style={{ width: 48, height: 1, background: C.silver3 }} />
      <p style={{ fontFamily: FONT_SE, fontSize: 12, color: C.silver3 }}>{sub}</p>
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
              <div style={{ width: 5, height: 5, borderRadius: '50%', border: '1px solid var(--c-silver3)', flexShrink: 0 }} />
              <span style={{ fontFamily: FONT_SE, fontSize: 14, color: C.body }}>{item}</span>
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
            border: step.active ? '1px solid var(--c-silver)' : '1px solid var(--c-silver3)',
          }} />
          <div style={{ flex: 1, height: 1, background: step.active ? (isAR ? 'linear-gradient(270deg, var(--c-silver), transparent)' : 'linear-gradient(90deg, var(--c-silver), transparent)') : 'var(--c-border)' }} />
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

function Narrative({ n, label, title, body, isAR }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', direction: isAR ? 'rtl' : 'ltr', textAlign: isAR ? 'right' : 'left' }}>
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

      <RevealOnScroll delay={0.1} y={20} style={{ marginBottom: 'clamp(24px,3vw,32px)' }}>
        <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(22px, 2.6vw, 32px)', letterSpacing: isAR ? '0.02em' : '0.08em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 'clamp(24px,3vw,32px)', lineHeight: 1.18 }}>
          {title.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
        </h2>
        <div style={{ width: 48, height: 1, background: C.silver3 }} />
      </RevealOnScroll>

      <RevealOnScroll delay={0.22} y={16}>
        <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px, 1.35vw, 15px)', color: C.body, lineHeight: 1.9 }}>
          {body}
        </p>
      </RevealOnScroll>
    </div>
  )
}

/* ── Grid section wrapper ──────────────────────────────────────────────────── */
function Sec({ children, isMobile }) {
  return (
    <section style={{
      ...SNAP,
      display: 'flex', alignItems: 'center',
      padding: SEC_PAD,
      borderTop: '1px solid var(--c-border)',
      background: 'var(--c-bg)',
    }}>
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: 'column',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: isMobile ? 'clamp(32px, 8vw, 56px)' : `0 ${COL_GAP}`,
        maxWidth: 1400, margin: '0 auto', width: '100%',
        alignItems: 'start',
      }}>
        {children}
      </div>
    </section>
  )
}

/* ── 50/50 Split ───────────────────────────────────────────────────────────── */
function SplitSection({ s, isAR, isMobile }) {
  return (
    <section style={{
      ...SNAP,
      borderTop: '1px solid var(--c-border)',
      background: 'var(--c-bg)',
    }}>
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        height: '100%',
      }}>
        {/* Left — image placeholder */}
        <div style={{
          background: 'var(--c-split-img)',
          height: isMobile ? '45vh' : '100%',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'flex-end',
          padding: 'clamp(20px,3vw,40px)',
        }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--c-panel-grad)' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--c-grid-line)' }} />
          <span style={{ position: 'relative', zIndex: 1, fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.silver3, opacity: 0.45 }}>
            Intérieur PRYM Signature — Cuir nappa
          </span>
        </div>

        {/* Right — 21° + NDA */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 'clamp(40px,7vw,72px)',
          padding: isMobile
            ? `clamp(48px,10vw,64px) ${GUTTER}`
            : `clamp(64px,8vw,96px) clamp(56px,7vw,96px)`,
        }}>
          <TempDisplay label={s[3].tempLabel} sub={s[3].tempSub} isAR={isAR} />
          <NDAList title={s[4].ndaTitle} items={s[4].ndaItems} protect={s[4].ndaProtect} isAR={isAR} />
        </div>
      </div>
    </section>
  )
}

/* ── Full-screen quote ─────────────────────────────────────────────────────── */
function FullScreenQuote() {
  return (
    <section style={{
      ...SNAP,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: `0 ${GUTTER}`,
      background: 'var(--c-quote-bg)',
      borderTop: '1px solid var(--c-border)',
      position: 'relative',
    }}>
      <span aria-hidden style={{
        position: 'absolute',
        fontFamily: FONT_EU, fontWeight: 300,
        fontSize: 'clamp(160px, 35vw, 420px)',
        letterSpacing: '-0.04em',
        color: 'var(--c-prym-numeral)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        bottom: '-0.15em', right: GUTTER,
      }}>
        PRYM
      </span>
      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.4 }}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: 'clamp(28px, 5.5vw, 72px)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.white, lineHeight: 1.2,
          textAlign: 'center', maxWidth: 1100,
        }}>
        Le silence est notre<br />
        <span style={{ color: C.silver }}>plus grand luxe.</span>
      </motion.p>
    </section>
  )
}

/* ── Closing ───────────────────────────────────────────────────────────────── */
function Closing({ t, isAR }) {
  return (
    <section style={{
      ...SNAP,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: `clamp(72px,10vh,96px) ${GUTTER} clamp(32px,5vh,48px)`,
      textAlign: 'center',
      background: 'var(--c-closing-bg)',
      borderTop: '1px solid var(--c-border)',
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true }} transition={{ duration: 1 }}
        style={{ maxWidth: 640 }}
      >
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.45em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 24 }}>
          {t.eyebrow}
        </p>
        <h2 style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(24px, 4vw, 48px)', letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, marginBottom: 20, lineHeight: 1.1 }}>
          {t.h2a}<br /><span style={{ color: C.silver }}>{t.h2b}</span>
        </h2>
        <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px, 1.5vw, 16px)', color: C.body, lineHeight: 1.8, maxWidth: 480, margin: '0 auto 40px', whiteSpace: 'pre-line' }}>
          {t.body}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/reserver" style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-bg)', background: 'var(--c-silver)', padding: '16px 40px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--c-silver)' }}>
            {t.ctaBook}
          </a>
          <a href="/flotte" style={{ fontFamily: FONT_EU, fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.35em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver)', background: 'transparent', border: '1px solid var(--c-silver3)', padding: '16px 40px', textDecoration: 'none', display: 'inline-block', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-silver)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-silver3)' }}>
            {t.ctaFlotte}
          </a>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function ExperiencePage() {
  const isMobile = useIsMobile(900)
  const { lang } = useLanguage()
  const te   = T[lang].experience
  const isAR = lang === 'AR'
  const s    = te.sections

  useEffect(() => {
    document.title = "L'Expérience — PRYM Executive Transport"
  }, [])

  const tc = (col) => ({ gridColumn: isMobile ? undefined : col })

  return (
    <div style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── 1 · Hero ─────────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column',
        alignItems: isAR ? 'flex-end' : 'flex-start', justifyContent: 'flex-end',
        padding: `0 ${GUTTER} clamp(48px,8vh,80px)`,
        background: 'var(--c-hero-bg)',
        direction: isAR ? 'rtl' : 'ltr',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--c-grid-line)' }} />

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.45em', textTransform: isAR ? 'none' : 'uppercase', color: C.silver3, marginBottom: 32, position: 'relative', zIndex: 1 }}>
          {te.hero.eyebrow}
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: FONT_EU, fontWeight: 300, fontSize: 'clamp(32px, 6vw, 72px)', letterSpacing: isAR ? '0.02em' : '0.12em', textTransform: isAR ? 'none' : 'uppercase', color: C.white, lineHeight: 1.05, marginBottom: 32, maxWidth: 900, position: 'relative', zIndex: 1 }}>
          {te.hero.h1a}<br />
          <span style={{ color: C.silver }}>{te.hero.h1b}</span>
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: 80, height: 1, background: isAR ? 'linear-gradient(270deg, var(--c-silver), transparent)' : 'linear-gradient(90deg, var(--c-silver), transparent)', marginBottom: 36, transformOrigin: isAR ? 'right' : 'left', position: 'relative', zIndex: 1 }} />

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(14px, 1.8vw, 18px)', color: C.body, lineHeight: 1.8, maxWidth: 560, whiteSpace: 'pre-line', position: 'relative', zIndex: 1 }}>
          {te.hero.body}
        </motion.p>
      </section>

      {/* ── 2 · Chauffeur ────────────────────────────────────────────── */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5') }}>
          <Narrative n={s[0].n} label={s[0].label} title={s[0].title} body={s[0].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), display: 'flex', alignItems: 'center' }}>
          <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(15px,1.5vw,17px)', color: C.silver2, lineHeight: 2, borderLeft: '1px solid var(--c-silver3)', paddingLeft: 'clamp(24px,3vw,40px)' }}>
            {s[0].details?.[0]?.value ?? s[0].body}
          </p>
        </div>
      </Sec>

      {/* ── 3 · Signature Olfactive ───────────────────────────────────── */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1 }}>
          <OlfactifVisual notes={s[1].fragranceNotes} credit={s[1].fragranceCredit} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[1].n} label={s[1].label} title={s[1].title} body={s[1].body} isAR={isAR} />
        </div>
      </Sec>

      {/* ── 4 · L'Attention ──────────────────────────────────────────── */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5') }}>
          <Narrative n={s[2].n} label={s[2].label} title={s[2].title} body={s[2].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}
          >
            {s[2].details.map((d) => (
              <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silver3 }}>
                  {d.label}
                </span>
                <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,15px)', color: C.silver2, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {d.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Sec>

      {/* ── 5 · 50/50 split — image + 21° + NDA ─────────────────────── */}
      <SplitSection s={s} isAR={isAR} isMobile={isMobile} />

      {/* ── 5 · Full-screen quote ─────────────────────────────────────── */}
      <FullScreenQuote />

      {/* ── 6 · Ponctualité ──────────────────────────────────────────── */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5'), order: isMobile ? 2 : 1 }}>
          <Timeline steps={s[5].timeline} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), order: isMobile ? 1 : 2 }}>
          <Narrative n={s[5].n} label={s[5].label} title={s[5].title} body={s[5].body} isAR={isAR} />
        </div>
      </Sec>

      {/* ── 8 · La Personnalisation ──────────────────────────────────── */}
      <Sec isMobile={isMobile}>
        <div style={{ ...tc('1 / span 5') }}>
          <Narrative n={s[6].n} label={s[6].label} title={s[6].title} body={s[6].body} isAR={isAR} />
        </div>
        <div style={{ ...tc('7 / span 6'), display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
              {s[6].details.map((d) => (
                <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silver3 }}>
                    {d.label}
                  </span>
                  <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,15px)', color: C.silver2, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {d.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Sec>

      {/* ── 9 · Closing ───────────────────────────────────────────────── */}
      <Closing t={te.closing} isAR={isAR} />
    </div>
  )
}
