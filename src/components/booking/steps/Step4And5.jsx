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

function lsStyle(isAR) {
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

export function Step4Passenger({ data, onChange, onNext, onBack }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step4
  const isAR = lang === 'AR'
  const [f, setF] = useState(null)
  const set = k => e => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; onChange({ ...data, [k]: v }) }
  const valid = data.name && data.phone && data.email && data.paymentMethod && data.consent

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%', direction: isAR ? 'rtl' : 'ltr' }}>
      <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', marginBottom: 8 }}>{tb.eyebrow}</p>
      <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 20, letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', fontWeight: 300, marginBottom: 32 }}>{tb.h2}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={lsStyle(isAR)}>{tb.name}</label>
          <input style={{ ...IS, borderColor: f === 'name' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.namePh} value={data.name || ''} onChange={set('name')} onFocus={() => setF('name')} onBlur={() => setF(null)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={lsStyle(isAR)}>{tb.phone}</label>
            <input type="tel" style={{ ...IS, borderColor: f === 'phone' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: 'ltr' }} placeholder="+212 6XX XXX XXX" value={data.phone || ''} onChange={set('phone')} onFocus={() => setF('phone')} onBlur={() => setF(null)} />
          </div>
          <div>
            <label style={lsStyle(isAR)}>{tb.email}</label>
            <input type="email" style={{ ...IS, borderColor: f === 'email' ? 'var(--c-pill-border)' : 'var(--c-border-faint)', textAlign: isAR ? 'right' : 'left', direction: 'ltr' }} placeholder="votre@email.com" value={data.email || ''} onChange={set('email')} onFocus={() => setF('email')} onBlur={() => setF(null)} />
          </div>
        </div>
        <div>
          <label style={lsStyle(isAR)}>{tb.requests}</label>
          <textarea style={{ ...IS, minHeight: 72, resize: 'vertical', lineHeight: 1.6, textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }} placeholder={tb.requestsPh} value={data.requests || ''} onChange={set('requests')} />
        </div>
        <div>
          <label style={{ ...lsStyle(isAR), marginBottom: 10 }}>{tb.payment}</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['online', tb.payOnline.label, tb.payOnline.sub], ['onsite', tb.payOnsite.label, tb.payOnsite.sub]].map(([v, l, s]) => (
              <button key={v} onClick={() => onChange({ ...data, paymentMethod: v })}
                style={{ flex: 1, padding: 12, textAlign: isAR ? 'right' : 'left', cursor: 'pointer', background: data.paymentMethod === v ? 'var(--c-pill-bg)' : 'transparent', border: `1px solid ${data.paymentMethod === v ? 'var(--c-pill-border)' : 'var(--c-border-faint)'}`, borderRadius: 0, transition: 'all 0.2s' }}>
                <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.15em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 10, color: 'var(--c-silver3)', fontFamily: '"Nexa","Nexa Light",sans-serif', fontStyle: 'italic' }}>{s}</div>
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', flexDirection: isAR ? 'row-reverse' : 'row' }}>
          <input type="checkbox" checked={data.consent || false} onChange={set('consent')} style={{ marginTop: 2, accentColor: 'var(--c-silver)', width: 14, height: 14, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'var(--c-silver2)', lineHeight: 1.6, fontFamily: '"Nexa","Nexa Light",sans-serif', fontStyle: 'italic' }}>{tb.consent}</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button onClick={onBack} style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'var(--c-silver2)' }}>{tb.back}</button>
        <button onClick={onNext} disabled={!valid}
          style={{ flex: 1, padding: 14, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'var(--c-pill-bg)' : 'transparent', border: `1px solid ${valid ? 'var(--c-pill-border)' : 'var(--c-border-faint)'}`, borderRadius: 0, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: valid ? 'var(--c-text)' : 'var(--c-silver3)', transition: 'all 0.3s' }}>
          {tb.confirm}
        </button>
      </div>
    </motion.div>
  )
}

export function Step5Confirm({ reference, mode, tier, passenger, onReset }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step5
  const isAR = lang === 'AR'
  const corners = [['top','left'],['top','right'],['bottom','left'],['bottom','right']]

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{ padding: '40px 24px', maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, direction: isAR ? 'rtl' : 'ltr' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ width: '100%', border: '1px solid var(--c-border-faint)', borderRadius: 0, padding: 32, position: 'relative', background: 'transparent' }}>
        {corners.map(([v,h]) => (
          <div key={`${v}${h}`} style={{ position: 'absolute', [v]: 0, [h]: 0, width: 16, height: 1, background: 'var(--c-silver)' }}>
            <div style={{ position: 'absolute', top: 0, [h]: 0, width: 1, height: 16, background: 'var(--c-silver)' }} />
          </div>
        ))}
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', marginBottom: 12 }}>{tb.refLabel}</p>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 22, letterSpacing: '0.15em', color: 'var(--c-text)', marginBottom: 24 }}>{reference}</p>
        <div style={{ borderTop: '1px solid var(--c-border-faint)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[[tb.service, mode === 'transfer' ? tb.transfer : tb.disposal],[tb.vehicle, tier?.name],[tb.contact, passenger?.name]].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.2em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)' }}>{k}</span>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.1em', color: 'var(--c-silver)' }}>{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ fontSize: 13, color: 'var(--c-silver2)', lineHeight: 1.8, fontFamily: '"Nexa","Nexa Light",sans-serif', fontStyle: 'italic', maxWidth: 360 }}>
        {tb.body} <span style={{ color: 'var(--c-silver)' }}>{tb.delay}</span> {tb.bodyEnd}
      </motion.p>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={onReset}
        style={{ background: 'none', border: '1px solid var(--c-border-faint)', borderRadius: 0, padding: '12px 24px', cursor: 'pointer', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-pill-border)'; e.currentTarget.style.color = 'var(--c-silver)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--c-border-faint)'; e.currentTarget.style.color = 'var(--c-silver3)' }}>
        {tb.newRequest}
      </motion.button>
    </motion.div>
  )
}
