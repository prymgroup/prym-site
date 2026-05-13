import { useEffect, useRef, useState, Suspense, Component } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Html, Environment, ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import DesktopNav from './DesktopNav'
import MobileNavbar from './MobileNavbar'
import { useIsMobile } from '../hooks/useIsMobile'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const MODEL_PATH = '/models/signature_mercedes.glb'

// Catches useGLTF errors (404 in production) so a missing GLB never freezes
// the page. key=path resets the boundary when the model path changes.
// Must be used both outside Canvas (for outer React tree) AND inside Canvas
// (R3F runs its own reconciler root — errors don't cross that boundary).
class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}

/* ── 3D model ────────────────────────────────────────────────────────────────── */
// Draco decoder CDN — consistent with FlottePage and VehicleScene.
// Not required for this non-draco model but guards against future model swaps.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
useGLTF.preload(MODEL_PATH)


function SignatureModel() {
  const { scene } = useGLTF(MODEL_PATH)
  const ref   = useRef()
  const clone = scene.clone(true)

  useEffect(() => {
    if (!ref.current) return
    const box    = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    ref.current.position.x = -center.x
    ref.current.position.y = -box.min.y
    ref.current.position.z = -center.z
  }, [])

  return <group ref={ref} scale={[1, 1, 1]}><primitive object={clone} /></group>
}


