import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Autocomplete } from '@react-google-maps/api'
import { useLanguage } from '../../../context/LanguageContext'
import { T } from '../../../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

// ── Shared input style ────────────────────────────────────────────────────────
const IS = {
  width: '100%',
  background: 'var(--c-bg)',
  border: 'none',
  borderBottom: '1px solid var(--c-silver3)',
  borderRadius: 0,
  padding: '12px 0',
  color: 'var(--c-text)',
  fontFamily: FONT_EU,
  fontSize: 12,
  letterSpacing: '0.08em',
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

// Active (focused) border override
const IS_FOCUS = { borderColor: 'var(--c-text)' }

function LS(isAR) {
  return {
    fontFamily: FONT_EU,
    fontSize: 9,
    letterSpacing: isAR ? '0.02em' : '0.3em',
    textTransform: isAR ? 'none' : 'uppercase',
    color: 'var(--c-silver3)',
    marginBottom: 8,
    display: 'block',
  }
}

function eyebrow(n, isAR) {
  return (
    <p style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: isAR ? '0.02em' : '0.3em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-silver3)', marginBottom: 8 }}>
      {n}
    </p>
  )
}

function h2el(t, isAR) {
  return (
    <h2 style={{ fontFamily: FONT_EU, fontSize: 20, letterSpacing: isAR ? '0.02em' : '0.1em', textTransform: isAR ? 'none' : 'uppercase', color: 'var(--c-text)', fontWeight: 300, marginBottom: 32 }}>
      {t}
    </h2>
  )
}

function BackNext({ onBack, onNext, valid, backLabel, nextLabel }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
      <button
        onClick={onBack}
        style={{ ...IS, borderBottom: '1px solid var(--c-silver3)', width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'var(--c-silver3)' }}
      >
        {backLabel}
      </button>
      <button
        onClick={onNext}
        disabled={!valid}
        style={{
          flex: 1, padding: 14,
          cursor: valid ? 'pointer' : 'not-allowed',
          background: 'transparent',
          border: `1px solid ${valid ? 'var(--c-text)' : 'var(--c-silver3)'}`,
          borderRadius: 0,
          fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: valid ? 'var(--c-text)' : 'var(--c-silver3)',
          transition: 'all 0.3s',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ── PlaceInput — Autocomplete wrapper with plain-input fallback ───────────────
// When isLoaded=false (API key missing or not yet ready) it renders a plain
// <input> so the form always stays functional.
function PlaceInput({ isLoaded, value, onTextChange, onPlaceSelect, placeholder, focused, onFocus, onBlur, isAR }) {
  const acRef = useRef(null)

  const handlePlaceChanged = () => {
    if (!acRef.current) return
    const place = acRef.current.getPlace()
    if (!place) return
    const address = place.formatted_address || place.name || ''
    const lat = place.geometry?.location?.lat() ?? null
    const lng = place.geometry?.location?.lng() ?? null
    onPlaceSelect(address, lat, lng)
  }

  const inputEl = (
    <input
      value={value}
      onChange={e => onTextChange(e.target.value)}
      placeholder={placeholder}
      autoComplete="off"
      style={{
        ...IS,
        ...(focused ? IS_FOCUS : {}),
        textAlign: isAR ? 'right' : 'left',
        direction: isAR ? 'rtl' : 'ltr',
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  )

  if (!isLoaded) return inputEl

  return (
    <Autocomplete
      onLoad={ref => { acRef.current = ref }}
      onPlaceChanged={handlePlaceChanged}
      options={{ componentRestrictions: { country: 'ma' }, fields: ['formatted_address', 'geometry', 'name'] }}
    >
      {inputEl}
    </Autocomplete>
  )
}

// ── Step 2a — Transfer ────────────────────────────────────────────────────────
export function Step2aTransfer({ data, onChange, onNext, onBack, isLoaded }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step2Transfer
  const isAR = lang === 'AR'
  const [focused, setFocused] = useState(null)

  // Typed-text fallback when user edits without picking a suggestion
  const setField = (key, address, lat = null, lng = null) => {
    onChange({ ...data, [key]: address, [`${key}Coords`]: lat !== null ? { lat, lng } : null })
  }

  const valid = data.from && data.to && data.date && data.time

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%', direction: isAR ? 'rtl' : 'ltr' }}
    >
      {eyebrow(tb.eyebrow, isAR)}
      {h2el(tb.h2, isAR)}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Lieu de départ */}
        <div>
          <label style={LS(isAR)}>{tb.from}</label>
          <PlaceInput
            isLoaded={isLoaded}
            value={data.from || ''}
            onTextChange={v => setField('from', v)}
            onPlaceSelect={(addr, lat, lng) => setField('from', addr, lat, lng)}
            placeholder={tb.fromPh}
            focused={focused === 'from'}
            onFocus={() => setFocused('from')}
            onBlur={() => setFocused(null)}
            isAR={isAR}
          />
        </div>

        {/* Destination */}
        <div>
          <label style={LS(isAR)}>{tb.to}</label>
          <PlaceInput
            isLoaded={isLoaded}
            value={data.to || ''}
            onTextChange={v => setField('to', v)}
            onPlaceSelect={(addr, lat, lng) => setField('to', addr, lat, lng)}
            placeholder={tb.toPh}
            focused={focused === 'to'}
            onFocus={() => setFocused('to')}
            onBlur={() => setFocused(null)}
            isAR={isAR}
          />
        </div>

        {/* Date / Heure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LS(isAR)}>{tb.date}</label>
            <input
              type="date"
              style={{ ...IS, ...(focused === 'date' ? IS_FOCUS : {}) }}
              value={data.date || ''}
              onChange={e => onChange({ ...data, date: e.target.value })}
              onFocus={() => setFocused('date')}
              onBlur={() => setFocused(null)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label style={LS(isAR)}>{tb.time}</label>
            <input
              type="time"
              style={{ ...IS, ...(focused === 'time' ? IS_FOCUS : {}) }}
              value={data.time || ''}
              onChange={e => onChange({ ...data, time: e.target.value })}
              onFocus={() => setFocused('time')}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>

        {/* Passagers / Bagages */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LS(isAR)}>{tb.passengers}</label>
            <select
              style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }}
              value={data.passengers || 1}
              onChange={e => onChange({ ...data, passengers: e.target.value })}
            >
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} style={{ background: 'var(--c-bg)' }}>{tb.pax(n)}</option>)}
            </select>
          </div>
          <div>
            <label style={LS(isAR)}>{tb.luggage}</label>
            <select
              style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }}
              value={data.luggage || 0}
              onChange={e => onChange({ ...data, luggage: e.target.value })}
            >
              {[0,1,2,3,4,5,6].map(n => <option key={n} value={n} style={{ background: 'var(--c-bg)' }}>{tb.bag(n)}</option>)}
            </select>
          </div>
        </div>
      </div>

      <BackNext onBack={onBack} onNext={onNext} valid={valid} backLabel={tb.back} nextLabel={tb.next} />
    </motion.div>
  )
}

