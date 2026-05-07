import { useEffect, useRef, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Lenis from 'lenis'
import DesktopNav from './DesktopNav'
import MobileNavbar from './MobileNavbar'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg: '#000000',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}
const GX = 'clamp(24px,6vw,80px)'   // horizontal gutter — desktop
const GXM = 'clamp(24px,5vw,40px)'  // horizontal gutter — mobile

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

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    let raf
    const loop = time => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); lenis.destroy() }
  }, [])
}

/* ── 3D Signature ──────────────────────────────────────────────────────────── */
const SIGNATURE_PATH = '/models/signature_mercedes.glb'
useGLTF.preload(SIGNATURE_PATH)

function SignatureModel() {
  const { scene } = useGLTF(SIGNATURE_PATH)
  const ref = useRef()
  const clone = scene.clone(true)

  useEffect(() => {
    if (!ref.current) return
    const box  = new THREE.Box3().setFromObject(ref.current)
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
      <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', color: 'rgba(198,198,198,0.25)' }}>
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

/* ── 1. Hero ───────────────────────────────────────────────────────────────── */
/* Centrage vertical parfait — flex-col + justify-center                        */
function HeroSection({ isMobile }) {
  return (
    <section style={{
      minHeight: '100vh',
      background: C.bg,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',        /* ← centrage vertical                 */
      paddingTop: 64,                  /* ← espace sous la nav fixe           */
      paddingLeft:  isMobile ? GXM : GX,
      paddingRight: isMobile ? GXM : GX,
      paddingBottom: isMobile ? 'clamp(40px,6vh,60px)' : 'clamp(40px,6vh,60px)',
      overflow: 'hidden',
    }}>

      {/* ── Video placeholder ────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        {/* Remplace ce div par <video autoPlay muted loop playsInline style={{…, opacity:0.2}} /> */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 65% 35%, #161618 0%, #000 68%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0d0d10 0%, #000 55%)', opacity: 0.85 }} />
        <span style={{
          position: 'absolute', bottom: 20, right: isMobile ? 20 : 40,
          fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(60,60,59,0.4)',
        }}>
          Video background — 1920×1080 — opacity 20%
        </span>
      </div>

      {/* ── Text block ───────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 980 }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.48em', textTransform: 'uppercase', color: C.silver3, marginBottom: isMobile ? 20 : 28 }}>
          PRYM Executive Transport — Casablanca
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: FONT_EU, fontWeight: 300,
            fontSize: isMobile ? 'clamp(34px,10vw,54px)' : 'clamp(52px,7.5vw,116px)',
            letterSpacing: '-0.01em', textTransform: 'uppercase',
            color: C.white, lineHeight: 0.92,
            marginBottom: isMobile ? 24 : 40,
          }}>
          Le mouvement,<br />
          <span style={{ color: C.silver }}>élevé au rang</span><br />
          d'art.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          style={{
            fontFamily: FONT_SE, fontStyle: 'italic',
            fontSize: 'clamp(13px,1.3vw,16px)', color: C.silver2,
            lineHeight: 1.9, maxWidth: 420,
            marginBottom: isMobile ? 44 : 60,
          }}>
          Service de chauffeur privé ultra-premium au Maroc.<br />
          Discrétion absolue. Ponctualité chirurgicale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          style={{ display: 'flex', gap: isMobile ? 24 : 40, alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Réserver — poids visuel renforcé sur desktop */}
          <a href="/reserver" data-cursor="hover"
            style={{
              fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: C.white, textDecoration: 'none',
              border: `1px solid ${C.silver3}`,
              padding: isMobile ? '13px 32px' : '18px 56px',  /* ← plus grand desktop */
              transition: 'all 0.4s ease', display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.silver; e.currentTarget.style.background = 'rgba(198,198,198,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.silver3; e.currentTarget.style.background = 'transparent' }}>
            Réserver
          </a>

          {/* La Flotte — discret */}
          <a href="/flotte"
            style={{
              fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: C.silver3, textDecoration: 'none', transition: 'color 0.35s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.silver}
            onMouseLeave={e => e.currentTarget.style.color = C.silver3}>
            La flotte &nbsp;→
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1.2 }}
        style={{
          position: 'absolute', bottom: isMobile ? 28 : 40,
          left: isMobile ? GXM : GX,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 }}
          style={{ width: 1, height: 40, background: `linear-gradient(180deg, transparent, ${C.silver3})`, transformOrigin: 'top' }} />
        <span style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.32em', textTransform: 'uppercase', color: C.silver3 }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}

/* ── 2. Section Flotte ─────────────────────────────────────────────────────── */
/* Desktop : items-center sur la grille — voiture alignée au centre du texte   */
/* Mobile  : 3D pleine largeur + hauteur imposante                             */
function SectionFlotte({ isMobile }) {
  return (
    <section style={{
      background: C.bg,
      minHeight: isMobile ? 'auto' : '100vh',
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : 'repeat(12, 1fr)',
      alignItems: 'center',            /* ← centre vertical texte ↔ voiture   */
    }}>

      {/* Texte gauche — col 1–4 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          gridColumn: isMobile ? undefined : '1 / 5',
          padding: isMobile
            ? `clamp(80px,12vw,120px) ${GXM} 40px`
            : `clamp(80px,10vw,140px) 0 clamp(80px,10vw,140px) ${GX}`,
        }}>
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.silver3, marginBottom: 20 }}>
          PRYM Signature — Tier III
        </p>
        <h2 style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: isMobile ? 'clamp(28px,9vw,48px)' : 'clamp(28px,3.8vw,52px)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          color: C.white, lineHeight: 0.97, marginBottom: 28,
        }}>
          L'objet<br />de désir.
        </h2>
        <p style={{
          fontFamily: FONT_SE, fontStyle: 'italic',
          fontSize: 'clamp(13px,1.2vw,15px)', color: C.silver2,
          lineHeight: 1.9, maxWidth: 300, marginBottom: 44,
        }}>
          La Mercedes Classe S. Le summum du raffinement, mis à votre service dans chaque déplacement.
        </p>
        <a href="/flotte"
          style={{
            fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: C.silver3, textDecoration: 'none', transition: 'color 0.35s ease',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.silver}
          onMouseLeave={e => e.currentTarget.style.color = C.silver3}>
          Explorer toute la flotte &nbsp;→
        </a>
      </motion.div>

      {/* 3D droite — col 5–12 / mobile pleine largeur imposante */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.6, delay: 0.2 }}
        style={{
          gridColumn: isMobile ? undefined : '5 / 13',
          /* Mobile : 100vw pleine largeur, hauteur proche du carré            */
          width:     isMobile ? '100vw'  : undefined,
          height:    isMobile ? '85vw'   : '100vh',
          minHeight: isMobile ? 320      : 520,
        }}>
        <Suspense fallback={null}>
          <SignatureScene isMobile={isMobile} />
        </Suspense>
      </motion.div>
    </section>
  )
}

/* ── 3. Section Expérience ─────────────────────────────────────────────────── */
/* Desktop : grille 12 col — image col 1–8 (h-[70vh]) | texte col 9–12        */
/* Mobile  : empilé — image h-[40vh] + texte                                  */
/* + marge supérieure massive pour le "chapitrage" du scroll                   */
function SectionExperience({ isMobile }) {
  return (
    <section style={{
      background: C.bg,
      /* ── Respiration massive avant cette section ── */
      marginTop: isMobile ? 'clamp(80px,14vw,120px)' : 'clamp(160px,18vw,240px)',
      /* Pas de padding horizontal sur le wrapper desktop (image bord-à-bord)  */
      paddingLeft:  isMobile ? GXM : 0,
      paddingRight: isMobile ? GXM : 0,
      paddingBottom: isMobile ? 'clamp(80px,12vw,120px)' : 'clamp(120px,14vw,180px)',
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : 'repeat(12, 1fr)',
      alignItems: 'center',
    }}>

      {/* Image / texture — mobile full-w, desktop col 1–8 */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : -24 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }} transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          gridColumn: isMobile ? undefined : '1 / 9',
          /* Mobile h-[40vh] — Desktop h-[70vh]                               */
          height: isMobile ? '40vh' : '70vh',
          minHeight: isMobile ? 220 : 480,
          background: 'linear-gradient(135deg, #0e0e10 0%, #13131a 45%, #0a0a0c 100%)',
          position: 'relative', overflow: 'hidden',
          marginBottom: isMobile ? 48 : 0,
          flexShrink: 0,
        }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 25% 65%, #1c1c24 0%, transparent 65%), radial-gradient(ellipse at 80% 20%, #141418 0%, transparent 50%)',
        }} />
        <span style={{
          position: 'absolute', bottom: isMobile ? 16 : 24, left: isMobile ? 16 : 24,
          fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em',
          textTransform: 'uppercase', color: 'rgba(198,198,198,0.18)',
        }}>
          Intérieur cuir nappa — PRYM Signature
        </span>
        {/* Remplace ce div par <img src="…" alt="…" style={{objectFit:'cover',…}} /> */}
      </motion.div>

      {/* Texte — mobile sous l'image, desktop col 9–12 centré verticalement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{
          gridColumn: isMobile ? undefined : '9 / 13',
          /* Padding texte desktop : espace intérieur gauche + gutter droit    */
          padding: isMobile ? 0 : `0 ${GX} 0 clamp(40px,4vw,64px)`,
          alignSelf: 'center',
        }}>
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.silver3, marginBottom: 20 }}>
          L'expérience
        </p>
        <h2 style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: isMobile ? 'clamp(24px,8vw,44px)' : 'clamp(22px,2.8vw,40px)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          color: C.white, lineHeight: 1.05, marginBottom: 24,
        }}>
          L'hospitalité<br />marocaine,<br />
          la précision<br />chirurgicale.
        </h2>
        <p style={{
          fontFamily: FONT_SE, fontStyle: 'italic',
          fontSize: 'clamp(12px,1.1vw,14px)', color: C.silver2,
          lineHeight: 1.9, marginBottom: 36,
        }}>
          Chaque trajet est une cérémonie. Un protocole d'accueil, des attentions invisibles, une présence qui ne s'impose jamais.
        </p>
        <a href="/experience"
          style={{
            fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: C.silver3, textDecoration: 'none', transition: 'color 0.35s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.silver}
          onMouseLeave={e => e.currentTarget.style.color = C.silver3}>
          Découvrir l'expérience &nbsp;→
        </a>
      </motion.div>
    </section>
  )
}

