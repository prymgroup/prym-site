import { useEffect, useRef, Suspense, Component } from 'react'
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

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
useGLTF.preload(MODEL_PATH)

// Dual-boundary pattern: one instance lives outside Canvas (outer React tree),
// a second instance lives inside Canvas (R3F runs its own reconciler root —
// errors thrown inside Canvas never reach boundaries placed outside it).
class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}

function SignatureModel() {
  const { scene } = useGLTF(MODEL_PATH)
  const ref = useRef()
  const clone = scene.clone(true)

  useEffect(() => {
    if (!ref.current) return
    const box    = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    ref.current.position.x = -center.x
    ref.current.position.y = -box.min.y
    ref.current.position.z = -center.z
  }, [])

  return <group ref={ref}><primitive object={clone} /></group>
}

const PILLARS = [
  {
    number: '01',
    title: 'Discrétion',
    body: 'La confidentialité de vos déplacements est notre engagement premier. Chaque trajet reste entre vous et nous.',
  },
  {
    number: '02',
    title: 'Ponctualité',
    body: 'Votre temps est irremplaçable. Nos chauffeurs anticipent chaque variable pour garantir une précision absolue.',
  },
  {
    number: '03',
    title: 'Excellence',
    body: 'Des véhicules de prestige entretenus au plus haut standard. Un service calibré pour les exigences les plus élevées.',
  },
]