/* ── Page ────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const isMobile = useIsMobile()

  useEffect(() => {
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Maroc'
  }, [])

  return (
    /* Action 1 */
    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory" style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}>

      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── Action 2 — Hero ───────────────────────────────────────────────────── */}
      <section className="h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative">

        {/* eyebrow */}
        <span
          className="text-xs uppercase tracking-[0.2em] mb-4 block"
          style={{ fontFamily: FONT_EU, color: 'var(--c-silver2)' }}
        >
          PRYM Executive Transport — Maroc
        </span>

        {/* H2 — primary */}
        <h2
          className="text-5xl md:text-7xl font-light uppercase tracking-[0.08em]"
          style={{ fontFamily: FONT_EU, lineHeight: 1.05, color: 'var(--c-text)' }}
        >
          LE MOUVEMENT,<br />ÉLEVÉ AU RANG<br />D'ART.
        </h2>

        {/* separator */}
        <div className="w-12 h-px my-6" style={{ background: 'var(--c-border)' }} />

        {/* subtitle — secondary */}
        <p
          className="max-w-md"
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
        >
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 relative z-10">
          <button
            className="inline-flex justify-center items-center px-10 py-4 uppercase tracking-widest text-sm transition-all"
            style={{ border: '1px solid var(--c-silver3)', color: 'var(--c-text)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-text)'; e.currentTarget.style.color = 'var(--c-hover-text)'; e.currentTarget.style.borderColor = 'var(--c-text)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-text)'; e.currentTarget.style.borderColor = 'var(--c-silver3)' }}
            onClick={() => window.location.href = '/reserver'}
          >
            RÉSERVER
          </button>
          <a
            href="/flotte"
            className="inline-block ml-6 text-sm uppercase tracking-widest transition-colors"
            style={{ color: 'var(--c-silver2)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-silver2)' }}
          >
            LA FLOTTE →
          </a>
        </div>

        {/* scroll pulse */}
        <div className="absolute bottom-10 left-8 md:left-24 flex flex-col items-center gap-2">
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
            style={{ width: 1, height: 40, transformOrigin: 'top', background: 'var(--c-silver3)' }}
          />
          <span
            style={{ fontFamily: FONT_EU, fontSize: 7, color: 'var(--c-silver3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ── Action 3 — Car ────────────────────────────────────────────────────── */}
      <section className="h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">

        {/* text — z-10 so it sits above the car */}
        <div className="relative z-10 max-w-xs md:max-w-sm">
          <span
            className="text-xs uppercase tracking-[0.2em] mb-4 block"
            style={{ fontFamily: FONT_EU, color: 'var(--c-silver2)' }}
          >
            PRYM Signature — Tier III
          </span>

          {/* separator above heading */}
          <div className="w-12 h-px mb-6" style={{ background: 'var(--c-border)' }} />

          <h2
            className="font-light uppercase tracking-[0.08em]"
            style={{
              fontFamily: FONT_EU,
              fontSize: 'clamp(28px,4vw,52px)',
              lineHeight: 1.18,
              color: 'var(--c-text)',
            }}
          >
            L'objet<br />de désir.
          </h2>

          <p
            className="mt-5"
            style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.1vw,15px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
          >
            La Mercedes Classe S. Le summum du raffinement,<br />
            mis à votre service dans chaque déplacement.
          </p>

          <a
            href="/flotte"
            className="mt-8 inline-flex items-center gap-2 transition-colors uppercase tracking-widest"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textDecoration: 'none', color: 'var(--c-silver2)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-silver2)' }}
          >
            Explorer toute la flotte &nbsp;→
          </a>
        </div>

        {/* 3D car — ErrorBoundary + Suspense outside Canvas for outer React tree.
            A second ErrorBoundary+Suspense lives inside Canvas because R3F uses
            its own reconciler root and errors/suspensions don't cross that boundary. */}
        <div className="absolute right-0 md:right-[-5%] top-1/2 -translate-y-1/2 w-full md:w-[60%] z-0 pointer-events-none" style={{ height: 'min(500px, 50vh)' }}>
          <ModelErrorBoundary fallback={<div style={{ width: '100%', height: '100%' }} />}>
            <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
              <Canvas
                camera={{ position: [12, 5, 16], fov: 30 }}
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                className="w-full h-full"
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-6, 8, -4]} intensity={1.0} color="#e8f0ff" />
                <directionalLight position={[0, -4, 6]} intensity={0.5} color="#fff5e8" />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.2} scale={20} blur={3} far={8} color="#4a4a48" />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} maxPolarAngle={Math.PI / 2} />
                {/* Inner boundary: errors inside Canvas don't reach the outer one */}
                <ModelErrorBoundary fallback={
                  <Html center>
                    <div style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em',
                      color: 'var(--c-silver3)', textTransform: 'uppercase' }}>
                      Visuel Indisponible
                    </div>
                  </Html>
                }>
                  <Suspense fallback={
                    <Html center>
                      <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em',
                        color: 'var(--c-silver3)', textTransform: 'uppercase' }}>
                        Chargement…
                      </span>
                    </Html>
                  }>
                    <SignatureModel />
                  </Suspense>
                </ModelErrorBoundary>
              </Canvas>
            </Suspense>
          </ModelErrorBoundary>
        </div>
      </section>

      {/* ── Action 4 — Closing ────────────────────────────────────────────────── */}
      <section className="h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative">

        {/* rule */}
        <div className="w-12 h-px mb-12" style={{ background: 'var(--c-border)' }} />

        {/* H2 — primary */}
        <h2
          style={{
            fontFamily: FONT_EU, fontWeight: 300,
            fontSize: 'clamp(22px,3.5vw,44px)',
            letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.25,
            color: 'var(--c-text)',
          }}
        >
          Découvrez notre<br />définition du temps.
        </h2>

        {/* CTA */}
        <a
          href="/experience"
          className="mt-12 transition-colors inline-flex items-center uppercase tracking-widest"
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textDecoration: 'none', gap: 14, color: 'var(--c-silver2)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-silver2)' }}
        >
          L'expérience PRYM
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}
          >
            →
          </motion.span>
        </a>

        {/* footer — pinned */}
        <div
          className="absolute left-8 md:left-24 right-8 md:right-24 pt-5 flex justify-between flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--c-border)', bottom: 'clamp(20px,3vh,32px)' }}
        >
          <p
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em', color: 'var(--c-silver2)', textTransform: 'uppercase', margin: 0 }}
          >
            PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Maroc
          </p>
          <p
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', color: 'var(--c-silver2)', textTransform: 'uppercase', margin: 0 }}
          >
            prym.ma
          </p>
        </div>
      </section>

    </div>
  )
}
