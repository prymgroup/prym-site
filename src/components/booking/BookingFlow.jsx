import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FLEET } from '../../data/fleet'
import VehicleScene from './VehicleScene'
import Step1Mode from './steps/Step1Mode'
import { Step2aTransfer, Step2bDisposal } from './steps/Step2Forms'
import { Step4Passenger, Step5Confirm } from './steps/Step4And5'
import MobileNavbar from '../MobileNavbar'
import { useLanguage } from '../../context/LanguageContext'
import { T } from '../../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const C = {
  bg: '#0a0a0a', silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b', white: '#f6f6f6',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

// ── Navs ─────────────────────────────────────────────────────────────────────

function DesktopNav({ step, cancelLabel, navLinks }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 64,
      padding: '0 clamp(24px,5vw,72px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.silver3}18`,
    }}>
      <a href="/" style={{ textDecoration: 'none' }}>
        <img src="/logos/logo-slogan-white.svg" alt="PRYM" style={{ height: 40, opacity: 0.9 }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
        <span style={{ display:'none', fontFamily:FONT_EU, fontSize:13, letterSpacing:'0.35em', textTransform:'uppercase', color:C.white, fontWeight:300 }}>PRYM</span>
      </a>

      <div style={{ display:'flex', gap:'clamp(20px,2.5vw,40px)', alignItems:'center' }}>
        {navLinks.map(([l,h]) => (
          <a key={h} href={h}
            style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3, textDecoration:'none', transition:'color 0.3s ease' }}
            onMouseEnter={e=>e.target.style.color=C.silver}
            onMouseLeave={e=>e.target.style.color=C.silver3}>{l}</a>
        ))}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', paddingLeft: 8, borderLeft: `1px solid ${C.silver3}33` }}>
          {[1,2,3,4].map(i => (
            <motion.div key={i}
              animate={{ background: i <= step ? 'rgba(198,198,198,0.55)' : 'rgba(60,60,59,0.35)' }}
              transition={{ duration: 0.4 }}
              style={{ width: 20, height: 1 }} />
          ))}
        </div>
      </div>

      <a href="/flotte"
        style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.white, border: `1px solid ${C.silver3}`, padding: '10px 24px', textDecoration: 'none', transition: 'all 0.4s ease' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = C.silver; e.currentTarget.style.background = 'rgba(198,198,198,0.06)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = C.silver3; e.currentTarget.style.background = 'transparent' }}>
        {cancelLabel}
      </a>
    </nav>
  )
}

// ── Tier pill ─────────────────────────────────────────────────────────────────
function TierPill({ tier, active, onClick, domRef }) {
  return (
    <motion.button ref={domRef} onClick={onClick} whileTap={{ scale: 0.97 }}
      style={{
        background: active ? 'rgba(198,198,198,0.08)' : 'transparent',
        border: `1px solid ${active ? C.silver3 : C.silver3+'44'}`,
        padding: '8px 14px', cursor: 'pointer',
        fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.25em',
        textTransform: 'uppercase', color: active ? C.silver : C.silver3,
        transition: 'all 0.3s', whiteSpace: 'nowrap', flexShrink: 0, position: 'relative',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.silver2; e.currentTarget.style.borderColor = C.silver3 } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.silver3; e.currentTarget.style.borderColor = `${C.silver3}44` } }}>
      {active && (
        <motion.div layoutId="pill-booking"
          style={{ position:'absolute', top:0, left:'15%', right:'15%', height:1, background:`linear-gradient(90deg,transparent,${C.silver},transparent)` }} />
      )}
      {tier.name.replace('PRYM ', '')}
    </motion.button>
  )
}

