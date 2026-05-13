import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import DesktopNav from './DesktopNav'
import MobileNavbar from './MobileNavbar'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'

/* ── Semantic aliases — light ↔ dark adaptive ───────────────────────────────
   silver3 (#B0AA9F / #3c3c3b) is borders/lines only — never use for text.
   Text hierarchy:
     primary  → var(--c-text)    #1A1A1A / #f6f6f6
     heading  → var(--c-silver)  #6B6867 / #c6c6c6  (de-emphasised titles)
     body     → var(--c-silver)  #6B6867 / #c6c6c6
     label    → var(--c-silver2) #9E9890 / #706f6f  (eyebrows, captions)
     muted    → var(--c-silver3) #B0AA9F / #3c3c3b  (borders, lines ONLY)
*/
const C = {
  bg:      'var(--c-bg)',
  text:    'var(--c-text)',    // primary — full contrast in both modes
  silver:  'var(--c-silver)',  // body / headings — good in both modes
  silver2: 'var(--c-silver2)', // labels / eyebrows — readable in both modes
  silver3: 'var(--c-silver3)', // borders / decorative lines only
}

const GX  = 'clamp(24px,6vw,80px)'
const GXM = 'clamp(24px,5vw,40px)'

// Strict snap section — all three sections share this
const SNAP = {
  height: '100vh',
  width: '100%',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
  position: 'relative',
  overflow: 'hidden',
}

// Clears the fixed navbar
const NAV_PAD = 'clamp(64px,10vh,80px)'

/* ── Hooks ─────────────────────────────────────────────────────────────────── */
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

/* ── 3D Signature ──────────────────────────────────────────────────────────── */
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
      <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', color: C.silver2 }}>
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

/* ── 1. Hero — LE MOUVEMENT ────────────────────────────────────────────────── */
function HeroSection({ isMobile }) {
  return (
    <section style={{
      ...SNAP,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop:    NAV_PAD,
      paddingLeft:   isMobile ? GXM : GX,
      paddingRight:  isMobile ? GXM : GX,
      paddingBottom: 'clamp(40px,6vh,60px)',
    }}>
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--c-canvas-grad)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--c-panel-grad)', opacity: 0.55 }} />
      </div>

      {/* Text block */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 980 }}>
        {/* Action 1 — eyebrow uses silver2 (not silver3) for light-mode legibility */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', color: C.silver2, marginBottom: isMobile ? 20 : 28 }}>
          PRYM Executive Transport — Maroc
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)',  y: 0  }}
          transition={{ delay: 0.5, duration: 2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONT_EU, fontWeight: 300,
            fontSize: isMobile ? 'clamp(34px,10vw,54px)' : 'clamp(52px,7.5vw,116px)',
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: C.text, lineHeight: 0.92,
            marginBottom: isMobile ? 24 : 40,
          }}>
          Le mouvement,<br />
          {/* Action 1 — "élevé au rang" uses silver for visible de-emphasis in light */}
          <span style={{ color: C.silver }}>élevé au rang</span><br />
          d'art.
        </motion.h1>

        {/* Action 1 — body subtitle upgraded to silver for better light-mode contrast */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.3vw,16px)', color: C.silver, lineHeight: 1.9, maxWidth: 420, marginBottom: isMobile ? 44 : 60 }}>
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={{ display: 'flex', gap: isMobile ? 24 : 40, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Action 2 — ghost button: border uses silver (visible in both modes),
              hover fills with pill-bg, text stays var(--c-text) for full contrast */}
          <a href="/reserver"
            style={{
              fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: C.text, textDecoration: 'none',
              border: '1px solid var(--c-silver)',
              padding: isMobile ? '13px 32px' : '18px 56px',
              transition: 'all 0.4s ease', display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-silver2)'; e.currentTarget.style.background = 'var(--c-pill-bg)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-silver)'; e.currentTarget.style.background = 'transparent' }}>
            Réserver
          </a>

          {/* Action 1 — secondary link uses silver2 default → text on hover */}
          <a href="/flotte"
            style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase', color: C.silver2, textDecoration: 'none', transition: 'color 0.35s ease' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--c-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--c-silver2)'}>
            La flotte &nbsp;→
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator — silver2 gradient for legibility */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        style={{ position: 'absolute', bottom: isMobile ? 28 : 40, left: isMobile ? GXM : GX, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          style={{ width: 1, height: 40, background: 'linear-gradient(180deg, transparent, var(--c-silver2))', transformOrigin: 'top' }} />
        <span style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.silver2 }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

/* ── 2. Flotte — L'OBJET DE DÉSIR ─────────────────────────────────────────── */
function SectionFlotte({ isMobile }) {
  return (
    /* Action 3 — strict 100vh snap section; desktop: 12-col grid; mobile: flex-col */
    <section style={{
      ...SNAP,
      background: C.bg,
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : 'repeat(12, 1fr)',
      alignItems: isMobile ? 'stretch' : 'center',
    }}>

      {/* Text — col 1–4 (desktop) / fixed-height block (mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          gridColumn: isMobile ? undefined : '1 / 5',
          flexShrink: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: isMobile
            ? `${NAV_PAD} ${GXM} 28px`
            : `clamp(64px,8vw,100px) 0 clamp(64px,8vw,100px) ${GX}`,
        }}>
        {/* Action 1 — eyebrow upgraded to silver2 */}
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.silver2, marginBottom: 20 }}>
          PRYM Signature — Tier III
        </p>
        <h2 style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: isMobile ? 'clamp(28px,9vw,48px)' : 'clamp(28px,3.8vw,52px)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          color: C.text, lineHeight: 0.97, marginBottom: 28,
        }}>
          L'objet<br />de désir.
        </h2>
        {/* Action 1 — body upgraded to silver */}
        <p style={{ fontFamily: FONT_SE, fontSize: 'clamp(13px,1.2vw,15px)', color: C.silver, lineHeight: 1.9, maxWidth: 300, marginBottom: 40 }}>
          La Mercedes Classe S. Le summum du raffinement, mis à votre service dans chaque déplacement.
        </p>
        {/* Action 1 — CTA link: silver2 default → text on hover */}
        <a href="/flotte"
          style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.silver2, textDecoration: 'none', transition: 'color 0.35s ease', display: 'inline-flex', alignItems: 'center', gap: 10 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--c-text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--c-silver2)'}>
          Explorer toute la flotte &nbsp;→
        </a>
      </motion.div>

      {/* Action 3 — 3D gets its own dedicated space: col 5–12 (desktop) / flex:1 fill (mobile) */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.6, delay: 0.2 }}
        style={{
          gridColumn: isMobile ? undefined : '5 / 13',
          flex: isMobile ? '1 1 0' : undefined,
          width:     isMobile ? '100%' : undefined,
          height:    isMobile ? undefined : '100vh',
          minHeight: isMobile ? 220 : 520,
        }}>
        <Suspense fallback={null}>
          <SignatureScene isMobile={isMobile} />
        </Suspense>
      </motion.div>
    </section>
  )
}

