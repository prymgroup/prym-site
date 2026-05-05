#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym/src"

# ── fleet.js ──────────────────────────────────────────────────────────────────
cat > "$BASE/data/fleet.js" << 'ENDOFFILE'
export const FLEET = [
  {
    id: 'select',
    name: 'PRYM Select',
    tagline: 'Excellence accessible',
    description: "Berlines premium pour vos déplacements du quotidien. L'élégance sans compromis.",
    capacity: { passengers: 4, luggage: 3 },
    vehicles: ['Volkswagen Passat', 'Škoda Superb', 'Škoda Kodiaq'],
    amenities: ['Wi-Fi', 'Eau minérale', 'Climatisation tri-zone', 'Chargeurs USB'],
    modelPath: '/models/select.glb',
    tier: 1,
  },
  {
    id: 'executive',
    name: 'PRYM Executive',
    tagline: 'Le standard business',
    description: 'Berlines premium pour vos engagements professionnels. La référence du transport executive.',
    capacity: { passengers: 4, luggage: 3 },
    vehicles: ['Mercedes Classe E', 'Audi A6', 'BMW Série 5'],
    amenities: ['Wi-Fi haut débit', 'Eaux premium', 'Chargeurs USB-C', 'Sièges cuir', 'Presse disponible'],
    modelPath: '/models/executive_mercedes.glb',
    tier: 2,
  },
  {
    id: 'signature',
    name: 'PRYM Signature',
    tagline: 'Notre flagship',
    description: "L'excellence absolue pour vos engagements les plus exigeants. Au-delà de toute attente.",
    capacity: { passengers: 4, luggage: 3 },
    vehicles: ['Mercedes Classe S', 'Audi A8', 'BMW Série 7'],
    amenities: ['Sièges massants', 'Wi-Fi haut débit', 'Sélection de presse', 'Eaux et rafraîchissements'],
    modelPath: '/models/signature_mercedes.glb',
    tier: 3,
  },
  {
    id: 'voyage',
    name: 'PRYM Voyage',
    tagline: 'Groupe confort',
    description: 'Pour vos déplacements en équipe ou en famille. Espace et confort à chaque siège.',
    capacity: { passengers: 7, luggage: 6 },
    vehicles: ['Mercedes Vito', 'Ford Tourneo'],
    amenities: ['Wi-Fi', 'Climatisation', 'Espace bagages généreux'],
    modelPath: null,
    tier: 4,
  },
  {
    id: 'lounge',
    name: 'PRYM Lounge',
    tagline: 'Salon roulant',
    description: "L'espace d'un salon privé pour vos groupes VIP.",
    capacity: { passengers: 6, luggage: 6 },
    vehicles: ['Mercedes Classe V'],
    amenities: ['Sièges captain', 'Table modulable', "Éclairage d'ambiance", 'Wi-Fi premium'],
    modelPath: null,
    tier: 5,
  },
  {
    id: 'suite',
    name: 'PRYM Suite',
    tagline: "Événementiel d'exception",
    description: 'Un salon mobile pour vos événements et délégations.',
    capacity: { passengers: 12, luggage: 10 },
    vehicles: ['Mercedes Sprinter VIP'],
    amenities: ['Salon configurable', 'Tables de travail', 'Écran TV', 'Minibar', 'Wi-Fi haut débit'],
    modelPath: null,
    tier: 6,
  },
]
ENDOFFILE

# ── VehicleScene.jsx ──────────────────────────────────────────────────────────
cat > "$BASE/components/booking/VehicleScene.jsx" << 'ENDOFFILE'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function VehicleModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()
  const clone = scene.clone(true)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })

  useEffect(() => {
    if (!ref.current) return
    const box = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const scale = 3.5 / Math.max(size.x, size.y, size.z)
    ref.current.scale.setScalar(scale)
    ref.current.position.x = -center.x * scale
    ref.current.position.y = -box.min.y * scale
    ref.current.position.z = -center.z * scale
  }, [path])

  return <group ref={ref}><primitive object={clone} /></group>
}

