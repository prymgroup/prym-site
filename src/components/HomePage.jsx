import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import DesktopNav from './DesktopNav'
import MobileNavbar from './MobileNavbar'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const GX  = 'clamp(24px,6vw,80px)'
const GXM = 'clamp(24px,5vw,40px)'
const NAV_PAD = 'clamp(64px,10vh,80px)'

/* ── Hook ───────────────────────────────────────────────────────────────────── */
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

/* ── 3D Signature ───────────────────────────────────────────────────────────── */
const SIGNATURE_PATH = '/models/signature_mercedes.glb'
useGLTF.preload(SIGNATURE_PATH)

function SignatureModel() {
  const { scene } = useGLTF(SIGNATURE_PATH)
  const ref   = useRef()
  const clone = scene.clone(true)

  useEffect(() => {
    if (!ref.current) return
    const box    = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    const size   = box.getSize(new THREE.Vector3())
    const scale  = 3.8 / Math.max(size.x, size.y, size.z)
    ref.current.scale.setScalar(scale)
    ref.current.position.x = -center.x * scale
    ref.current.position.y = -box.min.y * scale
    ref.current.position.z = -center.z * scale
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06
  })

  return <group ref={ref}><primitive object={clone} /></group>
}

function Scene3DLoader() {
  return (
    <Html center>
      <span className="text-stone-400 dark:text-stone-600" style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em' }}>
        CHARGEMENT
      </span>
    </Html>
  )
}