/* ── 4. Section B2B ────────────────────────────────────────────────────────── */
/* Typographique pur + marge supérieure massive (chapitrage)                   */
function SectionB2B({ isMobile }) {
  return (
    <section style={{
      background: C.bg,
      /* ── Respiration massive avant cette section ── */
      marginTop: isMobile ? 'clamp(80px,14vw,120px)' : 'clamp(160px,18vw,240px)',
      paddingLeft:  isMobile ? GXM : GX,
      paddingRight: isMobile ? GXM : GX,
      paddingBottom: isMobile ? 'clamp(80px,12vw,120px)' : 'clamp(120px,14vw,180px)',
      borderTop: `1px solid ${C.silver3}18`,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ paddingTop: isMobile ? 'clamp(60px,10vw,80px)' : 'clamp(80px,10vw,120px)' }}>
        <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: C.silver3, marginBottom: 20 }}>
          Comptes Entreprises
        </p>
        <h2 style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: isMobile ? 'clamp(28px,9vw,52px)' : 'clamp(40px,5.5vw,84px)',
          letterSpacing: '0.02em', textTransform: 'uppercase',
          color: C.white, lineHeight: 0.93,
          marginBottom: 36, maxWidth: 900,
        }}>
          Vos exigences,<br />
          notre standard.
        </h2>
        <p style={{
          fontFamily: FONT_SE, fontStyle: 'italic',
          fontSize: 'clamp(13px,1.3vw,16px)', color: C.silver2,
          lineHeight: 1.9, maxWidth: 480, marginBottom: 56,
        }}>
          Chauffeur attitré, facturation mensuelle, NDA étendu. Un service conçu pour les organisations qui n'acceptent pas le compromis.
        </p>
        <div style={{ display: 'flex', gap: isMobile ? 20 : 36, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/entreprises" data-cursor="hover"
            style={{
              fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: C.white, textDecoration: 'none',
              border: `1px solid ${C.silver3}`,
              padding: isMobile ? '13px 32px' : '18px 56px',  /* ← poids desktop */
              transition: 'all 0.4s ease', display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.silver; e.currentTarget.style.background = 'rgba(198,198,198,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.silver3; e.currentTarget.style.background = 'transparent' }}>
            Ouvrir un compte
          </a>
          <a href="/entreprises"
            style={{
              fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: C.silver3, textDecoration: 'none', transition: 'color 0.35s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = C.silver}
            onMouseLeave={e => e.currentTarget.style.color = C.silver3}>
            En savoir plus &nbsp;→
          </a>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
function PageFooter() {
  return (
    <footer style={{
      background: C.bg,
      padding: `32px ${GX}`,
      borderTop: `1px solid ${C.silver3}18`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 12,
    }}>
      <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.38em', textTransform: 'uppercase', color: C.silver3, margin: 0 }}>
        PRYM Executive Transport &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; Casablanca
      </p>
      <p style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.silver3, margin: 0 }}>
        prym.ma
      </p>
    </footer>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  useLenis()
  const isMobile = useIsMobile()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'PRYM Executive Transport — Chauffeur Privé Luxe Casablanca'
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white, overflowX: 'hidden' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <HeroSection       isMobile={isMobile} />
      <SectionFlotte     isMobile={isMobile} />
      <SectionExperience isMobile={isMobile} />
      <SectionB2B        isMobile={isMobile} />
      <PageFooter />
    </div>
  )
}