// ── Step 2b — Mise à disposition ──────────────────────────────────────────────
export function Step2bDisposal({ data, onChange, onNext, onBack, isLoaded }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step2Disposal
  const isAR = lang === 'AR'
  const [focused, setFocused] = useState(null)

  const setLocation = (address, lat = null, lng = null) => {
    onChange({ ...data, location: address, locationCoords: lat !== null ? { lat, lng } : null })
  }

  const valid = data.location && data.date && data.time && data.duration

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%', direction: isAR ? 'rtl' : 'ltr' }}
    >
      {eyebrow(tb.eyebrow, isAR)}
      {h2el(tb.h2, isAR)}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Lieu */}
        <div>
          <label style={LS(isAR)}>{tb.location}</label>
          <PlaceInput
            isLoaded={isLoaded}
            value={data.location || ''}
            onTextChange={v => setLocation(v)}
            onPlaceSelect={(addr, lat, lng) => setLocation(addr, lat, lng)}
            placeholder={tb.locationPh}
            focused={focused === 'loc'}
            onFocus={() => setFocused('loc')}
            onBlur={() => setFocused(null)}
            isAR={isAR}
          />
        </div>

        {/* Date / Heure */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LS(isAR)}>{tb.date}</label>
            <input
              type="date"
              style={{ ...IS }}
              value={data.date || ''}
              onChange={e => onChange({ ...data, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label style={LS(isAR)}>{tb.startTime}</label>
            <input
              type="time"
              style={{ ...IS }}
              value={data.time || ''}
              onChange={e => onChange({ ...data, time: e.target.value })}
            />
          </div>
        </div>

        {/* Durée */}
        <div>
          <label style={LS(isAR)}>{tb.duration}</label>
          <select
            style={{ ...IS, cursor: 'pointer', direction: isAR ? 'rtl' : 'ltr' }}
            value={data.duration || ''}
            onChange={e => onChange({ ...data, duration: e.target.value })}
          >
            <option value="" style={{ background: 'var(--c-bg)' }}>{tb.durationPh}</option>
            {tb.durations.map(([v, l]) => <option key={v} value={v} style={{ background: 'var(--c-bg)' }}>{l}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={LS(isAR)}>{tb.notes}</label>
          <textarea
            style={{ ...IS, minHeight: 80, resize: 'vertical', lineHeight: 1.6, textAlign: isAR ? 'right' : 'left', direction: isAR ? 'rtl' : 'ltr' }}
            placeholder={tb.notesPh}
            value={data.notes || ''}
            onChange={e => onChange({ ...data, notes: e.target.value })}
          />
        </div>
      </div>

      <BackNext onBack={onBack} onNext={onNext} valid={valid} backLabel={tb.back} nextLabel={tb.next} />
    </motion.div>
  )
}
