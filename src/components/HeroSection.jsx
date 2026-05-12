import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

// ── Warm Light Mode palette ───────────────────────────────────────────────
const C = {
  bg      : '#F8F7F4',   // warm off-white
  text    : '#1A1A1A',   // rich charcoal
  mid     : '#6B6867',   // warm stone-600
  soft    : '#A09A90',   // warm stone-400
  accent  : '#D6D0C4',   // champagne — decorative lines / scroll indicator
}

export default function HeroSection() {
  const { lang } = useLanguage()
  const t = T[lang].teasing
  const isAR = lang === 'AR'

  const { scrollY } = useScroll()
  const yOffset = useTransform(scrollY, [0, 700], [0, -100])
  const opacity  = useTransform(scrollY, [0, 500], [1, 0])
  const scale    = useTransform(scrollY, [0, 700], [1, 0.94])
  const blurRaw  = useTransform(scrollY, [0, 500], [0, 8])
  const filter   = useTransform(blurRaw, v => `blur(${v}px)`)

  return (
    <section style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      backgroundColor: C.bg,
    }}>
      {/* Subtle warm radial highlight */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(214,208,196,0.28) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div style={{
        y: yOffset, opacity, scale, filter,
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        willChange: 'transform, opacity, filter',
      }}>
        {/* ── Logo — dark charcoal gradient mask on warm white background ─── */}
        <div style={{ position: 'relative', width: 'clamp(240px, 34vw, 520px)' }}>
          {/* Spacer — keeps layout height; logo rendered via mask below */}
          <img
            src="/logos/logo-slogan-white.svg"
            alt="PRYM Executive Transport"
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block', opacity: 0 }}
          />
          {/* Dark charcoal shimmer gradient masked to the SVG shape */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0% 0)' }}
            animate={{ clipPath: 'inset(0% 0 0% 0)' }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(170deg, #1c1c1a 0%, #3a3835 22%, #1a1a18 42%, #2a2825 50%, #1a1a18 60%, #3a3835 78%, #1c1c1a 100%)',
              WebkitMaskImage  : 'url(/logos/logo-slogan-white.svg)',
              maskImage        : 'url(/logos/logo-slogan-white.svg)',
              WebkitMaskRepeat : 'no-repeat', maskRepeat : 'no-repeat',
              WebkitMaskSize   : 'contain',   maskSize   : 'contain',
              WebkitMaskPosition: 'center',   maskPosition: 'center',
              willChange: 'clip-path',
            }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
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
        transition={{ delay: 2.8, duration: 1.2 }}
        style={{
          position: 'absolute', bottom: '2.8rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '0.75rem', opacity,
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