export default function HomePageV2() {
  const isMobile = useIsMobile()

  useEffect(() => {
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Maroc'
  }, [])

  return (
    <main
      className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      style={{ backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }}
    >
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── Section 1 — Hero ──────────────────────────────────────────── */}
      <section className="min-h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--c-grid-line)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--c-hero-glow)' }} />

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs uppercase tracking-[0.3em] mb-4 block"
          style={{ fontFamily: FONT_EU, color: 'var(--c-silver)' }}
        >
          PRYM Executive Transport — Maroc
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-light uppercase tracking-[0.2em] text-4xl md:text-6xl text-[var(--c-text)]"
          style={{ fontFamily: FONT_EU, lineHeight: 1.1 }}
        >
          Le temps<br />à sa valeur.
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-px my-8"
          style={{ backgroundColor: 'var(--c-silver3)', transformOrigin: 'left' }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="max-w-sm"
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
        >
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.78 }}
        >
          <button
            className="mt-12 px-10 py-4 border font-light uppercase tracking-[0.2em] text-sm transition-all hover:bg-[var(--c-text)] hover:text-[var(--c-bg)] inline-flex justify-center items-center"
            style={{ borderColor: 'var(--c-silver3)', color: 'var(--c-text)', fontFamily: FONT_EU }}
            onClick={() => window.location.href = '/reserver'}
          >
            RÉSERVER MAINTENANT
          </button>
        </motion.div>

        {/* Scroll pulse */}
        <div className="absolute bottom-10 left-8 md:left-24 flex flex-col items-center gap-3">
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            style={{ width: 1, height: 48, transformOrigin: 'top', background: 'var(--c-silver3)' }}
          />
          <span style={{ fontFamily: FONT_EU, fontSize: 7, color: 'var(--c-silver3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Scroll
          </span>
        </div>
      </section>

      {/* ── Section 2 — Vision ────────────────────────────────────────── */}
      <section className="min-h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--c-grid-line)' }} />

        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] mb-4 block"
          style={{ fontFamily: FONT_EU, color: 'var(--c-silver)' }}
        >
          Notre vision
        </motion.span>

        <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />

        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-light uppercase tracking-[0.2em] text-4xl md:text-6xl text-[var(--c-text)] max-w-4xl"
          style={{ fontFamily: FONT_EU, lineHeight: 1.15 }}
        >
          "Chaque<br />déplacement est<br />une déclaration."
        </motion.h2>

        <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="max-w-md"
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
        >
          PRYM ne propose pas un simple trajet. Nous orchestrons chaque
          déplacement comme une expérience — silencieuse, impeccable,
          à la hauteur de vos exigences.
        </motion.p>
      </section>

      {/* ── Section 3 — Pillars ───────────────────────────────────────── */}
      <section className="min-h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--c-grid-line)' }} />

        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.3em] mb-4 block"
          style={{ fontFamily: FONT_EU, color: 'var(--c-silver)' }}
        >
          Les fondements
        </motion.span>

        <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl">
          {PILLARS.map(({ number, title, body }, i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.4em', color: 'var(--c-silver3)' }}
              >
                {number}
              </span>
              <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />
              <h3
                className="font-light uppercase tracking-[0.2em] text-[var(--c-text)] mb-5"
                style={{ fontFamily: FONT_EU, fontSize: 'clamp(16px,1.8vw,22px)', letterSpacing: '0.2em', lineHeight: 1.2 }}
              >
                {title}
              </h3>
              <p
                style={{ fontFamily: FONT_SE, fontSize: 'clamp(12px,1.05vw,14px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 4 — Fleet Showcase ────────────────────────────────── */}
      <section className="min-h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative overflow-hidden">

        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--c-grid-line)' }} />

        {/* Text — left column */}
        <div className="relative z-10 w-full md:w-1/2">

          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs uppercase tracking-[0.3em] mb-4 block"
            style={{ fontFamily: FONT_EU, color: 'var(--c-silver)' }}
          >
            PRYM Signature — Tier III
          </motion.span>

          <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-light uppercase tracking-[0.2em] text-4xl md:text-6xl text-[var(--c-text)]"
            style={{ fontFamily: FONT_EU, lineHeight: 1.1 }}
          >
            L'objet<br />de désir.
          </motion.h2>

          <div className="w-12 h-px my-8" style={{ backgroundColor: 'var(--c-silver3)' }} />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-xs mb-10"
            style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.1vw,15px)', lineHeight: 1.9, color: 'var(--c-silver2)' }}
          >
            La Mercedes Classe S. Le summum du raffinement,
            mis à votre service dans chaque déplacement.
          </motion.p>

          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.38 }}
            href="/flotte"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textDecoration: 'none', color: 'var(--c-silver2)', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 10 }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-silver2)' }}
          >
            Explorer toute la flotte &nbsp;→
          </motion.a>
        </div>

        {/* 3D model — right side */}
        <div className="absolute right-[-20%] md:right-[-5%] top-1/2 -translate-y-1/2 w-[120%] md:w-[60%] h-[400px] md:h-[600px] z-0 pointer-events-none">
          <ModelErrorBoundary fallback={<div style={{ width: '100%', height: '100%' }} />}>
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [10, 3, 12], fov: 35 }}
                className="w-full h-full"
                gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={1.4} />
                <directionalLight position={[10, 10, 5]} intensity={2} />
                <directionalLight position={[-6, 8, -4]} intensity={1.0} color="#e8f0ff" />
                <directionalLight position={[0, -4, 6]} intensity={0.5} color="#fff5e8" />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.18} scale={20} blur={3} far={8} color="#4a4a48" />
                <Environment preset="city" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                  maxPolarAngle={Math.PI / 2}
                />
                {/* Inner boundary: R3F uses its own reconciler root — errors
                    thrown inside Canvas never reach the outer boundary above. */}
                <ModelErrorBoundary fallback={
                  <Html center>
                    <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', color: 'var(--c-silver3)', textTransform: 'uppercase' }}>
                      Visuel Indisponible
                    </span>
                  </Html>
                }>
                  <Suspense fallback={
                    <Html center>
                      <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', color: 'var(--c-silver3)', textTransform: 'uppercase' }}>
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

        {/* Footer */}
        <div
          className="absolute left-8 md:left-24 right-8 md:right-24 pt-5 flex justify-between flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--c-border)', bottom: 'clamp(20px,3vh,32px)' }}
        >
          <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em', color: 'var(--c-silver2)', textTransform: 'uppercase', margin: 0 }}>
            PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Maroc
          </p>
          <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', color: 'var(--c-silver2)', textTransform: 'uppercase', margin: 0 }}>
            prym.ma
          </p>
        </div>
      </section>

    </main>
  )
}
