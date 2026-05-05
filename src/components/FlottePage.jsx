import { useState, useEffect, Suspense, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { FLEET } from '../data/fleet'
import * as THREE from 'three'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = 'Georgia,"Times New Roman",serif'
const C = {
  bg: '#0a0a0a', bg2: '#0e0e0f',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}

// ── 3D Model ─────────────────────────────────────────────────────────────────
function VehicleModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()
  const clone = scene.clone(true)
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.1 })
  useEffect(() => {
    if (!ref.current) return
    const box = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const scale = 3.8 / Math.max(size.x, size.y, size.z)
    ref.current.scale.setScalar(scale)
    ref.current.position.x = -center.x * scale
    ref.current.position.y = -box.min.y * scale
    ref.current.position.z = -center.z * scale
  }, [path])
  return <group ref={ref}><primitive object={clone} /></group>
}

function Loader3D() {
  return (
    <Html center>
      <div style={{ color: 'rgba(198,198,198,0.3)', fontFamily: FONT_EU, fontSize: '9px', letterSpacing: '0.3em' }}>
        CHARGEMENT
      </div>
    </Html>
  )
}

function SceneContent({ modelPath }) {
  const { camera } = useThree()
  useEffect(() => { camera.position.set(-4.5, 2.2, 5.5); camera.lookAt(0, 0.8, 0) }, [])
  return (
    <>
      <directionalLight position={[6, 8, -4]} intensity={2.5} color="#fff5e8" castShadow />
      <directionalLight position={[-8, 4, 2]} intensity={0.8} color="#e8f0ff" />
      <directionalLight position={[-1, 5, 6]} intensity={1.8} color="#c8d8ff" />
      <ambientLight intensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={20} blur={2.5} far={8} color="#000" />
      <Environment preset="studio" />
      <Suspense fallback={<Loader3D />}>
        <VehicleModel path={modelPath} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10}
        minPolarAngle={Math.PI * 0.1} maxPolarAngle={Math.PI * 0.55}
        target={[0, 0.8, 0]} dampingFactor={0.05} enableDamping />
    </>
  )
}

function Scene3D({ modelPath }) {
  const [key, setKey] = useState(0)
  useEffect(() => { setKey(k => k + 1) }, [modelPath])
  return (
    <Canvas key={key} shadows dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      style={{ background: 'transparent' }} camera={{ fov: 45, near: 0.1, far: 100 }}>
      <Suspense fallback={<Loader3D />}>
        <SceneContent modelPath={modelPath} />
      </Suspense>
    </Canvas>
  )
}

// ── Preload ───────────────────────────────────────────────────────────────────
FLEET.forEach(t => { if (t.modelPath) useGLTF.preload(t.modelPath) })

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px clamp(24px,6vw,80px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.silver3}22`,
    }}>
      <a href="/" style={{ textDecoration: 'none' }}>
        <img src="/logos/logo-slogan-white.svg" alt="PRYM" style={{ height: 44, opacity: 0.9 }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
        <span style={{ display:'none', fontFamily:FONT_EU, fontSize:13, letterSpacing:'0.35em', textTransform:'uppercase', color:C.white, fontWeight:300 }}>PRYM</span>
      </a>
      <div style={{ display:'flex', gap:'clamp(16px,4vw,40px)', alignItems:'center' }}>
        {[['Expérience','/experience'],['Entreprises','/entreprises'],['À propos','/a-propos']].map(([l,h]) => (
          <a key={h} href={h} style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3, textDecoration:'none', transition:'color 0.2s' }}
            onMouseEnter={e=>e.target.style.color=C.silver} onMouseLeave={e=>e.target.style.color=C.silver3}>{l}</a>
        ))}
        <a href="/reserver" style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.bg, background:C.silver, padding:'10px 20px', textDecoration:'none', transition:'all 0.2s' }}
          onMouseEnter={e=>e.target.style.background=C.white} onMouseLeave={e=>e.target.style.background=C.silver}>
          Réserver
        </a>
      </div>
    </nav>
  )
}

// ── Tier pill selector ────────────────────────────────────────────────────────
function TierPill({ tier, active, onClick }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.97 }}
      style={{
        background: active ? 'rgba(198,198,198,0.1)' : 'transparent',
        border: `1px solid ${active ? C.silver3 : C.silver3+'44'}`,
        padding: '10px 20px', cursor: 'pointer',
        fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.25em',
        textTransform: 'uppercase', color: active ? C.silver : C.silver3,
        transition: 'all 0.25s', whiteSpace: 'nowrap',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor=C.silver3; e.currentTarget.style.color=C.silver2 }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor=C.silver3+'44'; e.currentTarget.style.color=C.silver3 }}}>
      {active && (
        <motion.div layoutId="pill-active"
          style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${C.silver},transparent)` }} />
      )}
      {tier.name.replace('PRYM ', '')}
    </motion.button>
  )
}

