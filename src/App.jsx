import { useEffect, useState, lazy, Suspense } from 'react'
import {
  motion,
  useScroll,
  useSpring,
} from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'

import HeroSection        from './components/HeroSection'
import ManifestoSection   from './components/ManifestoSection'
import ScrollSection      from './components/ScrollSection'
import PromiseSection     from './components/PromiseSection'
import LeadCaptureSection from './components/LeadCaptureSection'
import MobileNavbar       from './components/MobileNavbar'
import DesktopNav         from './components/DesktopNav'

// Lazy-load the booking flow (don't load 3D deps on the landing page)
const AProposPage = lazy(() => import('./components/AProposPage'))
const EntreprisesPage = lazy(() => import('./components/EntreprisesPage'))
const FlottePage = lazy(() => import('./components/FlottePage'))
const ExperiencePage = lazy(() => import('./components/ExperiencePage'))
const BookingFlow = lazy(() => import('./components/booking/BookingFlow'))
const HomePage    = lazy(() => import('./components/HomePage'))

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"


/* ── Scroll progress bar ────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 })
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 1,
        backgroundColor: '#B0AA9F',
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
        color: '#9E9890',
        textTransform: 'uppercase',
      }}>
        PRYM
      </span>
      <span style={{
        fontFamily: FONT,
        fontSize: '0.56rem',
        letterSpacing: '0.32em',
        color: '#B0AA9F',
        textTransform: 'uppercase',
      }}>
        — 2026 —
      </span>
    </motion.div>
  )
}

/* ── Landing page ───────────────────────────────────────────────── */
function useLandingIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

function LandingPage() {
  const isMobile = useLandingIsMobile()
  return (
    <div className="grain" style={{ backgroundColor: 'var(--c-bg)', height: '100vh', overflow: 'hidden' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <main style={{
        height: '100vh', overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
      }}>
        <HeroSection />
        <ManifestoSection />
        <ScrollSection />
        <PromiseSection />
        <LeadCaptureSection />
      </main>
    </div>
  )
}

/* ── Global snap shell — wraps every multi-section page ────────── */
function SnapPageShell({ children }) {
  return (
    <div className="grain" style={{
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    }}>
      {children}
    </div>
  )
}

/* ── Booking loading fallback ───────────────────────────────────── */
function BookingLoader() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#FDFBF7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        fontFamily: "'Eurostile', 'Arial Narrow', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'rgba(26,26,26,0.3)',
      }}>
        PRYM
      </div>
      <div style={{
        width: '120px',
        height: '1px',
        background: 'rgba(26,26,26,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.25)', transformOrigin: 'left' }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>
    </div>
  )
}

/* ── Simple path router ─────────────────────────────────────────── */
function useCurrentPath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const handler = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])
  return path
}

/* ── App ────────────────────────────────────────────────────────── */
export default function App() {
  const path = useCurrentPath()
  const isAPropos      = path === '/a-propos'    || path === '/a-propos/'
  const isEntreprises  = path === '/entreprises' || path === '/entreprises/'
  const isFlotte       = path === '/flotte'      || path === '/flotte/'
  const isExperience   = path === '/experience'  || path === '/experience/'
  const isBooking      = path === '/reserver'    || path === '/reserver/'
  const isAfterTeasing = path === '/afterteasing'|| path === '/afterteasing/'

  function renderPage() {
    if (isAPropos)      return <Suspense fallback={<BookingLoader />}><SnapPageShell><AProposPage /></SnapPageShell></Suspense>
    if (isEntreprises)  return <Suspense fallback={<BookingLoader />}><SnapPageShell><EntreprisesPage /></SnapPageShell></Suspense>
    if (isFlotte)       return <Suspense fallback={<BookingLoader />}><FlottePage /></Suspense>
    if (isExperience)   return <Suspense fallback={<BookingLoader />}><SnapPageShell><ExperiencePage /></SnapPageShell></Suspense>
    if (isBooking)      return <Suspense fallback={<BookingLoader />}><BookingFlow /></Suspense>
    if (isAfterTeasing) return <Suspense fallback={<BookingLoader />}><HomePage /></Suspense>
    return <LandingPage />
  }

  return (
    <ThemeProvider>
{renderPage()}
    </ThemeProvider>
  )
}