function Placeholder() {
  const ref = useRef()
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.25 })
  return (
    <group ref={ref}>
      <mesh><boxGeometry args={[3.2, 0.9, 1.5]} /><meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.75, 0]}><boxGeometry args={[2, 0.7, 1.45]} /><meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} /></mesh>
      {[-1.1, 1.1].flatMap(x => [-0.65, 0.65].map(z => (
        <mesh key={`${x}${z}`} position={[x, -0.35, z]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.6} />
        </mesh>
      )))}
    </group>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'rgba(200,200,204,0.4)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em' }}>
        CHARGEMENT
      </div>
    </Html>
  )
}

function SceneInner({ modelPath }) {
  const { camera } = useThree()
  useEffect(() => { camera.position.set(5, 2.5, 6); camera.lookAt(0, 0.8, 0) }, [])
  return (
    <>
      <directionalLight position={[6, 8, -4]} intensity={2.5} color="#fff5e8" castShadow />
      <directionalLight position={[-8, 4, 2]} intensity={0.8} color="#e8f0ff" />
      <directionalLight position={[-1, 5, 6]} intensity={1.8} color="#c8d8ff" />
      <ambientLight intensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={18} blur={2.5} far={8} color="#000" />
      <Environment preset="studio" />
      <Suspense fallback={modelPath ? <Loader /> : <Placeholder />}>
        {modelPath ? <VehicleModel path={modelPath} /> : <Placeholder />}
      </Suspense>
      <OrbitControls enablePan={false} minDistance={3} maxDistance={12}
        minPolarAngle={Math.PI * 0.1} maxPolarAngle={Math.PI * 0.55}
        target={[0, 0.8, 0]} dampingFactor={0.05} enableDamping />
    </>
  )
}

export default function VehicleScene({ tier }) {
  const [key, setKey] = useState(0)
  useEffect(() => { setKey(k => k + 1) }, [tier?.id])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,7,0.5) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 2, pointerEvents: 'none', color: 'rgba(200,200,204,0.3)', fontFamily: 'monospace', fontSize: '9px', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
        GLISSER · ORBITER · ZOOMER
      </div>
      <Canvas key={key} shadows dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }} camera={{ fov: 45, near: 0.1, far: 100 }}>
        <Suspense fallback={<Loader />}>
          <SceneInner modelPath={tier?.modelPath || null} />
        </Suspense>
      </Canvas>
    </div>
  )
}

import { FLEET } from '../../data/fleet'
FLEET.forEach(t => { if (t.modelPath) useGLTF.preload(t.modelPath) })
ENDOFFILE

# ── TierSelector.jsx ──────────────────────────────────────────────────────────
cat > "$BASE/components/booking/TierSelector.jsx" << 'ENDOFFILE'
import { motion } from 'framer-motion'
import { FLEET } from '../../data/fleet'