// ── No model placeholder ──────────────────────────────────────────────────────
function NoModelPlaceholder({ tier }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
        style={{ position:'relative', width:160, height:60 }}>
        {/* Stylized side silhouette */}
        <svg viewBox="0 0 200 80" fill="none" style={{ width:'100%', height:'100%', opacity:0.3 }}>
          {tier.id === 'suite' ? (
            // Sprinter shape
            <>
              <rect x="10" y="15" width="170" height="45" rx="4" stroke={C.silver} strokeWidth="1"/>
              <rect x="10" y="5" width="140" height="15" rx="2" stroke={C.silver} strokeWidth="0.8"/>
              <circle cx="45" cy="62" r="10" stroke={C.silver} strokeWidth="1"/>
              <circle cx="155" cy="62" r="10" stroke={C.silver} strokeWidth="1"/>
            </>
          ) : (
            // Van/MPV shape
            <>
              <path d="M10 55 L10 25 Q12 15 30 12 L150 12 Q175 12 185 25 L190 55 Z" stroke={C.silver} strokeWidth="1"/>
              <circle cx="45" cy="57" r="10" stroke={C.silver} strokeWidth="1"/>
              <circle cx="155" cy="57" r="10" stroke={C.silver} strokeWidth="1"/>
              <line x1="100" y1="12" x2="100" y2="55" stroke={C.silver} strokeWidth="0.5" opacity="0.4"/>
            </>
          )}
        </svg>
      </motion.div>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3, marginBottom:8 }}>
          Visuel disponible sur demande
        </p>
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:12, color:C.silver3 }}>
          {tier.vehicles.join(' · ')}
        </p>
      </div>
    </div>
  )
}

// ── Main tier display ─────────────────────────────────────────────────────────
function TierDisplay({ tier }) {
  const isMobile = window.innerWidth < 768
  const [selectedModel, setSelectedModel] = useState(tier.models?.[0] || null)
  const currentModelPath = selectedModel?.modelPath || tier.modelPath
  const hasModel = !!currentModelPath

  return (
    <motion.div
      key={tier.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        minHeight: 'calc(100vh - 80px)',
      }}
    >
      {/* Left — 3D or placeholder */}
      <div style={{
        position: 'relative',
        background: `radial-gradient(ellipse at 40% 50%, #141416 0%, ${C.bg} 70%)`,
        minHeight: isMobile ? '40vh' : 'auto',
        order: isMobile ? 1 : 1,
      }}>
        {/* Vignette */}
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.6) 100%)' }} />

        {hasModel ? (
          <Scene3D modelPath={currentModelPath ? (isMobile ? currentModelPath.replace(".glb", "_mobile.glb") : currentModelPath) : null} />
        ) : (
          <NoModelPlaceholder tier={tier} />
        )}

        {hasModel && (
          <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', zIndex:2, pointerEvents:'none', color:'rgba(198,198,198,0.25)', fontFamily:'monospace', fontSize:8, letterSpacing:'0.2em', whiteSpace:'nowrap' }}>
            GLISSER · ORBITER · ZOOMER
          </div>
        )}

        {/* Tier number */}
        <div style={{ position:'absolute', top:24, left:24, zIndex:2 }}>
          <span style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3 }}>
            {String(tier.tier).padStart(2,'0')} / 06
          </span>
        </div>
      </div>

      {/* Right — Info */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,64px)',
        borderLeft: isMobile ? 'none' : `1px solid ${C.silver3}22`,
        borderTop: isMobile ? `1px solid ${C.silver3}22` : 'none',
        order: isMobile ? 2 : 2,
      }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.15 }}>

          {/* Eyebrow */}
          <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, marginBottom:16 }}>
            {tier.tagline}
          </p>

          {/* Name */}
          <h2 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(28px,4vw,48px)', letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:8, lineHeight:1.05 }}>
            {tier.name}
          </h2>

          {/* Vehicles */}
          <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:C.silver3, marginBottom:32 }}>
            {tier.vehicles.join(' · ')}
          </p>

          {/* Vehicle switcher */}
          {tier.models && tier.models.length > 1 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
              {tier.models.map(model => {
                const active = (selectedModel?.name || tier.models[0].name) === model.name
                return (
                  <button key={model.name} onClick={() => setSelectedModel(model)}
                    style={{
                      fontFamily:'"Eurostile","Helvetica Neue",sans-serif', fontSize:9,
                      letterSpacing:'0.2em', textTransform:'uppercase',
                      padding:'7px 16px', cursor:'pointer', transition:'all 0.2s',
                      background: active ? 'rgba(198,198,198,0.1)' : 'transparent',
                      border: `1px solid ${active ? '#706f6f' : '#3c3c3b55'}`,
                      color: active ? '#c6c6c6' : '#3c3c3b',
                    }}>
                    {model.name}
                  </button>
                )
              })}
            </div>
          )}

          {/* Divider */}
          <div style={{ width:60, height:1, background:`linear-gradient(90deg,${C.silver3},transparent)`, marginBottom:32 }} />

          {/* Description */}
          <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:'clamp(13px,1.5vw,16px)', color:C.silver2, lineHeight:1.9, marginBottom:40, maxWidth:420 }}>
            {tier.description}
          </p>

          {/* Capacity */}
          <div style={{ display:'flex', gap:32, marginBottom:32 }}>
            {[
              { label:'Passagers', value:tier.capacity.passengers },
              { label:'Bagages', value:tier.capacity.luggage },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily:FONT_EU, fontSize:28, letterSpacing:'0.05em', color:C.white, lineHeight:1, marginBottom:4 }}>
                  {value}
                </p>
                <p style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:48 }}>
            {tier.amenities.map(a => (
              <span key={a} style={{
                fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase',
                color:C.silver2, border:`1px solid ${C.silver3}55`, padding:'5px 12px',
              }}>
                {a}
              </span>
            ))}
          </div>

          {/* CTA */}
          <a
            href={`/reserver?tier=${tier.id}`}
            style={{
              display: 'inline-block',
              fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase',
              color:C.bg, background:C.silver, padding:'16px 40px',
              textDecoration:'none', transition:'all 0.3s',
            }}
            onMouseEnter={e => e.target.style.background = C.white}
            onMouseLeave={e => e.target.style.background = C.silver}
          >
            Réserver ce véhicule
          </a>

        </motion.div>
      </div>
    </motion.div>
  )
}