/* ── 3. Closing — DÉCOUVREZ NOTRE DÉFINITION ───────────────────────────────── */
function SectionClosing({ isMobile }) {
  return (
    <section style={{
      ...SNAP,
      background: C.bg,
      borderTop: '1px solid var(--c-border)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop:    NAV_PAD,
      paddingLeft:   isMobile ? GXM : GX,
      paddingRight:  isMobile ? GXM : GX,
      paddingBottom: 'clamp(32px,5vh,48px)',
    }}>

      <motion.div
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 720 }}>
        {/* Thin rule */}
        <div style={{ width: 48, height: 1, background: 'var(--c-silver3)', marginBottom: 48 }} />

        {/* Action 1 — statement uses silver (good contrast both modes) */}
        <p style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: isMobile ? 'clamp(22px,7vw,36px)' : 'clamp(28px,3.2vw,44px)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: C.silver, lineHeight: 1.25, marginBottom: 56,
        }}>
          Découvrez notre<br />définition du temps.
        </p>

        {/* Action 1 — CTA link: silver2 default → text on hover */}
        <a href="/experience"
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.silver2, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 14, transition: 'color 0.35s ease' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--c-text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--c-silver2)'}>
          L'expérience PRYM
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-block' }}>
            →
          </motion.span>
        </a>
      </motion.div>

      {/* Footer line — pinned to bottom of section */}
      {/* Action 1 — footer text upgraded from silver3 to silver2 */}
      <div style={{
        position: 'absolute', bottom: 'clamp(20px,3vh,32px)',
        left: isMobile ? GXM : GX, right: isMobile ? GXM : GX,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
        borderTop: '1px solid var(--c-border)', paddingTop: 20,
      }}>
        <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.silver2, margin: 0 }}>
          PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Maroc
        </p>
        <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.silver2, margin: 0 }}>
          prym.ma
        </p>
      </div>
    </section>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const isMobile = useIsMobile()

  useEffect(() => {
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Maroc'
  }, [])

  return (
    /* Action 3 — self-contained snap container */
    <div style={{
      background: C.bg, color: C.text,
      height: '100vh', overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>
      {/* Action 4 — DesktopNav/MobileNavbar both use var(--c-text) for links */}
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <HeroSection    isMobile={isMobile} />
      <SectionFlotte  isMobile={isMobile} />
      <SectionClosing isMobile={isMobile} />
    </div>
  )
}
