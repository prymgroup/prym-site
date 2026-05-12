import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT     = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const C = {
  bg          : 'var(--c-bg)',
  text        : 'var(--c-text)',
  mid         : 'var(--c-silver)',
  soft        : 'var(--c-silver2)',
  accent      : 'var(--c-silver3)',
  borderIdle  : 'var(--c-silver3)',
  borderFocus : 'var(--c-text)',
}

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 900)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 900)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

function Field({ label, type = 'text', value, onChange, autoComplete, isAR }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={label}
      autoComplete={autoComplete} className="prym-field"
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'transparent', border: 'none', outline: 'none',
        color: 'var(--c-text)', fontFamily: FONT,
        fontSize: 'clamp(0.8rem, 1.4vw, 0.92rem)',
        letterSpacing: isAR ? '0.03em' : '0.14em',
        padding: '0.6rem 0',
        borderBottom: focused ? '1px solid var(--c-text)' : '1px solid var(--c-silver3)',
        transition: 'border-color 0.35s',
        direction: isAR ? 'rtl' : 'ltr',
        textAlign: isAR ? 'right' : 'left',
      }}
    />
  )
}

function MagneticArrow({ status, isMobile }) {
  const ref = useRef(null)
  const [arrowHover, setArrowHover] = useState(false)
  const x  = useMotionValue(0);  const y  = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.5 })

  const handleMove = useCallback((e) => {
    const el = ref.current; if (!el) return
    const rect = el.getBoundingClientRect()
    const dx   = e.clientX - (rect.left + rect.width  / 2)
    const dy   = e.clientY - (rect.top  + rect.height / 2)
    if (Math.hypot(dx, dy) < 100) { x.set(dx * 0.4); y.set(dy * 0.4) }
    else { x.set(0); y.set(0) }
  }, [x, y])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])

  return (
    <motion.button ref={ref} type="submit" aria-label="Soumettre"
      onMouseEnter={() => setArrowHover(true)}
      onMouseLeave={() => { setArrowHover(false); x.set(0); y.set(0) }}
      style={{
        x: sx, y: sy, background: 'none', border: 'none', cursor: 'pointer',
        padding: isMobile ? '1rem 0 1rem 1rem' : '0.4rem 0.6rem',
        display: 'inline-flex', alignItems: 'center',
        willChange: 'transform', flexShrink: 0, alignSelf: 'flex-end',
      }}>
      <AnimatePresence mode="wait">
        {status === 'loading' ? (
          <motion.svg key="spin" width="22" height="22" viewBox="0 0 22 22" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 }, rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}>
            <circle cx="11" cy="11" r="8"
              stroke="var(--c-silver2)" strokeWidth="1"
              strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <motion.svg key="arrow" width="32" height="10" viewBox="0 0 32 10" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              transform: arrowHover ? 'translateX(6px)' : 'translateX(0)',
              transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}>
            <path d="M0 5H30M30 5L25.5 1M30 5L25.5 9"
              stroke="var(--c-text)" strokeWidth="0.85" strokeLinecap="square" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function TabSwitch({ mode, onChange, labels }) {
  const [hovered, setHovered] = useState(null)
  const tabs = [{ id: 'b2c', label: labels.b2c }, { id: 'b2b', label: labels.b2b }]
  return (
    <div style={{ display: 'flex', gap: '2.4rem' }}>
      {tabs.map(tab => {
        const active = mode === tab.id
        return (
          <button key={tab.id} onClick={() => onChange(tab.id)}
            onMouseEnter={() => setHovered(tab.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT,
              fontSize: '0.62rem', letterSpacing: '0.36em', textTransform: 'uppercase',
              fontWeight: active ? 500 : 300,
              color: active ? 'var(--c-text)' : (hovered === tab.id ? 'var(--c-text)' : 'var(--c-silver2)'),
              padding: 0, transition: 'color 0.35s',
            }}>
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function B2CForm({ onSuccess, isMobile, t, isAR }) {
  const [fields, setFields] = useState({ prenom: '', nom: '', email: '' })
  const [status, setStatus] = useState('idle')
  const set = key => e => {
    setFields(f => ({ ...f, [key]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return
    if (!fields.prenom.trim() || !fields.nom.trim() || !EMAIL_RE.test(fields.email.trim())) {
      setStatus('error'); setTimeout(() => setStatus('idle'), 2400); return
    }
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('success'); onSuccess()
  }
  return (
    <form onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '2rem' : '0.2rem', width: '100%' }}>
      <Field label={t.b2c.prenom} value={fields.prenom} onChange={set('prenom')} autoComplete="given-name"     isAR={isAR} />
      <Field label={t.b2c.nom}    value={fields.nom}    onChange={set('nom')}    autoComplete="family-name"    isAR={isAR} />
      <Field label={t.b2c.email}  value={fields.email}  onChange={set('email')}  autoComplete="email" type="email" isAR={isAR} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: isMobile ? '1.2rem' : '0.6rem' }}>
        <AnimatePresence>
          {status === 'error' && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.28em', color: 'var(--c-silver2)', textTransform: isAR ? 'none' : 'uppercase' }}>
              {t.error}
            </motion.span>
          )}
        </AnimatePresence>
        <div style={{ marginInlineStart: 'auto' }}>
          <MagneticArrow status={status} isMobile={isMobile} />
        </div>
      </div>
    </form>
  )
}

function B2BForm({ onSuccess, isMobile, t, isAR }) {
  const [fields, setFields] = useState({ email: '', societe: '', fonction: '' })
  const [status, setStatus] = useState('idle')
  const set = key => e => {
    setFields(f => ({ ...f, [key]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }
  const handleSubmit = async e => {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return
    if (!EMAIL_RE.test(fields.email.trim()) || !fields.societe.trim() || !fields.fonction.trim()) {
      setStatus('error'); setTimeout(() => setStatus('idle'), 2400); return
    }
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('success'); onSuccess()
  }
  return (
    <form onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '2rem' : '0.2rem', width: '100%' }}>
      <Field label={t.b2b.email}    value={fields.email}    onChange={set('email')}    autoComplete="email" type="email"      isAR={isAR} />
      <Field label={t.b2b.societe}  value={fields.societe}  onChange={set('societe')}  autoComplete="organization"            isAR={isAR} />
      <Field label={t.b2b.fonction} value={fields.fonction} onChange={set('fonction')} autoComplete="organization-title"      isAR={isAR} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: isMobile ? '1.2rem' : '0.6rem' }}>
        <AnimatePresence>
          {status === 'error' && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.28em', color: 'var(--c-silver2)', textTransform: isAR ? 'none' : 'uppercase' }}>
              {t.error}
            </motion.span>
          )}
        </AnimatePresence>
        <div style={{ marginInlineStart: 'auto' }}>
          <MagneticArrow status={status} isMobile={isMobile} />
        </div>
      </div>
    </form>
  )
}

export default function LeadCaptureSection() {
  const { lang } = useLanguage()
  const t        = T[lang].teasing.lead
  const isAR     = lang === 'AR'
  const [mode, setMode]       = useState('b2c')
  const [success, setSuccess] = useState(false)
  const [cardRef, cardInView] = useInView(0.15)
  const isMobile              = useIsMobile()

  const handleModeChange = (m) => { setMode(m); setSuccess(false) }

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: isMobile ? '5rem 2rem 4rem' : 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 3rem)',
      backgroundColor: 'var(--c-bg)', position: 'relative',
      transition: 'background-color 0.3s ease',
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      <motion.div ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: isMobile ? '100%' : 560, position: 'relative',
          padding: isMobile ? 0 : 'clamp(2.4rem, 6vw, 4rem) clamp(1.8rem, 5vw, 3.6rem)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.4rem, 3.5vh, 2.2rem)' }}>

          {/* Section eyebrow */}
          <p style={{
            fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.44em',
            color: 'var(--c-silver2)', textTransform: isAR ? 'none' : 'uppercase', margin: 0,
          }}>
            {t.label}
          </p>

          {/* Intro */}
          <p style={{
            fontFamily: FONT, fontSize: 'clamp(0.7rem, 1.2vw, 0.84rem)',
            letterSpacing: isAR ? '0.02em' : '0.06em',
            color: 'var(--c-silver)', lineHeight: 1.7, margin: 0,
            direction: isAR ? 'rtl' : 'ltr',
          }}>
            {t.intro}
          </p>

          <div><TabSwitch mode={mode} onChange={handleModeChange} labels={t.tabs} /></div>

          {/* Thin separator */}
          <div style={{ width: '100%', height: 1, backgroundColor: 'var(--c-border)' }} />

          <AnimatePresence mode="wait">
            {success ? (
              <motion.p key="success"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: FONT, fontSize: '0.72rem', letterSpacing: '0.38em',
                  color: 'var(--c-text)', textTransform: isAR ? 'none' : 'uppercase',
                  textAlign: 'center', padding: '1.4rem 0', margin: 0,
                }}>
                {t.success}
              </motion.p>
            ) : (
              <motion.div key={mode}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                {mode === 'b2c'
                  ? <B2CForm onSuccess={() => setSuccess(true)} isMobile={isMobile} t={t} isAR={isAR} />
                  : <B2BForm onSuccess={() => setSuccess(true)} isMobile={isMobile} t={t} isAR={isAR} />
                }
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discretion note */}
          <p style={{
            fontFamily: FONT, fontSize: '0.5rem', letterSpacing: '0.22em',
            color: 'var(--c-silver2)', textTransform: isAR ? 'none' : 'uppercase', margin: 0,
          }}>
            {t.discretion}
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.6, duration: 1.6 }}
        style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0, padding: '0 2rem', textAlign: 'center' }}>
        <p style={{
          fontFamily: FONT, fontSize: 'clamp(0.48rem, 1vw, 0.58rem)', letterSpacing: '0.34em',
          color: 'var(--c-silver2)', textTransform: isAR ? 'none' : 'uppercase', margin: 0,
        }}>
          {t.footer}
        </p>
      </motion.footer>
    </section>
  )
}