// ── Hero header ───────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      padding: 'clamp(120px,16vw,180px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)',
      textAlign: 'center',
      background: `radial-gradient(ellipse at 50% 80%, #141416 0%, ${C.bg} 65%)`,
      borderBottom: `1px solid ${C.silver3}22`,
    }}>
      <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.8 }}
        style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.45em', textTransform:'uppercase', color:C.silver3, marginBottom:24 }}>
        La Flotte
      </motion.p>
      <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.9, ease:[0.22,1,0.36,1] }}
        style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(28px,5vw,60px)', letterSpacing:'0.12em', textTransform:'uppercase', color:C.white, lineHeight:1.05, marginBottom:24, maxWidth:700, margin:'0 auto 24px' }}>
        Six niveaux d'excellence.
        <br /><span style={{ color:C.silver }}>Un seul standard.</span>
      </motion.h1>
      <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8, duration:0.8 }}
        style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:'clamp(13px,1.6vw,16px)', color:C.silver2, lineHeight:1.8, maxWidth:480, margin:'24px auto 0' }}>
        De la berline executive au salon mobile, chaque tier PRYM incarne une philosophie de service. Choisissez votre niveau d'exigence.
      </motion.p>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FlottePage() {
  const [activeTier, setActiveTier] = useState(FLEET[1]) // Executive by default

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "La Flotte PRYM u2014 6 Niveaux d'Excellence | Transport Executive Maroc"
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Découvrez la flotte PRYM : Select, Executive, Signature, Voyage, Lounge, Suite. Mercedes, Audi, BMW, Sprinter VIP. Chauffeur privé luxe au Maroc.')
    // Read URL param ?tier=xxx
    const params = new URLSearchParams(window.location.search)
    const tierParam = params.get('tier')
    if (tierParam) {
      const found = FLEET.find(t => t.id === tierParam)
      if (found) setActiveTier(found)
    }
  }, [])

  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.white }}>
      <Nav />

      <Hero />

      {/* Tier selector */}
      <div style={{
        position: 'sticky', top: 61, zIndex: 90,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.silver3}22`,
        padding: '0 clamp(16px,4vw,40px)',
        display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
        gap: 4,
      }}>
        {FLEET.map(tier => (
          <TierPill key={tier.id} tier={tier} active={activeTier.id === tier.id} onClick={() => setActiveTier(tier)} />
        ))}
      </div>

      {/* Active tier display */}
      <AnimatePresence mode="wait">
        <TierDisplay key={activeTier.id} tier={activeTier} />
      </AnimatePresence>

      {/* Footer CTA */}
      <section style={{
        padding: 'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
        textAlign: 'center',
        borderTop: `1px solid ${C.silver3}22`,
        background: C.bg2,
      }}>
        <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, marginBottom:16 }}>
          Comptes Entreprises
        </p>
        <h2 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(20px,3.5vw,36px)', letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:16 }}>
          Vous avez des besoins réguliers ?
        </h2>
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:14, color:C.silver2, lineHeight:1.8, maxWidth:420, margin:'0 auto 32px' }}>
          Chauffeur attitré, facturation mensuelle, reporting détaillé. Découvrez l'offre entreprise PRYM.
        </p>
        <a href="/entreprises" style={{
          display:'inline-block', fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase',
          color:C.silver, border:`1px solid ${C.silver3}`, padding:'14px 40px',
          textDecoration:'none', transition:'all 0.3s',
        }}
          onMouseEnter={e => { e.target.style.borderColor=C.silver; e.target.style.color=C.white }}
          onMouseLeave={e => { e.target.style.borderColor=C.silver3; e.target.style.color=C.silver }}>
          Nous contacter
        </a>
      </section>
    </div>
  )
}
