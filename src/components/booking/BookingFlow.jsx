import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLEET } from '../../data/fleet'
import VehicleScene from './VehicleScene'
import TierSelector from './TierSelector'
import Step1Mode from './steps/Step1Mode'
import { Step2aTransfer, Step2bDisposal } from './steps/Step2Forms'
import { Step4Passenger, Step5Confirm } from './steps/Step4And5'

const FONT_EU = '"Eurostile","Arial Narrow",sans-serif'

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

function ChevronBtn({ direction, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ opacity: 0.4 }}
      style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: 16,
        zIndex: 10, background: 'none', border: 'none',
        cursor: 'pointer', padding: 16,
        color: 'rgba(198,198,198,0.3)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <svg width="10" height="20" viewBox="0 0 10 20" fill="none">
        {direction === 'left'
          ? <polyline points="8,1 2,10 8,19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          : <polyline points="2,1 8,10 2,19" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </motion.button>
  )
}

function Step3Vehicle({ selectedTier, onNext, onBack, isMobile }) {
  const tier = selectedTier || FLEET[1]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: isMobile ? 'auto' : 'visible' }}>
      <div style={{ padding: isMobile ? '24px 20px 16px' : '24px', borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tier.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <h2 style={{ fontFamily: FONT_EU, fontSize: isMobile ? 18 : 'clamp(18px,3.5vw,24px)', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 4, textAlign: 'left' }}>
              {tier.name}
            </h2>
            <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.35)', fontStyle: 'italic', marginBottom: isMobile ? 20 : 8, textAlign: 'left' }}>
              {tier.vehicles.join(' · ')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? '10px 18px' : 5, marginBottom: 8 }}>
              {tier.amenities.map(a => (
                isMobile ? (
                  <span key={a} style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.3)' }}>{a}</span>
                ) : (
                  <span key={a} style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 1, padding: '2px 6px' }}>{a}</span>
                )
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
              <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>{tier.capacity.passengers} passagers</span>
              <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,200,204,0.4)' }}>{tier.capacity.luggage} bagages</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ padding: isMobile ? '12px 20px' : '16px 24px', flexShrink: 0, display: 'flex', gap: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid rgba(200,200,204,0.1)', borderRadius: 2, padding: '12px 16px', cursor: 'pointer', fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)' }}>← Retour</button>
        <button onClick={() => onNext(tier)}
          style={{ flex: 1, padding: 12, cursor: 'pointer', background: 'rgba(200,200,204,0.08)', border: '1px solid rgba(200,200,204,0.2)', borderRadius: 2, fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#F5F5F0', transition: 'all 0.3s' }}
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
  const [modelIdx, setModelIdx] = useState(0)
  const [selectedModel, setSelectedModel] = useState(FLEET[1].models?.[0] || null)
  const [passenger, setPassenger] = useState({})
  const [ref, setRef] = useState(null)
  const isMobile = useIsMobile()

  const reset = () => {
    setStep(1); setMode(null)
    setTransfer({ passengers: 1, luggage: 0 }); setDisposal({ duration: 4 })
    setTier(FLEET[1]); setModelIdx(0); setSelectedModel(FLEET[1].models?.[0] || null)
    setPassenger({}); setRef(null)
  }

  const handleTierSelect = (t) => {
    setTier(t); setModelIdx(0); setSelectedModel(t.models?.[0] || null)
  }

  const prevModel = () => {
    if (!tier.models?.length) return
    const newIdx = (modelIdx - 1 + tier.models.length) % tier.models.length
    setModelIdx(newIdx); setSelectedModel(tier.models[newIdx])
  }

  const nextModel = () => {
    if (!tier.models?.length) return
    const newIdx = (modelIdx + 1) % tier.models.length
    setModelIdx(newIdx); setSelectedModel(tier.models[newIdx])
  }

  const showScene = step === 3
  const canNavigate = tier.models?.length > 1
  const vehicleLabel = selectedModel?.name || tier.vehicles?.[0] || ''

  return (
    <div style={{ minHeight: '100dvh', background: '#050507', display: 'flex', flexDirection: 'column', position: 'relative', overflow: isMobile ? 'auto' : 'hidden' }}>
      <ProgressBar step={step} total={5} />

      {/* Header */}
      <div style={{ padding: isMobile ? '14px 16px' : '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(200,200,204,0.06)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 20, background: '#050507' }}>
        <a href="/" style={{ fontFamily: FONT_EU, fontSize: 13, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F5F5F0', textDecoration: 'none', fontWeight: 300 }}>PRYM</a>
      </div>

      {/* Step 3 Mobile */}
      {showScene && isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* 3D canvas with arrows */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ height: '40vh', minHeight: 260, maxHeight: 420, background: 'linear-gradient(135deg,#050507 0%,#080810 100%)', position: 'relative', flexShrink: 0 }}>
            <VehicleScene tier={{...tier, modelPath: selectedModel?.modelPath || tier.modelPath}} />
            {canNavigate && (
              <>
                <ChevronBtn direction="left" onClick={prevModel} />
                <ChevronBtn direction="right" onClick={nextModel} />
              </>
            )}
            <div style={{
              position: 'absolute', bottom: 14, left: 20, zIndex: 2,
              pointerEvents: 'none', color: 'rgba(198,198,198,0.25)',
              fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em',
              textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>
              {vehicleLabel}
            </div>
          </motion.div>

          {/* Tier selector */}
          <TierSelector selectedTier={tier} onSelect={handleTierSelect} />

          {/* Info panel */}
          <div style={{ flex: 1, overflowY: 'auto', borderTop: '1px solid rgba(200,200,204,0.06)' }}>
            <Step3Vehicle selectedTier={tier} onNext={t => { setTier(t); setStep(4) }} onBack={() => setStep(2)} isMobile={true} />
          </div>
        </div>

      ) : showScene && !isMobile ? (
        /* Step 3 Desktop */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: 0 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
            style={{ flex: '1 1 55%', background: 'linear-gradient(135deg,#050507 0%,#080810 100%)', position: 'relative' }}>
            <VehicleScene tier={{...tier, modelPath: selectedModel?.modelPath || tier.modelPath}} />
          </motion.div>
          <div style={{ flex: '0 0 380px', display: 'flex', flexDirection: 'column', overflowY: 'auto', borderLeft: '1px solid rgba(200,200,204,0.06)' }}>
            <Step3Vehicle selectedTier={tier} onNext={t => { setTier(t); setStep(4) }} onBack={() => setStep(2)} isMobile={false} />
            <TierSelector selectedTier={tier} onSelect={handleTierSelect} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 18px 12px', borderTop: '1px solid rgba(200,200,204,0.06)' }}>
              {tier.models?.length > 1 && tier.models.map((model, i) => (
                <button key={model.name} onClick={() => { setModelIdx(i); setSelectedModel(model) }}
                  style={{
                    fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase',
                    padding: '5px 14px', cursor: 'pointer', transition: 'all 0.2s',
                    background: modelIdx === i ? 'rgba(200,200,204,0.08)' : 'transparent',
                    border: `1px solid ${modelIdx === i ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.08)'}`,
                    color: modelIdx === i ? '#C8C8CC' : 'rgba(200,200,204,0.35)',
                  }}>
                  {model.name}
                </button>
              ))}
            </div>
          </div>
        </div>

      ) : (
        /* All other steps */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="s1" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><Step1Mode onSelect={m => { setMode(m); setStep(2) }} /></motion.div>}
            {step === 2 && mode === 'transfer' && <motion.div key="s2a" style={{ flex: 1 }}><Step2aTransfer data={transfer} onChange={setTransfer} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 2 && mode === 'disposal' && <motion.div key="s2b" style={{ flex: 1 }}><Step2bDisposal data={disposal} onChange={setDisposal} onNext={() => setStep(3)} onBack={() => setStep(1)} /></motion.div>}
            {step === 4 && <motion.div key="s4" style={{ flex: 1 }}><Step4Passenger data={passenger} onChange={setPassenger} onNext={async () => { const r = genRef(); setRef(r); try { await fetch("/api/reservation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode, tier, transfer, disposal, passenger, reference: r }) }) } catch(e) { console.error(e) } setStep(5) }} onBack={() => setStep(3)} /></motion.div>}
            {step === 5 && <motion.div key="s5" style={{ flex: 1, display: 'flex', alignItems: 'center' }}><Step5Confirm reference={ref} mode={mode} tier={tier} passenger={passenger} onReset={reset} /></motion.div>}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
