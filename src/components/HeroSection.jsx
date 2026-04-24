import { motion, useScroll, useTransform } from 'framer-motion'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

export default function HeroSection() {
  const { scrollY } = useScroll()
  const yOffset = useTransform(scrollY, [0, 700], [0, -100])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale   = useTransform(scrollY, [0, 700], [1, 0.94])
  const blurRaw = useTransform(scrollY, [0, 500], [0, 8])
  const filter  = useTransform(blurRaw, v => `blur(${v}px)`)

  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Studio vignette spot */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 45% at 50% 48%, rgba(198,198,198,0.04) 0%, rgba(198,198,198,0.01) 45%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo + tagline wrapper — scroll parallax */}
      <motion.div
        style={{
          y: yOffset,
          opacity,
          scale,
          filter,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Chrome logo container */}
        <div
          style={{
            position: 'relative',
            width: 'clamp(240px, 34vw, 520px)',
          }}
        >
          {/* Invisible spacer — preserves layout dimensions */}
          <img
            src="/logos/logo-slogan-white.svg"
            alt="PRYM Executive Transport"
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block', opacity: 0 }}
          />

          {/* Chrome gradient — revealed via clipPath bottom→top */}
          <motion.div
            initial={{ clipPath: 'inset(100% 0 0% 0)' }}
            animate={{ clipPath: 'inset(0% 0 0% 0)' }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(170deg, #2c2c2b 0%, #706f6f 22%, #c6c6c6 42%, #d4d4d4 50%, #b0b0b0 60%, #706f6f 78%, #2c2c2b 100%)',
              WebkitMaskImage: 'url(/logos/logo-slogan-white.svg)',
              maskImage: 'url(/logos/logo-slogan-white.svg)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              willChange: 'clip-path',
            }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(0.44rem, 0.9vw, 0.6rem)',
            fontWeight: 400,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: '#3c3c3b',
            marginTop: 'clamp(1.2rem, 3vh, 2rem)',
            textAlign: 'center',
          }}
        >
          Casablanca &nbsp;·&nbsp; 2026
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1.2 }}
        style={{
          position: 'absolute',
          bottom: '2.8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          opacity,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: '0.48rem',
            letterSpacing: '0.5em',
            color: '#3c3c3b',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <motion.div
          style={{
            width: 1,
            height: 48,
            backgroundColor: '#3c3c3b',
            transformOrigin: 'top',
            willChange: 'transform',
          }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.6,
            ease: 'easeInOut',
            repeatDelay: 0.3,
          }}
        />
      </motion.div>
    </section>
  )
}
