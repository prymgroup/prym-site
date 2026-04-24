import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ── Input field ────────────────────────────────────────────────── */
function Field({ label, type = 'text', value, onChange, autoComplete }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', paddingBottom: '0.6rem' }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#f6f6f6',
          fontFamily: FONT,
          fontSize: 'clamp(0.75rem, 1.3vw, 0.88rem)',
          letterSpacing: '0.1em',
          padding: '0.4rem 0',
          borderBottom: `1px solid ${focused ? '#c6c6c6' : '#3c3c3b'}`,
          transition: 'border-color 0.35s',
        }}
      />
    </div>
  )
}

/* ── Magnetic arrow ─────────────────────────────────────────────── */
function MagneticArrow({ status }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.5 })

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    if (Math.hypot(dx, dy) < 100) { x.set(dx * 0.4); y.set(dy * 0.4) }
    else { x.set(0); y.set(0) }
  }, [x, y])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])

  return (
    <motion.button
      ref={ref}
      type="submit"
      aria-label="Soumettre"
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{
        x: sx, y: sy,
        background: 'none', border: 'none',
        padding: '0.4rem 0.6rem',
        display: 'inline-flex', alignItems: 'center',
        willChange: 'transform', flexShrink: 0,
        alignSelf: 'flex-end',
      }}
      whileHover={{ scale: 1.15 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {status === 'loading' ? (
          <motion.svg key="spin" width="22" height="22" viewBox="0 0 22 22" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 360 }} exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 }, rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}>
            <circle cx="11" cy="11" r="8" stroke="#c6c6c6" strokeWidth="1"
              strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round" />
          </motion.svg>
        ) : (
          <motion.svg key="arrow" width="32" height="10" viewBox="0 0 32 10" fill="none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <path d="M0 5H30M30 5L25.5 1M30 5L25.5 9"
              stroke="#c6c6c6" strokeWidth="0.85" strokeLinecap="square" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

/* ── Tab switcher ───────────────────────────────────────────────── */
function TabSwitch({ mode, onChange }) {
  const tabs = [
    { id: 'b2c', label: 'Particulier' },
    { id: 'b2b', label: 'Entreprise' },
  ]
  return (
    <div style={{ display: 'flex', gap: '2.4rem', position: 'relative' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            background: 'none', border: 'none',
            fontFamily: FONT,
            fontSize: '0.62rem',
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: mode === tab.id ? '#c6c6c6' : '#3c3c3b',
            padding: '0 0 0.6rem',
            position: 'relative',
            transition: 'color 0.35s',
          }}
        >
          {tab.label}
          {mode === tab.id && (
            <motion.div
              layoutId="tab-underline"
              style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: 1,
                backgroundColor: '#706f6f',
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

/* ── B2C Form ───────────────────────────────────────────────────── */
function B2CForm({ onSuccess }) {
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
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2400)
      return
    }
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('success')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
      <Field label="Prénom" value={fields.prenom} onChange={set('prenom')} autoComplete="given-name" />
      <Field label="Nom" value={fields.nom} onChange={set('nom')} autoComplete="family-name" />
      <Field label="Adresse email" type="email" value={fields.email} onChange={set('email')} autoComplete="email" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
        <AnimatePresence>
          {status === 'error' && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.28em',
                color: '#706f6f', textTransform: 'uppercase' }}>
              Champs incomplets ou email invalide.
            </motion.span>
          )}
        </AnimatePresence>
        <div style={{ marginLeft: 'auto' }}>
          <MagneticArrow status={status} />
        </div>
      </div>
    </form>
  )
}

/* ── B2B Form ───────────────────────────────────────────────────── */
function B2BForm({ onSuccess }) {
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
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2400)
      return
    }
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1500))
    setStatus('success')
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
      <Field label="Adresse email" type="email" value={fields.email} onChange={set('email')} autoComplete="email" />
      <Field label="Société" value={fields.societe} onChange={set('societe')} autoComplete="organization" />
      <Field label="Fonction" value={fields.fonction} onChange={set('fonction')} autoComplete="organization-title" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
        <AnimatePresence>
          {status === 'error' && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.28em',
                color: '#706f6f', textTransform: 'uppercase' }}>
              Champs incomplets ou email invalide.
            </motion.span>
          )}
        </AnimatePresence>
        <div style={{ marginLeft: 'auto' }}>
          <MagneticArrow status={status} />
        </div>
      </div>
    </form>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
export default function LeadCaptureSection() {
  const [mode, setMode] = useState('b2c')
  const [success, setSuccess] = useState(false)
  const [cardRef, cardInView] = useInView(0.15)

  const handleModeChange = (m) => {
    setMode(m)
    setSuccess(false)
  }

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.25rem, 5vw, 3rem)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
      }}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: 560,
          position: 'relative',
          padding: 'clamp(2.4rem, 6vw, 4rem) clamp(1.8rem, 5vw, 3.6rem)',
          background: 'rgba(246,246,246,0.03)',
          border: '1px solid rgba(198,198,198,0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 1px 0 rgba(246,246,246,0.04) inset, 0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '20%', right: '20%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(198,198,198,0.25), transparent)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.4rem, 3.5vh, 2.2rem)' }}>

          {/* Label */}
          <p style={{
            fontFamily: FONT, fontSize: '0.56rem', letterSpacing: '0.44em',
            color: '#3c3c3b', textTransform: 'uppercase', textAlign: 'center', margin: 0,
          }}>
            Accès Prioritaire — Conciergerie Privée
          </p>

          {/* Intro */}
          <p style={{
            fontFamily: FONT, fontSize: 'clamp(0.7rem, 1.2vw, 0.84rem)',
            letterSpacing: '0.06em', color: '#706f6f', lineHeight: 1.7,
            textAlign: 'center', margin: 0,
          }}>
            L'accès à notre flotte initiale sera restreint.
            Déposez vos coordonnées pour un accès prioritaire.
          </p>

          {/* Tab switcher */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TabSwitch mode={mode} onChange={handleModeChange} />
          </div>

          {/* Form area */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: FONT, fontSize: '0.72rem', letterSpacing: '0.38em',
                  color: '#c6c6c6', textTransform: 'uppercase',
                  textAlign: 'center', padding: '1.4rem 0', margin: 0,
                }}
              >
                Accès demandé.
              </motion.p>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {mode === 'b2c'
                  ? <B2CForm onSuccess={() => setSuccess(true)} />
                  : <B2BForm onSuccess={() => setSuccess(true)} />
                }
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discretion */}
          <p style={{
            fontFamily: FONT, fontSize: '0.5rem', letterSpacing: '0.22em',
            color: '#3c3c3b', textAlign: 'center', textTransform: 'uppercase', margin: 0,
          }}>
            Discrétion absolue. Aucune communication secondaire.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.6, duration: 1.6 }}
        style={{
          position: 'absolute', bottom: '2rem', left: 0, right: 0,
          textAlign: 'center', padding: '0 1rem',
        }}
      >
        <p style={{
          fontFamily: FONT, fontSize: 'clamp(0.48rem, 1vw, 0.58rem)',
          letterSpacing: '0.34em', color: '#3c3c3b',
          textTransform: 'uppercase', margin: 0,
        }}>
          PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Casablanca
        </p>
      </motion.footer>
    </section>
  )
}