const ICONS = {
  select: <svg viewBox="0 0 40 18" fill="none" style={{width:'100%',height:'100%'}}><path d="M4 13L6 7h28l2 6" stroke="currentColor" strokeWidth="1"/><path d="M8 7l2-3h20l2 3" stroke="currentColor" strokeWidth="0.8"/><circle cx="11" cy="14" r="2" stroke="currentColor" strokeWidth="0.8"/><circle cx="29" cy="14" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>,
  executive: <svg viewBox="0 0 40 18" fill="none" style={{width:'100%',height:'100%'}}><path d="M3 13L5 6h30l2 7" stroke="currentColor" strokeWidth="1"/><path d="M7 6l2-3h22l2 3" stroke="currentColor" strokeWidth="0.8"/><circle cx="10" cy="14" r="2.2" stroke="currentColor" strokeWidth="0.9"/><circle cx="30" cy="14" r="2.2" stroke="currentColor" strokeWidth="0.9"/><line x1="3" y1="10" x2="37" y2="10" stroke="currentColor" strokeWidth="0.4" opacity="0.4"/></svg>,
  signature: <svg viewBox="0 0 40 18" fill="none" style={{width:'100%',height:'100%'}}><path d="M2 13L4 5h32l2 8" stroke="currentColor" strokeWidth="1.1"/><path d="M7 5l2-3h22l2 3" stroke="currentColor" strokeWidth="0.8"/><circle cx="9" cy="14" r="2.5" stroke="currentColor" strokeWidth="1"/><circle cx="31" cy="14" r="2.5" stroke="currentColor" strokeWidth="1"/><line x1="2" y1="9" x2="38" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/></svg>,
  voyage: <svg viewBox="0 0 40 18" fill="none" style={{width:'100%',height:'100%'}}><path d="M2 13L4 6h32l2 7" stroke="currentColor" strokeWidth="1"/><path d="M6 6l1-3h26l1 3" stroke="currentColor" strokeWidth="0.8"/><circle cx="9" cy="14" r="2" stroke="currentColor" strokeWidth="0.8"/><circle cx="31" cy="14" r="2" stroke="currentColor" strokeWidth="0.8"/><line x1="20" y1="6" x2="20" y2="13" stroke="currentColor" strokeWidth="0.4" opacity="0.4"/></svg>,
  lounge: <svg viewBox="0 0 40 18" fill="none" style={{width:'100%',height:'100%'}}><rect x="2" y="4" width="36" height="9" rx="1" stroke="currentColor" strokeWidth="0.9"/><path d="M6 4l1-2h26l1 2" stroke="currentColor" strokeWidth="0.7"/><circle cx="9" cy="13" r="2" stroke="currentColor" strokeWidth="0.8"/><circle cx="31" cy="13" r="2" stroke="currentColor" strokeWidth="0.8"/></svg>,
  suite: <svg viewBox="0 0 48 18" fill="none" style={{width:'100%',height:'100%'}}><rect x="2" y="4" width="44" height="9" rx="1" stroke="currentColor" strokeWidth="1"/><path d="M7 4l1-2h32l1 2" stroke="currentColor" strokeWidth="0.7"/><circle cx="9" cy="13" r="2" stroke="currentColor" strokeWidth="0.8"/><circle cx="39" cy="13" r="2" stroke="currentColor" strokeWidth="0.8"/><circle cx="24" cy="13" r="2" stroke="currentColor" strokeWidth="0.7"/></svg>,
}

export default function TierSelector({ selectedTier, onSelect }) {
  return (
    <div style={{ borderTop: '1px solid rgba(200,200,204,0.08)', background: 'rgba(5,5,7,0.7)', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FLEET.map(tier => {
          const active = selectedTier?.id === tier.id
          return (
            <motion.button key={tier.id} onClick={() => onSelect(tier)} whileTap={{ scale: 0.96 }}
              style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', minWidth: 88 }}>
              <motion.div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,#C8C8CC,transparent)' }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.3 }} />
              <div style={{ width: 50, height: 20, color: active ? '#C8C8CC' : 'rgba(200,200,204,0.25)', transition: 'color 0.3s' }}>{ICONS[tier.id]}</div>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: active ? '#C8C8CC' : 'rgba(200,200,204,0.25)', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>{tier.name.replace('PRYM ', '')}</span>
              <motion.div style={{ width: 3, height: 3, borderRadius: '50%', background: '#C8C8CC' }} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }} transition={{ duration: 0.2 }} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
ENDOFFILE

# ── Step1Mode.jsx ─────────────────────────────────────────────────────────────
cat > "$BASE/components/booking/steps/Step1Mode.jsx" << 'ENDOFFILE'
import { motion } from 'framer-motion'

function Card({ icon, title, subtitle, desc, onClick, delay }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      style={{ flex: '1 1 220px', minHeight: 180, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 2, padding: '32px 24px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 1, background: 'rgba(200,200,204,0.4)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 24, background: 'rgba(200,200,204,0.4)' }} />
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 4 }}>{title}</div>
        <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8C8CC', marginBottom: 12 }}>{subtitle}</div>
        <div style={{ fontSize: 11, color: 'rgba(200,200,204,0.5)', lineHeight: 1.6, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{desc}</div>
      </div>
      <div style={{ marginTop: 'auto', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)' }}>Sélectionner →</div>
    </motion.button>
  )
}

export default function Step1Mode({ onSelect }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', gap: 16 }}>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 8, textAlign: 'center' }}>
        Type de service
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 'clamp(20px,4vw,28px)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 32, textAlign: 'center', fontWeight: 300 }}>
        Quelle est votre demande ?
      </motion.h2>
      <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 600, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card icon="→" title="Transfert" subtitle="Point à point" desc="Aéroport, gare, hôtel, rendez-vous. Un trajet défini, une prise en charge précise." onClick={() => onSelect('transfer')} delay={0.2} />
        <Card icon="◎" title="Mise à disposition" subtitle="À partir de 2 heures" desc="Votre chauffeur et votre véhicule, entièrement dédiés à votre agenda." onClick={() => onSelect('disposal')} delay={0.3} />
      </div>
    </div>
  )
}
ENDOFFILE

# ── Step2Forms.jsx ────────────────────────────────────────────────────────────
cat > "$BASE/components/booking/steps/Step2Forms.jsx" << 'ENDOFFILE'
import { useState } from 'react'
import { motion } from 'framer-motion'

const IS = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: '14px 16px', color: '#F5F5F0', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 12, letterSpacing: '0.08em', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }
const LS = { fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.5)', marginBottom: 6, display: 'block' }
const eyebrow = (n) => <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 8 }}>{n}</p>
const h2 = (t) => <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 32 }}>{t}</h2>

