import { motion, AnimatePresence } from 'framer-motion'

const FONT_EU = '"Eurostile","Arial Narrow",sans-serif'

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
          background: 'rgba(5,5,7,0.85)',
          borderTop: '1px solid rgba(200,200,204,0.06)',
          overflow: 'hidden',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 18px', overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          <span style={{
            fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: 'rgba(200,200,204,0.3)',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Véhicule
          </span>
          <div style={{ width: 1, height: 14, background: 'rgba(200,200,204,0.1)', flexShrink: 0 }} />
          {tier.models.map((model) => {
            const active = selectedModel?.name === model.name
            return (
              <motion.button
                key={model.name}
                onClick={() => onSelect(model)}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: active ? 'rgba(200,200,204,0.08)' : 'transparent',
                  border: `1px solid ${active ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.08)'}`,
                  padding: '5px 14px', cursor: 'pointer',
                  fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: active ? '#C8C8CC' : 'rgba(200,200,204,0.35)',
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
                      background: 'linear-gradient(90deg,transparent,#C8C8CC,transparent)',
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
