import { useEffect, useRef, useState, useCallback } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
} from 'framer-motion'
import Lenis from 'lenis'

import HeroSection       from './components/HeroSection'
import ManifestoSection  from './components/ManifestoSection'
import ScrollSection     from './components/ScrollSection'
import PromiseSection    from './components/PromiseSection'
import LeadCaptureSection from './components/LeadCaptureSection'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

/* ── Lenis smooth scroll ────────────────────────────────────────── */
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf
    function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}

/* ── Custom cursor ─────────────────────────────────────────────── */
function CustomCursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 38, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 380, damping: 38, mass: 0.4 })
  const xDot = useSpring(x, { stiffness: 880, damping: 48, mass: 0.2 })
  const yDot = useSpring(y, { stiffness: 880, damping: 48, mass: 0.2 })
  const [variant, setVariant] = useState('default')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move  = e => { x.set(e.clientX); y.set(e.clientY); setVisible(true) }
    const leave = () => setVisible(false)
    const over  = e => {
      const t = e.target
      if (!(t instanceof Element)) return
      if (t.closest('[data-cursor="hover"]')) setVariant('hover')
      else if (t.closest('input, textarea'))  setVariant('text')
      else setVariant('default')
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseleave', leave)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseleave', leave)
    }
  }, [x, y])

  const ringSize = variant === 'hover' ? 56 : variant === 'text' ? 2 : 28
  const dotSize  = variant === 'hover' ? 5  : variant === 'text' ? 18 : 4

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: sx, y: sy,
          translateX: '-50%', translateY: '-50%',
          width: ringSize, height: ringSize,
          borderRadius: '50%',
          border: '1px solid rgba(198,198,198,0.55)',
          pointerEvents: 'none', zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'width 0.32s cubic-bezier(.22,1,.36,1), height 0.32s cubic-bezier(.22,1,.36,1), opacity 0.28s',
        }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0,
          x: xDot, y: yDot,
          translateX: '-50%', translateY: '-50%',
          width: dotSize, height: dotSize,
          borderRadius: variant === 'text' ? 1 : '50%',
          backgroundColor: '#c6c6c6',
          pointerEvents: 'none', zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'width 0.28s cubic-bezier(.22,1,.36,1), height 0.28s cubic-bezier(.22,1,.36,1), border-radius 0.28s, opacity 0.28s',
        }}
      />
    </>
  )
}

/* ── Scroll progress bar ────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 1,
        backgroundColor: '#3c3c3b',
        transformOrigin: 'left',
        scaleX,
        zIndex: 50,
      }}
    />
  )
}

/* ── Top bar ────────────────────────────────────────────────────── */
function TopBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.8, duration: 1.4 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: 'clamp(1.2rem, 3vh, 1.8rem) clamp(1.25rem, 4vw, 3rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 45, pointerEvents: 'none',
      }}
    >
      <span style={{
        fontFamily: FONT,
        fontSize: '0.6rem',
        letterSpacing: '0.38em',
        color: '#706f6f',
        textTransform: 'uppercase',
      }}>
        PRYM
      </span>
      <span style={{
        fontFamily: FONT,
        fontSize: '0.56rem',
        letterSpacing: '0.32em',
        color: '#3c3c3b',
        textTransform: 'uppercase',
      }}>
        — 2026 —
      </span>
    </motion.div>
  )
}

/* ── App ────────────────────────────────────────────────────────── */
export default function App() {
  useLenis()

  return (
    <div className="grain" style={{ backgroundColor: '#0a0a0a', position: 'relative', minHeight: '100vh' }}>
      <CustomCursor />
      <ScrollProgress />
      <TopBar />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <ManifestoSection />
        <ScrollSection />
        <PromiseSection />
        <LeadCaptureSection />
      </main>
    </div>
  )
}