function BackNext({ onBack, onNext, valid, label = 'Choisir le véhicule →' }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
      <button onClick={onBack} style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'rgba(200,200,204,0.5)' }}>← Retour</button>
      <button onClick={onNext} disabled={!valid} style={{ flex: 1, padding: 14, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'rgba(200,200,204,0.1)' : 'transparent', border: `1px solid ${valid ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.1)'}`, borderRadius: 2, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: valid ? '#F5F5F0' : 'rgba(200,200,204,0.3)', transition: 'all 0.3s' }}>{label}</button>
    </div>
  )
}

export function Step2aTransfer({ data, onChange, onNext, onBack }) {
  const [f, setF] = useState(null)
  const set = k => e => onChange({ ...data, [k]: e.target.value })
  const valid = data.from && data.to && data.date && data.time
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
      {eyebrow('02 — Votre trajet')}{h2('Détails du transfert')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={LS}>Lieu de départ</label><input style={{ ...IS, borderColor: f === 'from' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="Aéroport, adresse, hôtel..." value={data.from || ''} onChange={set('from')} onFocus={() => setF('from')} onBlur={() => setF(null)} /></div>
        <div><label style={LS}>Destination</label><input style={{ ...IS, borderColor: f === 'to' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="Adresse d'arrivée..." value={data.to || ''} onChange={set('to')} onFocus={() => setF('to')} onBlur={() => setF(null)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LS}>Date</label><input type="date" style={{ ...IS, colorScheme: 'dark', borderColor: f === 'date' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} value={data.date || ''} onChange={set('date')} onFocus={() => setF('date')} onBlur={() => setF(null)} min={new Date().toISOString().split('T')[0]} /></div>
          <div><label style={LS}>Heure</label><input type="time" style={{ ...IS, colorScheme: 'dark', borderColor: f === 'time' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} value={data.time || ''} onChange={set('time')} onFocus={() => setF('time')} onBlur={() => setF(null)} /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LS}>Passagers</label><select style={{ ...IS, cursor: 'pointer' }} value={data.passengers || 1} onChange={set('passengers')}>{[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} style={{ background: '#0a0a0a' }}>{n} passager{n > 1 ? 's' : ''}</option>)}</select></div>
          <div><label style={LS}>Bagages</label><select style={{ ...IS, cursor: 'pointer' }} value={data.luggage || 0} onChange={set('luggage')}>{[0,1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background: '#0a0a0a' }}>{n} bagage{n > 1 ? 's' : ''}</option>)}</select></div>
        </div>
      </div>
      <BackNext onBack={onBack} onNext={onNext} valid={valid} />
    </motion.div>
  )
}

export function Step2bDisposal({ data, onChange, onNext, onBack }) {
  const [f, setF] = useState(null)
  const set = k => e => onChange({ ...data, [k]: e.target.value })
  const durations = [[2,'2 heures'],[3,'3 heures'],[4,'4 heures'],[6,'6 heures'],[8,'Demi-journée (8h)'],[12,'Journée (12h)'],[0,'Multi-jours (nous contacter)']]
  const valid = data.location && data.date && data.time && data.duration
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
      {eyebrow('02 — Votre demande')}{h2('Mise à disposition')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={LS}>Lieu de prise en charge</label><input style={{ ...IS, borderColor: f === 'loc' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="Adresse de départ..." value={data.location || ''} onChange={set('location')} onFocus={() => setF('loc')} onBlur={() => setF(null)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LS}>Date</label><input type="date" style={{ ...IS, colorScheme: 'dark' }} value={data.date || ''} onChange={set('date')} min={new Date().toISOString().split('T')[0]} /></div>
          <div><label style={LS}>Heure de début</label><input type="time" style={{ ...IS, colorScheme: 'dark' }} value={data.time || ''} onChange={set('time')} /></div>
        </div>
        <div><label style={LS}>Durée souhaitée</label><select style={{ ...IS, cursor: 'pointer' }} value={data.duration || ''} onChange={set('duration')}><option value="" style={{ background: '#0a0a0a' }}>Sélectionner une durée</option>{durations.map(([v, l]) => <option key={v} value={v} style={{ background: '#0a0a0a' }}>{l}</option>)}</select></div>
        <div><label style={LS}>Programme / instructions (optionnel)</label><textarea style={{ ...IS, minHeight: 80, resize: 'vertical', lineHeight: 1.6 }} placeholder="Destinations prévues, arrêts, besoins particuliers..." value={data.notes || ''} onChange={set('notes')} /></div>
      </div>
      <BackNext onBack={onBack} onNext={onNext} valid={valid} />
    </motion.div>
  )
}
ENDOFFILE

# ── Step4And5.jsx ─────────────────────────────────────────────────────────────
cat > "$BASE/components/booking/steps/Step4And5.jsx" << 'ENDOFFILE'
import { useState } from 'react'
import { motion } from 'framer-motion'

const IS = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: '14px 16px', color: '#F5F5F0', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 12, letterSpacing: '0.08em', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }
const LS = { fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.5)', marginBottom: 6, display: 'block' }

export function Step4Passenger({ data, onChange, onNext, onBack }) {
  const [f, setF] = useState(null)
  const set = k => e => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; onChange({ ...data, [k]: v }) }
  const valid = data.name && data.phone && data.email && data.paymentMethod && data.consent
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
      <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 8 }}>04 — Vos coordonnées</p>
      <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 32 }}>Finaliser la demande</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={LS}>Nom complet</label><input style={{ ...IS, borderColor: f === 'name' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="Prénom et nom de famille" value={data.name || ''} onChange={set('name')} onFocus={() => setF('name')} onBlur={() => setF(null)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LS}>Téléphone</label><input type="tel" style={{ ...IS, borderColor: f === 'phone' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="+212 6XX XXX XXX" value={data.phone || ''} onChange={set('phone')} onFocus={() => setF('phone')} onBlur={() => setF(null)} /></div>
          <div><label style={LS}>Email</label><input type="email" style={{ ...IS, borderColor: f === 'email' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="votre@email.com" value={data.email || ''} onChange={set('email')} onFocus={() => setF('email')} onBlur={() => setF(null)} /></div>
        </div>
        <div><label style={LS}>Demandes particulières (optionnel)</label><textarea style={{ ...IS, minHeight: 72, resize: 'vertical', lineHeight: 1.6 }} placeholder="Siège enfant, accueil nominatif, eau gazeuse, langue du chauffeur..." value={data.requests || ''} onChange={set('requests')} /></div>
        <div>
          <label style={{ ...LS, marginBottom: 10 }}>Préférence de paiement</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['online','En ligne','Lien envoyé après confirmation'],['onsite','Sur place','Espèces ou carte au chauffeur']].map(([v,l,s]) => (
              <button key={v} onClick={() => onChange({ ...data, paymentMethod: v })} style={{ flex: 1, padding: 12, textAlign: 'left', cursor: 'pointer', background: data.paymentMethod === v ? 'rgba(200,200,204,0.08)' : 'transparent', border: `1px solid ${data.paymentMethod === v ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.12)'}`, borderRadius: 2, transition: 'all 0.2s' }}>
                <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 10, color: 'rgba(200,200,204,0.4)', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{s}</div>
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" checked={data.consent || false} onChange={set('consent')} style={{ marginTop: 2, accentColor: '#C8C8CC', width: 14, height: 14, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(200,200,204,0.5)', lineHeight: 1.6, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>J'accepte d'être contacté par un conseiller PRYM pour confirmer et finaliser ma demande.</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button onClick={onBack} style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'rgba(200,200,204,0.5)' }}>← Retour</button>
        <button onClick={onNext} disabled={!valid} style={{ flex: 1, padding: 14, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'rgba(200,200,204,0.1)' : 'transparent', border: `1px solid ${valid ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.1)'}`, borderRadius: 2, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: valid ? '#F5F5F0' : 'rgba(200,200,204,0.3)', transition: 'all 0.3s' }}>Confirmer la demande →</button>
      </div>
    </motion.div>
  )
}

export function Step5Confirm({ reference, mode, tier, passenger, onReset }) {
  const corners = [['top','left'],['top','right'],['bottom','left'],['bottom','right']]
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{ padding: '40px 24px', maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ width: '100%', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: 32, position: 'relative', background: 'rgba(200,200,204,0.02)' }}>
        {corners.map(([v,h]) => (
          <div key={`${v}${h}`} style={{ position: 'absolute', [v]: 0, [h]: 0, width: 16, height: 1, background: 'rgba(200,200,204,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, [h]: 0, width: 1, height: 16, background: 'rgba(200,200,204,0.5)' }} />
          </div>
        ))}
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 12 }}>Référence de demande</p>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 22, letterSpacing: '0.15em', color: '#F5F5F0', marginBottom: 24 }}>{reference}</p>
        <div style={{ borderTop: '1px solid rgba(200,200,204,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['Service', mode === 'transfer' ? 'Transfert' : 'Mise à disposition'],['Véhicule', tier?.name],['Contact', passenger?.name]].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)' }}>{k}</span>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.1em', color: '#C8C8CC' }}>{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ fontSize: 13, color: 'rgba(200,200,204,0.5)', lineHeight: 1.8, fontFamily: 'Georgia,serif', fontStyle: 'italic', maxWidth: 360 }}>
        Votre demande est reçue. Un conseiller PRYM vous contactera sous <span style={{ color: '#C8C8CC' }}>30 minutes</span> pour confirmer les détails.
      </motion.p>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={onReset}
        style={{ background: 'none', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: '12px 24px', cursor: 'pointer', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.3)'; e.currentTarget.style.color = '#C8C8CC' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.15)'; e.currentTarget.style.color = 'rgba(200,200,204,0.4)' }}>
        Nouvelle demande
      </motion.button>
    </motion.div>
  )
}
ENDOFFILE

# ── BookingFlow.jsx ───────────────────────────────────────────────────────────
cat > "$BASE/components/booking/BookingFlow.jsx" << 'ENDOFFILE'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLEET } from '../../data/fleet'
import VehicleScene from './VehicleScene'
import TierSelector from './TierSelector'
import Step1Mode from './steps/Step1Mode'
import { Step2aTransfer, Step2bDisposal } from './steps/Step2Forms'
import { Step4Passenger, Step5Confirm } from './steps/Step4And5'

function ProgressBar({ step, total }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(200,200,204,0.08)', zIndex: 10 }}>
      <motion.div style={{ height: '100%', background: 'rgba(200,200,204,0.5)', transformOrigin: 'left' }} animate={{ scaleX: step / total }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }} />
    </div>
  )
}

