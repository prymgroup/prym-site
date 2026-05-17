import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

const C = {
  bg     : 'var(--c-bg)',
  text   : 'var(--c-text)',
  mid    : 'var(--c-silver)',
  soft   : 'var(--c-silver2)',
  accent : 'var(--c-silver3)',
}

export default function HeroSection() {
  const { lang } = useLanguage()
  const t = T[lang].teasing
  const isAR = lang === 'AR'

  return (
    <section style={{
      height: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      backgroundColor: 'var(--c-bg)',
      transition: 'background-color 0.3s ease',
      scrollSnapAlign: 'start', scrollSnapStop: 'always',
      direction: isAR ? 'rtl' : 'ltr',
    }}>
      {/* Warm radial highlight — adapts to theme via --c-hero-glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'var(--c-hero-glow)',
        pointerEvents: 'none',
      }} />

      <motion.div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* ── Logo — native silver chrome, wipe-in reveal ───────────────── */}
        <motion.img
          src="/logos/silver-logo-full.svg"
          alt="PRYM Executive Transport"
          draggable={false}
          initial={{ clipPath: 'inset(100% 0 0% 0)' }}
          animate={{ clipPath: 'inset(0% 0 0% 0)' }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: 'clamp(240px, 34vw, 520px)',
            height: 'auto', display: 'block',
            willChange: 'clip-path',
          }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: FONT, fontSize: 'clamp(0.44rem, 0.9vw, 0.6rem)', fontWeight: 400,
            letterSpacing: '0.55em', textTransform: isAR ? 'none' : 'uppercase',
            color: C.soft, marginTop: 'clamp(1.2rem, 3vh, 2rem)', textAlign: 'center',
          }}
        >
          {t.tagline}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: '2.8rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <span style={{
          fontFamily: FONT, fontSize: '0.48rem', letterSpacing: '0.5em',
          color: C.soft, textTransform: isAR ? 'none' : 'uppercase',
        }}>
          {t.scroll}
        </span>
        <motion.div
          style={{
            width: 1, height: 48, backgroundColor: C.accent,
            transformOrigin: 'top', willChange: 'transform',
          }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut', repeatDelay: 0.3 }}
        />
      </motion.div>
    </section>
  )
}
