import { motion } from 'framer-motion'
import { FLEET } from '../../data/fleet'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

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
    <div style={{ borderTop: '1px solid var(--c-border-faint)', background: 'var(--c-surface)', backdropFilter: 'blur(12px)' }}>
      <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FLEET.map(tier => {
          const active = selectedTier?.id === tier.id
          return (
            <motion.button key={tier.id} onClick={() => onSelect(tier)} whileTap={{ scale: 0.96 }}
              style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative', minWidth: 88 }}>
              <motion.div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg,transparent,var(--c-silver),transparent)' }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.3 }} />
              <div style={{ width: 50, height: 20, color: active ? 'var(--c-silver)' : 'var(--c-silver3)', transition: 'color 0.3s' }}>{ICONS[tier.id]}</div>
              <span style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: active ? 'var(--c-silver)' : 'var(--c-silver3)', transition: 'color 0.3s', whiteSpace: 'nowrap' }}>{tier.name.replace('PRYM ', '')}</span>
              <motion.div style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--c-silver)' }} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }} transition={{ duration: 0.2 }} />
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