function Step3Vehicle({ selectedTier, onSelectTier, onNext, onBack }) {
  const tier = selectedTier || FLEET[1]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 24, borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0 }}>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 4 }}>03 — Votre véhicule</p>
        <AnimatePresence mode="wait">
          <motion.div key={tier.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 'clamp(18px,3.5vw,24px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 4 }}>{tier.name}</h2>
            <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8C8CC', marginBottom: 12 }}>{tier.tagline}</p>
            <p style={{ fontSize: 12, color: 'rgba(200,200,204,0.5)', lineHeight: 1.7, fontFamily: 'Georgia,serif', fontStyle: 'italic', maxWidth: 400, marginBottom: 12 }}>{tier.description}</p>
            <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.3)', fontStyle: 'italic', marginBottom: 12 }}>{tier.vehicles.join(' · ')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tier.amenities.map(a => <span key={a} style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 1, padding: '3px 8px' }}>{a}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>◎ {tier.capacity.passengers} passagers</span>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>◎ {tier.capacity.luggage} bagages</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ padding: '16px 24px', flexShrink: 0, display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 2, padding: '12px 20px', cursor: 'pointer', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', transition: 'all 0.2s' }}>← Retour</button>
        <button onClick={() => onNext(tier)}
          style={{ flex: 1, padding: 12, cursor: 'pointer', background: 'rgba(200,200,204,0.08)', border: '1px solid rgba(200,200,204,0.2)', borderRadius: 2, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#F5F5F0', transition: 'all 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,200,204,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,200,204,0.08)'}>
          Sélectionner {tier.name.replace('PRYM ', '')} →
        </button>
      </div>
    </div>
  )
}