// ── Chevron ───────────────────────────────────────────────────────────────────
function Chevron({ direction, onClick }) {
  return (
    <motion.button onClick={onClick} whileHover={{ opacity: 1 }} whileTap={{ opacity: 0.4 }}
      style={{
        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
        [direction === 'left' ? 'left' : 'right']: 16,
        zIndex: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 18,
        color: 'rgba(198,198,198,0.4)', opacity: 0.4, transition: 'opacity 0.4s',
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

// ── Step 3 — Vehicle ──────────────────────────────────────────────────────────
function Step3Vehicle({ tier, activeTier, setActiveTier, selectedModel, onPrev, onNext, canNavigate, onBack, onSelect, isMobile, tb }) {
  const vehicleLabel = selectedModel?.name || tier.vehicles?.[0] || ''
  const currentModelPath = selectedModel?.modelPath || tier.modelPath
  const hasModel = !!currentModelPath
  const pillRefs = useRef({})

  useEffect(() => {
    const el = pillRefs.current[activeTier.id]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeTier.id])

  // Mobile layout
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* 3D canvas */}
        <div style={{
          position: 'relative',
          height: 'calc(100vh - 260px)', minHeight: 260,
          background: `radial-gradient(ellipse at 40% 50%, #141416 0%, ${C.bg} 70%)`,
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 55%, rgba(10,10,10,0.55) 100%)' }} />
          {hasModel && <VehicleScene tier={{ ...tier, modelPath: currentModelPath }} />}
          {canNavigate && (
            <>
              <Chevron direction="left" onClick={onPrev} />
              <Chevron direction="right" onClick={onNext} />
            </>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={vehicleLabel} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
              style={{ position:'absolute', bottom:16, left:20, zIndex:2, pointerEvents:'none', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0' }}>
              {vehicleLabel.toUpperCase()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tier pills */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', scrollbarWidth:'none', padding:'14px 20px', borderBottom:`1px solid ${C.silver3}22`, flexShrink:0 }}>
          {FLEET.map(t => (
            <TierPill key={t.id} tier={t} active={activeTier.id===t.id} onClick={() => setActiveTier(t)}
              domRef={el => { pillRefs.current[t.id] = el }} />
          ))}
        </div>

        {/* Info */}
        <div style={{ padding:'20px 20px 32px', overflowY:'auto' }}>
          <AnimatePresence mode="wait">
            <motion.h2 key={tier.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.3}}
              style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:22, letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:20, lineHeight:1.05 }}>
              {tier.name}
            </motion.h2>
          </AnimatePresence>
          <div style={{ width:32, height:1, background:`linear-gradient(90deg,${C.silver3},transparent)`, marginBottom:20 }} />
          <div style={{ display:'flex', gap:28, marginBottom:20 }}>
            {[{label: tb.passengers, value:tier.capacity?.passengers ?? '—'},{label: tb.luggage, value:tier.capacity?.luggage ?? '—'}].map(({label,value}) => (
              <div key={label}>
                <p style={{ fontFamily:FONT_EU, fontSize:22, color:C.white, lineHeight:1, marginBottom:4 }}>{value}</p>
                <p style={{ fontFamily:FONT_EU, fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>{label}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
            {(tier.amenities ?? []).map(a => (
              <span key={a} style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase', color:C.silver2 }}>{a}</span>
            ))}
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={onBack}
              style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:C.silver3, background:'none', border:`1px solid ${C.silver3}44`, padding:'12px 16px', cursor:'pointer' }}>
              {tb.back}
            </button>
            <button onClick={() => onSelect(tier)}
              style={{ flex:1, fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:C.white, background:'rgba(198,198,198,0.08)', border:`1px solid ${C.silver3}`, padding:'12px 20px', cursor:'pointer', transition:'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(198,198,198,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(198,198,198,0.08)' }}>
              {tb.selectShort}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop layout — asymmetric 32/68
  return (
    <div style={{ display:'grid', gridTemplateColumns:'32% 68%', height:'calc(100vh - 64px)', overflow:'hidden' }}>
      {/* Left info */}
      <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 48px 48px 64px', borderRight:`1px solid ${C.silver3}18`, overflowY:'auto', scrollbarWidth:'none' }}>
        <motion.div initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:40 }}>
            {FLEET.map(t => <TierPill key={t.id} tier={t} active={activeTier.id===t.id} onClick={() => setActiveTier(t)} />)}
          </div>

          <AnimatePresence mode="wait">
            <motion.h2 key={tier.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.35}}
              style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(24px,2.5vw,42px)', letterSpacing:'0.08em', textTransform:'uppercase', color:C.white, marginBottom:12, lineHeight:1.0 }}>
              {tier.name}
            </motion.h2>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p key={vehicleLabel} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
              style={{ fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0', marginBottom:32 }}>
              {vehicleLabel.toUpperCase()}
            </motion.p>
          </AnimatePresence>

          <div style={{ width:36, height:1, background:`linear-gradient(90deg,${C.silver3},transparent)`, marginBottom:32 }} />

          <div style={{ display:'flex', gap:36, marginBottom:32 }}>
            {[{label: tb.passengers, value:tier.capacity?.passengers ?? '—'},{label: tb.luggage, value:tier.capacity?.luggage ?? '—'}].map(({label,value}) => (
              <div key={label}>
                <p style={{ fontFamily:FONT_EU, fontSize:'clamp(24px,2.2vw,36px)', letterSpacing:'0.04em', color:C.white, lineHeight:1, marginBottom:5 }}>{value}</p>
                <p style={{ fontFamily:FONT_EU, fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3 }}>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11, marginBottom:44 }}>
            {(tier.amenities ?? []).map(a => (
              <span key={a}
                style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:C.silver2, opacity:0.55, transition:'opacity 0.4s', cursor:'default' }}
                onMouseEnter={e => e.currentTarget.style.opacity=1}
                onMouseLeave={e => e.currentTarget.style.opacity=0.55}>
                {a}
              </span>
            ))}
          </div>

          <div style={{ display:'flex', gap:12 }}>
            <button onClick={onBack}
              style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', color:C.silver3, background:'none', border:`1px solid ${C.silver3}44`, padding:'14px 20px', cursor:'pointer', transition:'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.silver3; e.currentTarget.style.color=C.silver2 }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=`${C.silver3}44`; e.currentTarget.style.color=C.silver3 }}>
              {tb.back}
            </button>
            <button onClick={() => onSelect(tier)}
              style={{ flex:1, fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.28em', textTransform:'uppercase', color:C.silver, background:'transparent', border:`1px solid ${C.silver3}`, padding:'14px 24px', cursor:'pointer', transition:'all 0.4s' }}
              onMouseEnter={e => { e.currentTarget.style.background='#1A1A1A'; e.currentTarget.style.borderColor=C.silver2; e.currentTarget.style.color=C.white }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=C.silver3; e.currentTarget.style.color=C.silver }}>
              {tb.select}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right 3D */}
      <div style={{ position:'relative', background:`radial-gradient(ellipse at 60% 50%, #111114 0%, ${C.bg} 75%)`, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'linear-gradient(to right, rgba(10,10,10,0.15) 0%, transparent 18%, transparent 85%, rgba(10,10,10,0.3) 100%)' }} />
        <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse at 55% 50%, transparent 40%, rgba(10,10,10,0.45) 100%)' }} />
        {hasModel && <VehicleScene tier={{ ...tier, modelPath: currentModelPath }} />}
        {canNavigate && (
          <>
            <Chevron direction="left" onClick={onPrev} />
            <Chevron direction="right" onClick={onNext} />
          </>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={vehicleLabel} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.3}}
            style={{ position:'absolute', bottom:28, left:32, zIndex:2, pointerEvents:'none', fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'#E0E0E0' }}>
            {vehicleLabel.toUpperCase()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function genRef() {
  return `PRYM-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`
}

// ── Main flow ─────────────────────────────────────────────────────────────────
export default function BookingFlow() {
  const { lang } = useLanguage()
  const tn = T[lang].nav
  const tb3 = T[lang].booking.step3

  // Nav links for desktop booking nav
  const navLinks = [
    [T[lang].nav.experience, '/experience'],
    [T[lang].nav.entreprises, '/entreprises'],
    [T[lang].nav.apropos, '/a-propos'],
  ]

  // ── Read optional ?tier= param from URL ──────────────────────────────────
  const urlTierId = new URLSearchParams(window.location.search).get('tier')
  const urlTier   = urlTierId ? (FLEET.find(t => t.id === urlTierId) ?? null) : null

  const [step, setStep] = useState(1)
  const [mode, setMode] = useState(null)
  const [transfer, setTransfer] = useState({ passengers: 1, luggage: 0 })
  const [disposal, setDisposal] = useState({ duration: 4 })
  const [tier, setTier] = useState(urlTier ?? FLEET[1])
  const [modelIdx, setModelIdx] = useState(0)
  const [selectedModel, setSelectedModel] = useState((urlTier ?? FLEET[1]).models?.[0] || null)
  const [passenger, setPassenger] = useState({})
  const [ref, setRef] = useState(null)
  const isMobile = useIsMobile()

  const preselected = !!urlTier

  const reset = () => {
    setStep(1); setMode(null)
    setTransfer({ passengers:1, luggage:0 }); setDisposal({ duration:4 })
    setTier(urlTier ?? FLEET[1]); setModelIdx(0)
    setSelectedModel((urlTier ?? FLEET[1]).models?.[0]||null)
    setPassenger({}); setRef(null)
  }

  const handleTierSelect = (t) => {
    setTier(t); setModelIdx(0); setSelectedModel(t.models?.[0]||null)
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

  const navHeight = isMobile ? 48 : 64
  const showScene = step === 3

  return (
    <div style={{ minHeight:'100dvh', background:C.bg, color:C.white, display:'flex', flexDirection:'column', overflowX:'hidden' }}>
      {isMobile
        ? <MobileNavbar ctaLabel={tn.annuler} ctaHref="/flotte" />
        : <DesktopNav step={Math.min(step - 1, 4)} cancelLabel={tn.annuler} navLinks={navLinks} />
      }

      {/* Progress line */}
      <div style={{ position:'fixed', top:navHeight, left:0, right:0, height:1, background:`${C.silver3}33`, zIndex:90 }}>
        <motion.div style={{ height:'100%', background:'rgba(198,198,198,0.4)', transformOrigin:'left' }}
          animate={{ scaleX: step / 5 }} transition={{ duration:0.5, ease:[0.22,1,0.36,1] }} />
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', paddingTop: navHeight }}>
        {showScene ? (
          <Step3Vehicle
            tier={tier}
            activeTier={tier}
            setActiveTier={handleTierSelect}
            selectedModel={selectedModel}
            modelIdx={modelIdx}
            onPrev={prevModel}
            onNext={nextModel}
            canNavigate={tier.models?.length > 1}
            onBack={() => setStep(2)}
            onSelect={t => { setTier(t); setStep(4) }}
            isMobile={isMobile}
            tb={tb3}
          />
        ) : (
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflowY:'auto' }}>
            <AnimatePresence mode="wait">
              {step===1 && <motion.div key="s1" style={{flex:1,display:'flex',flexDirection:'column'}}><Step1Mode onSelect={m => { setMode(m); setStep(2) }} /></motion.div>}
              {step===2 && mode==='transfer' && <motion.div key="s2a" style={{flex:1}}><Step2aTransfer data={transfer} onChange={setTransfer} onNext={() => setStep(preselected ? 4 : 3)} onBack={() => setStep(1)} /></motion.div>}
              {step===2 && mode==='disposal' && <motion.div key="s2b" style={{flex:1}}><Step2bDisposal data={disposal} onChange={setDisposal} onNext={() => setStep(preselected ? 4 : 3)} onBack={() => setStep(1)} /></motion.div>}
              {step===4 && <motion.div key="s4" style={{flex:1}}><Step4Passenger data={passenger} onChange={setPassenger}
                onNext={async () => {
                  const r = genRef(); setRef(r)
                  try { await fetch('/api/reservation', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ mode, tier, transfer, disposal, passenger, reference: r }) }) } catch(e) { console.error(e) }
                  setStep(5)
                }}
                onBack={() => setStep(preselected ? 2 : 3)} /></motion.div>}
              {step===5 && <motion.div key="s5" style={{flex:1,display:'flex',alignItems:'center'}}><Step5Confirm reference={ref} mode={mode} tier={tier} passenger={passenger} onReset={reset} /></motion.div>}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
