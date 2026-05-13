import { motion, AnimatePresence } from 'framer-motion'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

export default function VehicleSelector({ tier, selectedModel, onSelect }) {
  if (!tier?.models || tier.models.length <= 1) return null

  return (
    <AnimatePresence>
      <motion.div
        key={tier.id}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'var(--c-surface)',
          borderTop: '1px solid var(--c-border-faint)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <span style={{
            fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'var(--c-silver3)',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Véhicule
          </span>
          <div style={{ width: 1, height: 14, background: 'var(--c-border-faint)', flexShrink: 0 }} />
          {tier.models.map((model) => {
            const active = selectedModel?.name === model.name
            return (
              <motion.button
                key={model.name}
                onClick={() => onSelect(model)}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: active ? 'var(--c-pill-bg)' : 'transparent',
                  border: `1px solid ${active ? 'var(--c-silver3)' : 'var(--c-border-faint)'}`,
                  padding: '5px 14px', cursor: 'pointer',
                  fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: active ? 'var(--c-silver)' : 'var(--c-silver3)',
                  transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                  position: 'relative',
                }}
              >
                {active && (
                  <motion.div
                    layoutId="vehicle-active"
                    style={{
                      position: 'absolute', top: 0, left: '15%', right: '15%',
                      height: 1,
                      background: 'linear-gradient(90deg,transparent,var(--c-silver),transparent)',
                    }}
                  />
                )}
                {model.name}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
