import { useState, useEffect, Suspense, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { FLEET } from '../data/fleet'
import * as THREE from 'three'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const C = {
  bg: '#0a0a0a', bg2: '#0e0e0f',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn); return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

// ── 3D Model ──────────────────────────────────────────────────────────────────
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

function Loader3D({ label }) {
  return (
    <Html center>
      <div style={{ color: 'rgba(198,198,198,0.3)', fontFamily: FONT_EU, fontSize: '9px', letterSpacing: '0.3em' }}>
        {label}
      </div>
    </Html>
  )
}

function SceneContent({ modelPath, isMobile }) {
  const orbitRef = useRef()
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const ctrl = orbitRef.current; if (!ctrl) return
      ctrl.object.position.set(3.5, 0.9, 5.5); ctrl.target.set(0, 0.6, 0); ctrl.update()
    })
    return () => cancelAnimationFrame(raf)
  }, [isMobile])
  return (
    <>
      <directionalLight position={[6, 8, -4]} intensity={2.5} color="#fff5e8" castShadow />
      <directionalLight position={[-8, 4, 2]} intensity={0.8} color="#e8f0ff" />
      <directionalLight position={[-1, 5, 6]} intensity={1.8} color="#c8d8ff" />
      <ambientLight intensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={20} blur={2.5} far={8} color="#000" />
      <Environment preset="studio" />
      <Suspense fallback={<Loader3D label="..." />}>
        <VehicleModel path={modelPath} />
      </Suspense>
      <OrbitControls ref={orbitRef} enablePan={false}
        minDistance={isMobile ? 2 : 3} maxDistance={isMobile ? 8 : 12}
        minPolarAngle={Math.PI * 0.05} maxPolarAngle={Math.PI * 0.6}
        target={[0, 0.6, 0]} dampingFactor={0.05} enableDamping />
    </>
  )
}

