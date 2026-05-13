import { useEffect, useState, lazy, Suspense, Component } from 'react'
import {
  motion,
  useScroll,
  useSpring,
} from 'framer-motion'

import HeroSection        from './components/HeroSection'
import ManifestoSection   from './components/ManifestoSection'
import ScrollSection      from './components/ScrollSection'
import PromiseSection     from './components/PromiseSection'
import LeadCaptureSection from './components/LeadCaptureSection'
import MobileNavbar       from './components/MobileNavbar'
import DesktopNav         from './components/DesktopNav'
import { useIsMobile }    from './hooks/useIsMobile'

// Lazy-load the booking flow (don't load 3D deps on the landing page)
const AProposPage = lazy(() => import('./components/AProposPage'))
const EntreprisesPage = lazy(() => import('./components/EntreprisesPage'))
const FlottePage = lazy(() => import('./components/FlottePage'))
const ExperiencePage = lazy(() => import('./components/ExperiencePage'))
const BookingFlow = lazy(() => import('./components/booking/BookingFlow'))
const HomePage    = lazy(() => import('./components/HomePage'))

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

// Catches ChunkLoadError and any uncaught render error in the page tree.
// Shows a minimal reload prompt instead of a blank white screen.
class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        background: 'var(--c-bg)', color: 'var(--c-text)',
      }}>
        <span style={{ fontFamily: FONT, fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--c-silver3)' }}>
          PRYM
        </span>
        <button onClick={() => window.location.reload()} style={{
          fontFamily: FONT, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'var(--c-silver)', background: 'none', border: '1px solid var(--c-silver3)',
          padding: '12px 32px', cursor: 'pointer',
        }}>
          Recharger
        </button>
      </div>
    )
    return this.props.children
  }
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
        backgroundColor: 'var(--c-silver3)',
        transformOrigin: 'left',
        scaleX,
        zIndex: 50,
      }}
    />
  )
}


/* ── Landing page ───────────────────────────────────────────────── */
function LandingPage() {
  const isMobile = useIsMobile()
  return (
    <div className="grain" style={{ backgroundColor: 'var(--c-bg)', height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <HeroSection />
      <ManifestoSection />
      <ScrollSection />
      <PromiseSection />
      <LeadCaptureSection />
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
      background: 'var(--c-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        fontFamily: FONT,
        fontSize: '10px',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'var(--c-silver3)',
      }}>
        PRYM
      </div>
      <div style={{
        width: '120px',
        height: '1px',
        background: 'var(--c-border-faint)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <motion.div
          style={{ position: 'absolute', inset: 0, background: 'var(--c-progress-fill)', transformOrigin: 'left' }}
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
    <AppErrorBoundary>
      {renderPage()}
    </AppErrorBoundary>
  )
}
