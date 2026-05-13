import { motion } from 'framer-motion'
import { useLanguage } from '../../../context/LanguageContext'
import { T } from '../../../i18n/translations'

const FONT_EU = FONT_EU
const FONT_SE = FONT_SE

function Card({ icon, title, subtitle, desc, selectLabel, onClick, delay, isAR }) {
  return (
    <motion.button onClick={onClick}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      style={{ flex: '1 1 140px', minHeight: 150, background: 'var(--c-pill-bg)', border: '1px solid var(--c-border-faint)', borderRadius: 0, padding: '20px 16px', cursor: 'pointer', textAlign: isAR ? 'right' : 'left', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden', WebkitTapHighlightColor: 'transparent', direction: isAR ? 'rtl' : 'ltr', transition: 'background 0.2s, border-color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-pill-border)'; e.currentTarget.style.background = 'var(--c-pill-bg-hover)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border-faint)'; e.currentTarget.style.background = 'var(--c-pill-bg)' }}>
      <div style={{ position: 'absolute', top: 0, [isAR ? 'right' : 'left']: 0, width: 20, height: 1, background: 'var(--c-silver3)' }} />
      <div style={{ position: 'absolute', top: 0, [isAR ? 'right' : 'left']: 0, width: 1, height: 20, background: 'var(--c-silver3)' }} />
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div>
        <div style={{ fontFamily: FONT_EU, fontSize: 11, letterSpacing: isAR ? '0.02em' : '0.2em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', marginBottom: 2 }}>{title}</div>
        <div style={{ fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.18em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver)', marginBottom: 8 }}>{subtitle}</div>
        <div style={{ fontSize: 11, color: 'var(--c-silver2)', lineHeight: 1.6, fontFamily: FONT_SE, fontStyle: 'italic' }}>{desc}</div>
      </div>
      <div style={{ marginTop: 'auto', fontFamily: FONT_EU, fontSize: 8, letterSpacing: isAR ? '0.02em' : '0.25em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)' }}>{selectLabel}</div>
    </motion.button>
  )
}

export default function Step1Mode({ onSelect }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step1
  const isAR = lang === 'AR'

  return (
    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(20px,5vw,48px) clamp(14px,4vw,32px)', gap: 10, boxSizing: 'border-box', direction: isAR ? 'rtl' : 'ltr' }}>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
        style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', marginBottom: 4 }}>
        {tb.eyebrow}
      </motion.p>
      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        style={{ fontFamily: FONT_EU, fontSize: 'clamp(16px,5vw,28px)', letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', marginBottom: 20, fontWeight: 300 }}>
        {tb.h2}
      </motion.h2>
      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 560, flexWrap: 'wrap' }}>
        <Card icon="→" title={tb.transfer.title} subtitle={tb.transfer.subtitle} desc={tb.transfer.desc} selectLabel={tb.select} onClick={() => onSelect('transfer')} delay={0.2} isAR={isAR} />
        <Card icon="◎" title={tb.disposal.title} subtitle={tb.disposal.subtitle} desc={tb.disposal.desc} selectLabel={tb.select} onClick={() => onSelect('disposal')} delay={0.3} isAR={isAR} />
      </div>
    </div>
  )
}