function Scene3D({ modelPath, isMobile }) {
  const [key, setKey] = useState(0)
  const [inView, setInView] = useState(true)
  const containerRef = useRef()

  useEffect(() => { setKey(k => k + 1) }, [modelPath])

  const observerCb = useCallback(([entry]) => {
    setInView(entry.isIntersecting)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(observerCb, { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [observerCb])

  const fov = isMobile ? 65 : 42
  return (
    // Wrapper fills the parent (position:relative + overflow:hidden) so the
    // IntersectionObserver has a real DOM node to watch.
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <Canvas key={key} shadows
        frameloop={inView ? 'always' : 'demand'}
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }} camera={{ fov, near: 0.1, far: 100 }}>
        <Suspense fallback={<Loader3D label="..." />}>
          <SceneContent modelPath={modelPath} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}

FLEET.forEach(t => { if (t.modelPath) useGLTF.preload(t.modelPath) })

function ChevronArrow({ direction, onClick, bottom }) {
  return (
    <motion.button onClick={onClick} whileHover={{ opacity: 1 }} whileTap={{ opacity: 0.4 }}
      style={{
        position: 'absolute',
        ...(bottom
          ? { bottom: 28, [direction === 'left' ? 'left' : 'right']: 32 }
          : { top: '50%', transform: 'translateY(-50%)', [direction === 'left' ? 'left' : 'right']: 16 }
        ),
        zIndex: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 16,
        color: 'rgba(198,198,198,0.35)', opacity: 0.35, transition: 'opacity 0.4s ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      <svg width="10" height="22" viewBox="0 0 10 22" fill="none">
        {direction === 'left'
          ? <polyline points="8,1 2,11 8,21" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          : <polyline points="2,1 8,11 2,21" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </motion.button>
  )
}

function TierPill({ tier, active, onClick, layoutId, domRef }) {
  return (
    <motion.button ref={domRef} onClick={onClick} whileTap={{ scale: 0.97 }}
      style={{
        background: active ? 'rgba(198,198,198,0.08)' : 'transparent',
        border: `1px solid ${active ? C.silver3 : C.silver3+'44'}`,
        padding: '8px 16px', cursor: 'pointer',
        fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.25em',
        textTransform: 'uppercase', color: active ? C.silver : C.silver3,
        transition: 'all 0.3s ease', whiteSpace: 'nowrap',
        position: 'relative', flexShrink: 0,
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.silver2; e.currentTarget.style.borderColor = C.silver3 } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.silver3; e.currentTarget.style.borderColor = C.silver3+'44' } }}>
      {active && (
        <motion.div layoutId={layoutId || 'pill-active'}
          style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${C.silver},transparent)` }} />
      )}
      {tier.name.replace('PRYM ', '')}
    </motion.button>
  )
}

function NoModelPlaceholder({ tier, label }) {
  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:24 }}>
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }}
        style={{ position:'relative', width:200, height:80 }}>
        <svg viewBox="0 0 200 80" fill="none" style={{ width:'100%', height:'100%', opacity:0.2 }}>
          {tier.id === 'suite' ? (
            <>
              <rect x="10" y="15" width="170" height="45" rx="4" stroke={C.silver} strokeWidth="1"/>
              <rect x="10" y="5" width="140" height="15" rx="2" stroke={C.silver} strokeWidth="0.8"/>
              <circle cx="45" cy="62" r="10" stroke={C.silver} strokeWidth="1"/>
              <circle cx="155" cy="62" r="10" stroke={C.silver} strokeWidth="1"/>
            </>
          ) : (
            <>
              <path d="M10 55 L10 25 Q12 15 30 12 L150 12 Q175 12 185 25 L190 55 Z" stroke={C.silver} strokeWidth="1"/>
              <circle cx="45" cy="57" r="10" stroke={C.silver} strokeWidth="1"/>
              <circle cx="155" cy="57" r="10" stroke={C.silver} strokeWidth="1"/>
              <line x1="100" y1="12" x2="100" y2="55" stroke={C.silver} strokeWidth="0.5" opacity="0.4"/>
            </>
          )}
        </svg>
      </motion.div>
      <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>
        {label}
      </p>
    </div>
  )
}

function TierDisplay({ tier, isMobile, activeTier, setActiveTier, tf }) {
  const [modelIdx, setModelIdx] = useState(0)
  const [selectedModel, setSelectedModel] = useState(tier.models?.[0] || null)
  const pillRefs = useRef({})

  useEffect(() => { setModelIdx(0); setSelectedModel(tier.models?.[0] || null) }, [tier.id])
  useEffect(() => {
    const el = pillRefs.current[activeTier.id]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeTier.id])

  const currentModelPath = selectedModel?.modelPath || tier.modelPath
  const hasModel = !!currentModelPath
  const canNavigate = tier.models?.length > 1
  const vehicleLabel = selectedModel?.name || tier.vehicles?.[0] || ''

  const prevModel = () => {
    if (!canNavigate) return
    const newIdx = (modelIdx - 1 + tier.models.length) % tier.models.length
    setModelIdx(newIdx); setSelectedModel(tier.models[newIdx])
  }
  const nextModel = () => {
    if (!canNavigate) return
    const newIdx = (modelIdx + 1) % tier.models.length
    setModelIdx(newIdx); setSelectedModel(tier.models[newIdx])
  }

  if (isMobile) {
    return (
      <motion.div key={tier.id} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}
        style={{ display:'flex', flexDirection:'column' }}>
        <div style={{
          position:'relative', width:'100%', height:'calc(100vh - 170px)',
          background:`radial-gradient(ellipse at 40% 50%, #141416 0%, ${C.bg} 70%)`,
          overflow:'hidden', flexShrink:0,
        }}>
          <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 55%, rgba(10,10,10,0.55) 100%)' }} />
          {hasModel ? <Scene3D modelPath={currentModelPath} isMobile={true} /> : <NoModelPlaceholder tier={tier} label={tf.noVisual} />}
          {canNavigate && (<><ChevronArrow direction="left" onClick={prevModel} /><ChevronArrow direction="right" onClick={nextModel} /></>)}
          <AnimatePresence mode="wait">
            <motion.div key={vehicleLabel} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
              style={{ position:'absolute', bottom:20, left:24, zIndex:2, pointerEvents:'none', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0' }}>
              {vehicleLabel.toUpperCase()}
            </motion.div>
          </AnimatePresence>
          <div style={{ position:'absolute', bottom:20, right:24, zIndex:2, pointerEvents:'none', fontFamily:FONT_EU, fontSize:8, color:'rgba(198,198,198,0.18)' }}>↓</div>
        </div>

        <div style={{ padding:'28px 24px 48px', background:C.bg }}>
          <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', marginBottom:40, marginLeft:-24, marginRight:-24, paddingLeft:24, paddingRight:24 }}>
            {FLEET.map(t => (
              <TierPill key={t.id} tier={t} active={activeTier.id===t.id} onClick={() => setActiveTier(t)} layoutId="pill-active-mobile"
                domRef={el => { pillRefs.current[t.id] = el }} />
            ))}
          </div>
          <h2 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:26, letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:24, lineHeight:1.05 }}>
            {tier.name}
          </h2>
          <div style={{ width:36, height:1, background:`linear-gradient(90deg,${C.silver3},transparent)`, marginBottom:28 }} />
          <div style={{ display:'flex', gap:36, marginBottom:28 }}>
            {[{label:tf.passengers,value:tier.capacity.passengers},{label:tf.luggage,value:tier.capacity.luggage}].map(({label,value}) => (
              <div key={label}>
                <p style={{ fontFamily:FONT_EU, fontSize:26, letterSpacing:'0.05em', color:C.white, lineHeight:1, marginBottom:5 }}>{value}</p>
                <p style={{ fontFamily:FONT_EU, fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:36 }}>
            {tier.amenities.map(a => (
              <span key={a} style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:C.silver2 }}>{a}</span>
            ))}
          </div>
          <a href={`/reserver?tier=${tier.id}`}
            style={{ display:'block', textAlign:'center', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:C.bg, background:C.silver, padding:'17px 32px', textDecoration:'none' }}>
            {tf.book}
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div key={tier.id} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.5 }}
      style={{ display:'grid', gridTemplateColumns:'32% 68%', height:'calc(100vh - 64px)', overflow:'hidden' }}>
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 48px 48px 64px', borderRight:`1px solid ${C.silver3}18`, overflowY:'auto', scrollbarWidth:'none' }}>
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.1 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:48 }}>
            {FLEET.map(t => (
              <TierPill key={t.id} tier={t} active={activeTier.id===t.id} onClick={() => setActiveTier(t)} layoutId="pill-active-desktop" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.h2 key={tier.id+'-name'} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.4}}
              style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(28px,2.8vw,48px)', letterSpacing:'0.08em', textTransform:'uppercase', color:C.white, marginBottom:14, lineHeight:1.0 }}>
              {tier.name}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={vehicleLabel} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
              style={{ fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0', marginBottom:36 }}>
              {vehicleLabel.toUpperCase()}
            </motion.p>
          </AnimatePresence>

          <div style={{ width:40, height:1, background:`linear-gradient(90deg,${C.silver3},transparent)`, marginBottom:36 }} />

          <div style={{ display:'flex', gap:40, marginBottom:36 }}>
            {[{label:tf.passengers,value:tier.capacity.passengers},{label:tf.luggage,value:tier.capacity.luggage}].map(({label,value}) => (
              <div key={label}>
                <p style={{ fontFamily:FONT_EU, fontSize:'clamp(28px,2.5vw,40px)', letterSpacing:'0.04em', color:C.white, lineHeight:1, marginBottom:6 }}>{value}</p>
                <p style={{ fontFamily:FONT_EU, fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:48 }}>
            {tier.amenities.map(a => (
              <span key={a}
                style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:C.silver2, opacity:0.55, transition:'opacity 0.4s ease', cursor:'default' }}
                onMouseEnter={e => e.currentTarget.style.opacity=1}
                onMouseLeave={e => e.currentTarget.style.opacity=0.55}>
                {a}
              </span>
            ))}
          </div>

          <a href={`/reserver?tier=${tier.id}`}
            style={{ display:'inline-block', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.35em', textTransform:'uppercase', color:C.silver, background:'transparent', border:`1px solid ${C.silver3}`, padding:'16px 40px', textDecoration:'none', transition:'all 0.4s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background='#1A1A1A'; e.currentTarget.style.borderColor=C.silver2; e.currentTarget.style.color=C.white }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=C.silver3; e.currentTarget.style.color=C.silver }}>
            {tf.book}
          </a>
        </motion.div>
      </div>

      <div style={{ position:'relative', background:`radial-gradient(ellipse at 60% 50%, #111114 0%, ${C.bg} 75%)`, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'linear-gradient(to right, rgba(10,10,10,0.15) 0%, transparent 18%, transparent 85%, rgba(10,10,10,0.3) 100%)' }} />
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at 55% 50%, transparent 40%, rgba(10,10,10,0.45) 100%)' }} />
        {hasModel ? <Scene3D modelPath={currentModelPath} isMobile={false} /> : <NoModelPlaceholder tier={tier} label={tf.noVisual} />}
        {canNavigate && (<><ChevronArrow direction="left" onClick={prevModel} /><ChevronArrow direction="right" onClick={nextModel} /></>)}
        <AnimatePresence mode="wait">
          <motion.div key={vehicleLabel} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
            style={{ position:'absolute', bottom:28, left:32, zIndex:2, pointerEvents:'none', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0' }}>
            {vehicleLabel.toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function FlottePage() {
  const [activeTier, setActiveTier] = useState(FLEET[1])
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const tf = T[lang].flotte

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = "La Flotte PRYM \u2014 6 Niveaux d'Excellence | Transport Executive Maroc"
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Découvrez la flotte PRYM : Select, Executive, Signature, Voyage, Lounge, Suite. Mercedes, Audi, BMW, Sprinter VIP. Chauffeur privé luxe au Maroc.')
    const params = new URLSearchParams(window.location.search)
    const tierParam = params.get('tier')
    if (tierParam) { const found = FLEET.find(t => t.id === tierParam); if (found) setActiveTier(found) }
  }, [])

  return (
    <div style={{ background:C.bg, color:C.white, overflowX:'hidden', height:isMobile?'auto':'100vh', overflow:isMobile?'auto':'hidden' }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}
      <div style={{ paddingTop: isMobile ? 48 : 64 }}>
        <AnimatePresence mode="wait">
          <TierDisplay key={activeTier.id} tier={activeTier} isMobile={isMobile} activeTier={activeTier} setActiveTier={setActiveTier} tf={tf} />
        </AnimatePresence>
      </div>

      {isMobile && (
        <section style={{ padding:'48px 24px', textAlign:'left', borderTop:`1px solid ${C.silver3}22`, background:C.bg2 }}>
          <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, marginBottom:16 }}>
            {tf.corporate}
          </p>
          <h2 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:20, letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:28 }}>
            {tf.regularNeeds}
          </h2>
          <a href="/entreprises"
            style={{ display:'block', textAlign:'center', fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase', color:C.silver, border:`1px solid ${C.silver3}`, padding:'14px 40px', textDecoration:'none' }}>
            {tf.contact}
          </a>
        </section>
      )}
    </div>
  )
}
