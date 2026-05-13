import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../../context/LanguageContext'
import { T } from '../../../i18n/translations'

const IS = {
  width: '100%',
  background: 'var(--c-pill-bg)',
  border: '1px solid var(--c-border-faint)',
  borderRadius: 0,
  padding: '14px 16px',
  color: 'var(--c-text)',
  fontFamily: '"Eurostile","Arial Narrow",sans-serif',
  fontSize: 12,
  letterSpacing: '0.08em',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

function LS({ isAR }) {
  return {
    fontFamily: '"Eurostile","Arial Narrow",sans-serif',
    fontSize: 9,
    letterSpacing: isAR ? '0.02em' : '0.3em',
    textTransform: isAR ? 'none' : 'uppercase',
    color: 'var(--c-silver2)',
    marginBottom: 6,
    display: 'block',
  }
}

function eyebrow(n, isAR) {
  return (
    <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', marginBottom: 8 }}>
      {n}
    </p>
  )
}

function h2el(t, isAR) {
  return (
    <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 20, letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', fontWeight: 300, marginBottom: 32 }}>
      {t}
    </h2>
  )
}

function BackNext({ onBack, onNext, valid, backLabel, nextLabel }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
      <button onClick={onBack} style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'var(--c-silver2)' }}>{backLabel}</button>
      <button onClick={onNext} disabled={!valid} style={{ flex: 1, padding: 14, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'var(--c-pill-bg)' : 'transparent', border: `1px solid ${valid ? 'var(--c-pill-border)' : 'var(--c-border-faint)'}`, borderRadius: 0, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: valid ? 'var(--c-text)' : 'var(--c-silver3)', transition: 'all 0.3s' }}>{nextLabel}</button>
    </div>
  )
}

export function Step2aTransfer({ data, onChange, onNext, onBack }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step2Transfer
  const isAR = lang === 'AR'
  const [f, setF] = useState(null)
  const set = k => e => onChange({ ...data, [k]: e.target.value })
  const valid = data.from && data.to && data.date && data.time

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%', direction: isAR ? 'rtl' : 'ltr' }}>
      {eyebrow(tb.eyebrow, isAR)}{h2el(tb.h2, isAR)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={LS({ isAR })}>{tb.from}</label>
          <input style={{ ...IS, borderColor: f === 'from' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.fromPh} value={data.from || ''} onChange={set('from')} onFocus={() => setF('from')} onBlur={() => setF(null)} />
        </div>
        <div>
          <label style={LS({ isAR })}>{tb.to}</label>
          <input style={{ ...IS, borderColor: f === 'to' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.toPh} value={data.to || ''} onChange={set('to')} onFocus={() => setF('to')} onBlur={() => setF(null)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={LS({ isAR })}>{tb.date}</label>
            <input type="date" style={{ ...IS, borderColor: f === 'date' ? 'var(--c-pill-border)' : 'var(--c-border-faint)' }} value={data.date || ''} onChange={set('date')} onFocus={() => setF('date')} onBlur={() => setF(null)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label style={LS({ isAR })}>{tb.time}</label>
            <input type="time" style={{ ...IS, borderColor: f === 'time' ? 'var(--c-pill-border)' : 'var(--c-border-faint)' }} value={data.time || ''} onChange={set('time')} onFocus={() => setF('time')} onBlur={() => setF(null)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={LS({ isAR })}>{tb.passengers}</label>
            <select style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }} value={data.passengers || 1} onChange={set('passengers')}>
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} style={{ background: 'var(--c-bg)' }}>{tb.pax(n)}</option>)}
            </select>
          </div>
          <div>
            <label style={LS({ isAR })}>{tb.luggage}</label>
            <select style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }} value={data.luggage || 0} onChange={set('luggage')}>
              {[0,1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background: 'var(--c-bg)' }}>{tb.bag(n)}</option>)}
            </select>
          </div>
        </div>
      </div>
      <BackNext onBack={onBack} onNext={onNext} valid={valid} backLabel={tb.back} nextLabel={tb.next} />
    </motion.div>
  )
}

export function Step2bDisposal({ data, onChange, onNext, onBack }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step2Disposal
  const isAR = lang === 'AR'
  const [f, setF] = useState(null)
  const set = k => e => onChange({ ...data, [k]: e.target.value })
  const valid = data.location && data.date && data.time && data.duration

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%', direction: isAR ? 'rtl' : 'ltr' }}>
      {eyebrow(tb.eyebrow, isAR)}{h2el(tb.h2, isAR)}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={LS({ isAR })}>{tb.location}</label>
          <input style={{ ...IS, borderColor: f === 'loc' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.locationPh} value={data.location || ''} onChange={set('location')} onFocus={() => setF('loc')} onBlur={() => setF(null)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={LS({ isAR })}>{tb.date}</label>
            <input type="date" style={{ ...IS }} value={data.date || ''} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label style={LS({ isAR })}>{tb.startTime}</label>
            <input type="time" style={{ ...IS }} value={data.time || ''} onChange={set('time')} />
          </div>
        </div>
        <div>
          <label style={LS({ isAR })}>{tb.duration}</label>
          <select style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }} value={data.duration || ''} onChange={set('duration')}>
            <option value="" style={{ background: 'var(--c-bg)' }}>{tb.durationPh}</option>
            {tb.durations.map(([v, l]) => <option key={v} value={v} style={{ background: 'var(--c-bg)' }}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={LS({ isAR })}>{tb.notes}</label>
          <textarea style={{ ...IS, minHeight: 80, resize: 'vertical', lineHeight: 1.6, textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.notesPh} value={data.notes || ''} onChange={set('notes')} />
        </div>
      </div>
      <BackNext onBack={onBack} onNext={onNext} valid={valid} backLabel={tb.back} nextLabel={tb.next} />
    </motion.div>
  )
}