function SignatureScene({ isMobile }) {
  const orbitRef = useRef()
  useEffect(() => {
    requestAnimationFrame(() => {
      const ctrl = orbitRef.current
      if (!ctrl) return
      ctrl.object.position.set(3.5, 0.9, 5.5)
      ctrl.target.set(0, 0.6, 0)
      ctrl.update()
    })
  }, [])
  return (
    <Canvas
      shadows dpr={[1, 2]}
      camera={{ fov: isMobile ? 52 : 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <directionalLight position={[6, 8, -4]}  intensity={2.5} color="#fff5e8" castShadow />
      <directionalLight position={[-8, 4, 2]}  intensity={0.8} color="#e8f0ff" />
      <directionalLight position={[-1, 5, 6]}  intensity={1.8} color="#c8d8ff" />
      <ambientLight intensity={0.12} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.35} scale={20} blur={3} far={8} color="#000" />
      <Environment preset="studio" />
      <OrbitControls ref={orbitRef}
        enablePan={false} enableZoom={false}
        minPolarAngle={Math.PI * 0.1} maxPolarAngle={Math.PI * 0.55}
        dampingFactor={0.05} enableDamping />
      <Suspense fallback={<Scene3DLoader />}>
        <SignatureModel />
      </Suspense>
    </Canvas>
  )
}

/* ── Section 1 — Hero ───────────────────────────────────────────────────────── */
function HeroSection({ isMobile }) {
  return (
    <section
      className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden"
    >
      {/* bg */}
      <div className="absolute inset-0 bg-stone-50 dark:bg-neutral-950" />

      {/* content wrapper — full width with gutter padding */}
      <div
        className="relative z-10 w-full flex flex-col justify-center"
        style={{
          paddingTop:    NAV_PAD,
          paddingBottom: 'clamp(40px,6vh,60px)',
          paddingLeft:   isMobile ? GXM : GX,
          paddingRight:  isMobile ? GXM : GX,
          maxWidth: isMobile ? '100%' : 980,
        }}
      >
        {/* eyebrow — secondary */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-stone-600 dark:text-stone-400"
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', marginBottom: isMobile ? 20 : 28 }}
        >
          PRYM Executive Transport — Maroc
        </motion.p>

        {/* h1 — primary */}
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ delay: 0.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="text-stone-900 dark:text-white"
          style={{
            fontFamily: FONT_EU, fontWeight: 300,
            fontSize: isMobile ? 'clamp(34px,10vw,54px)' : 'clamp(52px,7.5vw,116px)',
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            lineHeight: 0.92, marginBottom: isMobile ? 24 : 40,
          }}
        >
          Le mouvement,<br />
          <span className="text-stone-600 dark:text-stone-400">élevé au rang</span><br />
          d'art.
        </motion.h1>

        {/* subtitle — secondary */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="text-stone-600 dark:text-stone-400"
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,16px)', lineHeight: 1.9, maxWidth: 420, marginBottom: isMobile ? 44 : 60 }}
        >
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="flex flex-wrap items-center"
          style={{ gap: isMobile ? 24 : 40 }}
        >
          {/* ghost button — Action 3 */}
          <a
            href="/reserver"
            className="border border-stone-400 text-stone-900 dark:border-stone-600 dark:text-white px-6 py-2 transition-colors hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black"
            style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Réserver
          </a>

          {/* secondary link */}
          <a
            href="/flotte"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            La flotte &nbsp;→
          </a>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        className="absolute flex flex-col items-center gap-2"
        style={{ bottom: isMobile ? 28 : 40, left: isMobile ? GXM : GX }}
      >
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          className="bg-stone-400 dark:bg-stone-600"
          style={{ width: 1, height: 40, transformOrigin: 'top' }}
        />
        <span
          className="text-stone-600 dark:text-stone-400"
          style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.32em', textTransform: 'uppercase' }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

/* ── Section 2 — Flotte (car gets its own h-screen space) ───────────────────── */
function SectionFlotte({ isMobile }) {
  return (
    <section className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-full h-full flex flex-col md:flex-row">

        {/* text — left column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex-shrink-0 flex flex-col justify-center md:w-[38%]"
          style={{
            padding: isMobile
              ? `${NAV_PAD} ${GXM} 24px`
              : `clamp(64px,8vw,100px) 0 clamp(64px,8vw,100px) ${GX}`,
          }}
        >
          {/* eyebrow */}
          <p
            className="text-stone-600 dark:text-stone-400"
            style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', marginBottom: 20 }}
          >
            PRYM Signature — Tier III
          </p>

          {/* h2 — primary */}
          <h2
            className="text-stone-900 dark:text-white"
            style={{
              fontFamily: FONT_EU, fontWeight: 300,
              fontSize: isMobile ? 'clamp(28px,9vw,48px)' : 'clamp(28px,3.8vw,52px)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              lineHeight: 0.97, marginBottom: 28,
            }}
          >
            L'objet<br />de désir.
          </h2>

          {/* body — secondary */}
          <p
            className="text-stone-600 dark:text-stone-400"
            style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.2vw,15px)', lineHeight: 1.9, maxWidth: 300, marginBottom: 40 }}
          >
            La Mercedes Classe S. Le summum du raffinement, mis à votre service dans chaque déplacement.
          </p>

          {/* cta link */}
          <a
            href="/flotte"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors inline-flex items-center gap-2"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Explorer toute la flotte &nbsp;→
          </a>
        </motion.div>

        {/* car — fills remaining height/width */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.6, delay: 0.2 }}
          className="flex-1 w-full"
          style={{ minHeight: isMobile ? 220 : 520, height: isMobile ? undefined : '100%' }}
        >
          <Suspense fallback={null}>
            <SignatureScene isMobile={isMobile} />
          </Suspense>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Section 3 — Closing ────────────────────────────────────────────────────── */
function SectionClosing({ isMobile }) {
  return (
    <section
      className="h-screen w-full snap-start snap-always flex flex-col justify-center items-center relative overflow-hidden border-t border-stone-200 dark:border-stone-800"
    >
      {/* bg */}
      <div className="absolute inset-0 bg-stone-50 dark:bg-neutral-950" />

      {/* content wrapper */}
      <div
        className="relative z-10 w-full flex flex-col justify-center"
        style={{
          paddingTop:    NAV_PAD,
          paddingBottom: 'clamp(32px,5vh,48px)',
          paddingLeft:   isMobile ? GXM : GX,
          paddingRight:  isMobile ? GXM : GX,
          maxWidth: 720,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* rule */}
          <div className="bg-stone-300 dark:bg-stone-700" style={{ width: 48, height: 1, marginBottom: 48 }} />

          {/* statement — secondary */}
          <p
            className="text-stone-600 dark:text-stone-400"
            style={{
              fontFamily: FONT_EU, fontWeight: 300,
              fontSize: isMobile ? 'clamp(22px,7vw,36px)' : 'clamp(28px,3.2vw,44px)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.25, marginBottom: 56,
            }}
          >
            Découvrez notre<br />définition du temps.
          </p>

          {/* cta link */}
          <a
            href="/experience"
            className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors inline-flex items-center"
            style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', textDecoration: 'none', gap: 14 }}
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
        </motion.div>
      </div>

      {/* footer line — pinned */}
      <div
        className="absolute border-t border-stone-200 dark:border-stone-800 flex justify-between items-center flex-wrap gap-2 w-full"
        style={{
          bottom:      'clamp(20px,3vh,32px)',
          paddingTop:  20,
          paddingLeft:  isMobile ? GXM : GX,
          paddingRight: isMobile ? GXM : GX,
        }}
      >
        <p
          className="text-stone-600 dark:text-stone-400 m-0"
          style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase' }}
        >
          PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Maroc
        </p>
        <p
          className="text-stone-600 dark:text-stone-400 m-0"
          style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase' }}
        >
          prym.ma
        </p>
      </div>
    </section>
  )
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const isMobile = useIsMobile()

  useEffect(() => {
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Maroc'
  }, [])

  return (
    <div
      className="h-screen overflow-y-scroll snap-y snap-mandatory bg-stone-50 dark:bg-neutral-950 text-stone-900 dark:text-white transition-colors"
    >
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <HeroSection    isMobile={isMobile} />
      <SectionFlotte  isMobile={isMobile} />
      <SectionClosing isMobile={isMobile} />
    </div>
  )
}