function genRef() {
  return `PRYM-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`
}

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState(null)
  const [transfer, setTransfer] = useState({ passengers: 1, luggage: 0 })
  const [disposal, setDisposal] = useState({ duration: 4 })
  const [tier, setTier] = useState(FLEET[1])
  const [passenger, setPassenger] = useState({})
  const [ref, setRef] = useState(null)

  const reset = () => { setStep(1); setMode(null); setTransfer({ passengers: 1, luggage: 0 }); setDisposal({ duration: 4 }); setTier(FLEET[1]); setPassenger({}); setRef(null) }

  const showScene = step === 3

  return (
    <div style={{ minHeight: '100vh', background: '#050507', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <ProgressBar step={step} total={5} />
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0 }}>
        <a href="/" style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F5F5F0', textDecoration: 'none', fontWeight: 300 }}>PRYM</a>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.3)' }}>{step < 5 ? `${step} / 4` : 'Demande envoyée'}</p>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: showScene ? 'row' : 'column', overflow: 'hidden', minHeight: 0 }}>
        <AnimatePresence>
          {showScene && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              style={{ flex: '1 1 55%', minHeight: 300, background: 'linear-gradient(135deg,#050507 0%,#080810 100%)', position: 'relative' }}>
              <VehicleScene tier={tier} style={{ width: '100%', height: '100%' }} />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ flex: showScene ? '0 0 380px' : 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: showScene ? '1px solid rgba(200,200,204,0.06)' : 'none' }}>
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="s1" style={{ flex: 1 }}><Step1Mode onSelect={m => { setMode(m); setStep(2) }} /></motion.div>}
            {step === 2 && mode === 'transfer' && <motion.div key="s2a" style={{ flex: 1, overflowY: 'auto' }}><Step2aTransfer data={transfer} onChange={setTransfer} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 2 && mode === 'disposal' && <motion.div key="s2b" style={{ flex: 1, overflowY: 'auto' }}><Step2bDisposal data={disposal} onChange={setDisposal} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 3 && <motion.div key="s3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><Step3Vehicle selectedTier={tier} onSelectTier={setTier} onNext={t => { setTier(t); setStep(4) }} onBack={() => setStep(2)} /></motion.div>}
            {step === 4 && <motion.div key="s4" style={{ flex: 1, overflowY: 'auto' }}><Step4Passenger data={passenger} onChange={setPassenger} onNext={() => { setRef(genRef()); setStep(5) }} onBack={() => setStep(3)} /></motion.div>}
            {step === 5 && <motion.div key="s5" style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center' }}><Step5Confirm reference={ref} mode={mode} tier={tier} passenger={passenger} onReset={reset} /></motion.div>}
          </AnimatePresence>
          {step === 3 && <TierSelector selectedTier={tier} onSelect={setTier} />}
        </div>
      </div>
    </div>
  )
}
ENDOFFILE

echo ""
echo "✅ Tous les fichiers créés :"
find "$BASE/components/booking" "$BASE/data" -type f | sort
