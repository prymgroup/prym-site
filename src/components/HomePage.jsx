import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import DesktopNav from './DesktopNav'
import MobileNavbar from './MobileNavbar'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const MODEL_PATH = '/models/signature_mercedes.glb'

/* ── useIsMobile ─────────────────────────────────────────────────────────────── */
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

/* ── 3D model ────────────────────────────────────────────────────────────────── */
useGLTF.preload(MODEL_PATH)


function SignatureModel({ modelScale = [3, 3, 3], initialRotationY = -Math.PI / 3 }) {
  const { scene } = useGLTF(MODEL_PATH)
  const ref   = useRef()
  const clone = scene.clone(true)

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.set(...modelScale)
    const box    = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    ref.current.position.x = -center.x
    ref.current.position.y = -box.min.y
    ref.current.position.z = -center.z
    ref.current.rotation.y = initialRotationY
  }, [])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06
  })

  return <group ref={ref}><primitive object={clone} /></group>
}


/* ── Page ────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const isMobile = useIsMobile()

  useEffect(() => {
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Maroc'
  }, [])

  return (
    /* Action 1 */
    <div className="bg-[#FDFBF7] dark:bg-black w-full h-screen overflow-y-scroll snap-y snap-mandatory">

      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── Action 2 — Hero ───────────────────────────────────────────────────── */}
      <section className="h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative">

        {/* eyebrow */}
        <span
          className="text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-4 block"
          style={{ fontFamily: FONT_EU }}
        >
          PRYM Executive Transport — Maroc
        </span>

        {/* H2 — primary */}
        <h2
          className="!text-stone-900 dark:!text-white text-5xl md:text-7xl font-light uppercase tracking-[0.08em]"
          style={{ fontFamily: FONT_EU, lineHeight: 1.05 }}
        >
          LE MOUVEMENT,<br />ÉLEVÉ AU RANG<br />D'ART.
        </h2>

        {/* separator */}
        <div className="w-12 h-px bg-stone-300 dark:bg-stone-700 my-6" />

        {/* subtitle — secondary */}
        <p
          className="text-stone-500 dark:text-stone-400 max-w-md"
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.2vw,16px)', lineHeight: 1.9 }}
        >
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-6 mt-8 relative z-10">
          <button
            className="!px-8 !py-4 border border-stone-400 dark:border-stone-600 !text-stone-900 dark:!text-white uppercase tracking-widest text-sm hover:!bg-stone-900 hover:!text-white dark:hover:!bg-white dark:hover:!text-black transition-colors"
            onClick={() => window.location.href = '/reserver'}
          >
            RÉSERVER
          </button>
          <a
            href="/flotte"
            className="text-sm uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition-colors"
          >
            LA FLOTTE →
          </a>
        </div>

        {/* scroll pulse */}
        <div className="absolute bottom-10 left-8 md:left-24 flex flex-col items-center gap-2">
          <motion.div
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
            className="bg-gray-400 dark:bg-gray-600"
            style={{ width: 1, height: 40, transformOrigin: 'top' }}
          />
          <span
            className="text-gray-400 dark:text-gray-600 uppercase tracking-widest"
            style={{ fontFamily: FONT_EU, fontSize: 7 }}
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
            className="text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 mb-4 block"
            style={{ fontFamily: FONT_EU }}
          >
            PRYM Signature — Tier III
          </span>

          {/* separator above heading */}
          <div className="w-12 h-px bg-stone-300 dark:bg-stone-700 mb-6" />

          <h2
            className="text-stone-900 dark:text-white font-light uppercase tracking-[0.08em]"
            style={{
              fontFamily: FONT_EU,
              fontSize: 'clamp(28px,4vw,52px)',
              lineHeight: 1.18,
            }}
          >
            L'objet<br />de désir.
          </h2>

          <p
            className="text-gray-500 dark:text-gray-400 mt-5"
            style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.1vw,15px)', lineHeight: 1.9 }}
          >
            La Mercedes Classe S. Le summum du raffinement,<br />
            mis à votre service dans chaque déplacement.
          </p>

          <a
            href="/flotte"
            className="mt-8 inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textDecoration: 'none' }}
          >
            Explorer toute la flotte &nbsp;→
          </a>
        </div>

        {/* 3D car — Suspense outside Canvas so R3F mount is always valid */}
        <div className="absolute right-0 md:right-[-5%] top-1/2 -translate-y-1/2 w-full md:w-[60%] h-[500px] z-0 pointer-events-none">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 1.5, 6], fov: 35 }}
              gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
              className="w-full h-full"
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} />
              <directionalLight position={[-6, 8, -4]} intensity={1.0} color="#e8f0ff" />
              <directionalLight position={[0, -4, 6]} intensity={0.5} color="#fff5e8" />
              <ContactShadows position={[0, -0.01, 0]} opacity={0.2} scale={20} blur={3} far={8} />
              <Environment preset="city" />
              <SignatureModel modelScale={[4, 4, 4]} initialRotationY={-0.5} />
            </Canvas>
          </Suspense>
        </div>
      </section>

      {/* ── Action 4 — Closing ────────────────────────────────────────────────── */}
      <section className="h-screen w-full snap-start flex flex-col justify-center px-8 md:px-24 relative">

        {/* rule */}
        <div className="w-12 h-px bg-gray-300 dark:bg-gray-700 mb-12" />

        {/* H2 — primary */}
        <h2
          className="text-gray-900 dark:text-white"
          style={{
            fontFamily: FONT_EU, fontWeight: 300,
            fontSize: 'clamp(22px,3.5vw,44px)',
            letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.25,
          }}
        >
          Découvrez notre<br />définition du temps.
        </h2>

        {/* CTA */}
        <a
          href="/experience"
          className="mt-12 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center uppercase tracking-widest"
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textDecoration: 'none', gap: 14 }}
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
          className="absolute left-8 md:left-24 right-8 md:right-24 border-t border-gray-200 dark:border-gray-800 pt-5 flex justify-between flex-wrap gap-2"
          style={{ bottom: 'clamp(20px,3vh,32px)' }}
        >
          <p
            className="text-gray-500 dark:text-gray-400 m-0 uppercase tracking-widest"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em' }}
          >
            PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Maroc
          </p>
          <p
            className="text-gray-500 dark:text-gray-400 m-0 uppercase tracking-widest"
            style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em' }}
          >
            prym.ma
          </p>
        </div>
      </section>

    </div>
  )
}
