#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym/src"

# ── BookingFlow.jsx ───────────────────────────────────────────────────────────
cat > "$BASE/components/booking/BookingFlow.jsx" << 'EOF'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLEET } from '../../data/fleet'
import VehicleScene from './VehicleScene'
import TierSelector from './TierSelector'
import Step1Mode from './steps/Step1Mode'
import { Step2aTransfer, Step2bDisposal } from './steps/Step2Forms'
import { Step4Passenger, Step5Confirm } from './steps/Step4And5'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

function ProgressBar({ step, total }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(200,200,204,0.08)', zIndex: 10 }}>
      <motion.div style={{ height: '100%', background: 'rgba(200,200,204,0.5)', transformOrigin: 'left' }}
        animate={{ scaleX: step / total }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }} />
    </div>
  )
}

function Step3Vehicle({ selectedTier, onNext, onBack, isMobile }) {
  const tier = selectedTier || FLEET[1]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: isMobile ? 'auto' : 'visible' }}>
      <div style={{ padding: isMobile ? '16px' : '24px', borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0 }}>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 4 }}>03 — Votre véhicule</p>
        <AnimatePresence mode="wait">
          <motion.div key={tier.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: isMobile ? 16 : 'clamp(18px,3.5vw,24px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 4 }}>{tier.name}</h2>
            <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8C8CC', marginBottom: 8 }}>{tier.tagline}</p>
            <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.3)', fontStyle: 'italic', marginBottom: 8 }}>{tier.vehicles.join(' · ')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {tier.amenities.map(a => <span key={a} style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 1, padding: '2px 6px' }}>{a}</span>)}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>◎ {tier.capacity.passengers} passagers</span>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>◎ {tier.capacity.luggage} bagages</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', flexShrink: 0, display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 2, padding: '12px 16px', cursor: 'pointer', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)' }}>← Retour</button>
        <button onClick={() => onNext(tier)}
          style={{ flex: 1, padding: 12, cursor: 'pointer', background: 'rgba(200,200,204,0.08)', border: '1px solid rgba(200,200,204,0.2)', borderRadius: 2, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5F5F0', transition: 'all 0.3s' }}
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
  const isMobile = useIsMobile()

  const reset = () => { setStep(1); setMode(null); setTransfer({ passengers: 1, luggage: 0 }); setDisposal({ duration: 4 }); setTier(FLEET[1]); setPassenger({}); setRef(null) }

  const showScene = step === 3

  return (
    <div style={{ minHeight: '100dvh', background: '#050507', display: 'flex', flexDirection: 'column', position: 'relative', overflow: isMobile ? 'auto' : 'hidden' }}>
      <ProgressBar step={step} total={5} />

      {/* Header */}
      <div style={{ padding: isMobile ? '14px 16px' : '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 20, background: '#050507' }}>
        <a href="/" style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F5F5F0', textDecoration: 'none', fontWeight: 300 }}>PRYM</a>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.3)' }}>{step < 5 ? `${step} / 4` : 'Demande envoyée'}</p>
      </div>

      {/* Step 3 Mobile: full-width stacked layout */}
      {showScene && isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* 3D scene — top half */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ height: '45vw', minHeight: 220, maxHeight: 300, background: 'linear-gradient(135deg,#050507 0%,#080810 100%)', position: 'relative', flexShrink: 0 }}>
            <VehicleScene tier={tier} style={{ width: '100%', height: '100%' }} />
          </motion.div>
          {/* TierSelector */}
          <TierSelector selectedTier={tier} onSelect={setTier} />
          {/* Info panel — scrollable below */}
          <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgba(200,200,204,0.06)' }}>
            <Step3Vehicle selectedTier={tier} onNext={t => { setTier(t); setStep(4) }} onBack={() => setStep(2)} isMobile={true} />
          </div>
        </div>
      ) : showScene && !isMobile ? (
        /* Step 3 Desktop: side by side */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ flex: '1 1 55%', background: 'linear-gradient(135deg,#050507 0%,#080810 100%)', position: 'relative' }}>
            <VehicleScene tier={tier} style={{ width: '100%', height: '100%' }} />
          </motion.div>
          <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: '1px solid rgba(200,200,204,0.06)' }}>
            <Step3Vehicle selectedTier={tier} onNext={t => { setTier(t); setStep(4) }} onBack={() => setStep(2)} isMobile={false} />
            <TierSelector selectedTier={tier} onSelect={setTier} />
          </div>
        </div>
      ) : (
        /* All other steps */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><Step1Mode onSelect={m => { setMode(m); setStep(2) }} /></motion.div>}
            {step === 2 && mode === 'transfer' && <motion.div key="s2a" style={{ flex: 1 }}><Step2aTransfer data={transfer} onChange={setTransfer} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 2 && mode === 'disposal' && <motion.div key="s2b" style={{ flex: 1 }}><Step2bDisposal data={disposal} onChange={setDisposal} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 4 && <motion.div key="s4" style={{ flex: 1 }}><Step4Passenger data={passenger} onChange={setPassenger} onNext={() => { setRef(genRef()); setStep(5) }} onBack={() => setStep(3)} /></motion.div>}
            {step === 5 && <motion.div key="s5" style={{ flex: 1, display: 'flex', alignItems: 'center' }}><Step5Confirm reference={ref} mode={mode} tier={tier} passenger={passenger} onReset={reset} /></motion.div>}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
EOF

# ── Step1Mode.jsx ─────────────────────────────────────────────────────────────
cat > "$BASE/components/booking/steps/Step1Mode.jsx" << 'EOF'
import { motion } from 'framer-motion'

function Card({ icon, title, subtitle, desc, onClick, delay }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      style={{ flex: '1 1 140px', minHeight: 150, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 2, padding: '20px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden', WebkitTapHighlightColor: 'transparent' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 1, background: 'rgba(200,200,204,0.4)' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: 20, background: 'rgba(200,200,204,0.4)' }} />
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 2 }}>{title}</div>
        <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8C8CC', marginBottom: 8 }}>{subtitle}</div>
        <div style={{ fontSize: 11, color: 'rgba(200,200,204,0.5)', lineHeight: 1.6, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{desc}</div>
      </div>
      <div style={{ marginTop: 'auto', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.35)' }}>Sélectionner →</div>
    </motion.button>
  )
}

export default function Step1Mode({ onSelect }) {
  return (
    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px,5vw,48px) clamp(14px,4vw,32px)', gap: 10, boxSizing: 'border-box' }}>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', textAlign: 'center', marginBottom: 4 }}>
        Type de service
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 'clamp(16px,5vw,28px)', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 20, textAlign: 'center', fontWeight: 300 }}>
        Quelle est votre demande ?
      </motion.h2>
      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 560, flexWrap: 'wrap' }}>
        <Card icon="→" title="Transfert" subtitle="Point à point" desc="Aéroport, gare, hôtel. Un trajet défini, une prise en charge précise." onClick={() => onSelect('transfer')} delay={0.2} />
        <Card icon="◎" title="Mise à disposition" subtitle="À partir de 2h" desc="Votre chauffeur et véhicule, dédiés entièrement à votre agenda." onClick={() => onSelect('disposal')} delay={0.3} />
      </div>
    </div>
  )
}
EOF

echo ""
echo "✅ Fix mobile appliqué"
