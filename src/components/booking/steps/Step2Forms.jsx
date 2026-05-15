import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GoogleMap, Marker } from '@react-google-maps/api'
import { useLanguage } from '../../../context/LanguageContext'
import { useTheme } from '../../../context/ThemeContext'
import { T } from '../../../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

// Morocco center — default map position when no address is selected yet
const CASABLANCA = { lat: 33.5731, lng: -7.5898 }

// ── Sober dark map style ──────────────────────────────────────────────────────
// CSS variables can't be used inside Google Maps styles JSON; hex equivalents
// of the PRYM design tokens are used instead.
export const DARK_MAP_STYLE = [
  // Land — near-black
  { elementType: 'geometry',                                    stylers: [{ color: '#0e0e0d' }] },
  { elementType: 'labels.text.fill',                            stylers: [{ color: '#6B6867' }] },
  { elementType: 'labels.text.stroke',                          stylers: [{ color: '#0e0e0d' }] },
  // Roads — dark with silver-grey tones
  { featureType: 'road',           elementType: 'geometry',     stylers: [{ color: '#252523' }] },
  { featureType: 'road',           elementType: 'geometry.stroke', stylers: [{ color: '#181817' }] },
  { featureType: 'road',           elementType: 'labels.text.fill', stylers: [{ color: '#6B6867' }] },
  { featureType: 'road.highway',   elementType: 'geometry',     stylers: [{ color: '#3c3c3a' }] },
  { featureType: 'road.highway',   elementType: 'geometry.stroke', stylers: [{ color: '#2a2a28' }] },
  { featureType: 'road.highway',   elementType: 'labels.text.fill', stylers: [{ color: '#9A948F' }] },
  // Water — deepest black
  { featureType: 'water',          elementType: 'geometry',     stylers: [{ color: '#060606' }] },
  { featureType: 'water',          elementType: 'labels.text.fill', stylers: [{ color: '#2a2a28' }] },
  // Landscape
  { featureType: 'landscape',      elementType: 'geometry',     stylers: [{ color: '#111110' }] },
  // Administrative borders — subtle
  { featureType: 'administrative',                elementType: 'geometry.stroke', stylers: [{ color: '#2e2e2c' }] },
  { featureType: 'administrative.country',        elementType: 'geometry.stroke', stylers: [{ color: '#4a4a48' }] },
  { featureType: 'administrative.locality',       elementType: 'labels.text.fill', stylers: [{ color: '#9A948F' }] },
  // POIs — completely hidden
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  // Transit — completely hidden
  { featureType: 'transit',        stylers: [{ visibility: 'off' }] },
]

// ── Sober light map style — Silver/Paper aesthetic ───────────────────────────
export const LIGHT_MAP_STYLE = [
  // Land — warm paper white
  { elementType: 'geometry',                                       stylers: [{ color: '#f5f4f2' }] },
  { elementType: 'labels.text.fill',                               stylers: [{ color: '#8a8a88' }] },
  { elementType: 'labels.text.stroke',                             stylers: [{ color: '#f5f4f2' }] },
  // Roads — cool light grey
  { featureType: 'road',           elementType: 'geometry',        stylers: [{ color: '#e0dfdc' }] },
  { featureType: 'road',           elementType: 'geometry.stroke',  stylers: [{ color: '#d4d3d0' }] },
  { featureType: 'road',           elementType: 'labels.text.fill', stylers: [{ color: '#8a8a88' }] },
  { featureType: 'road.highway',   elementType: 'geometry',        stylers: [{ color: '#d1cfcc' }] },
  { featureType: 'road.highway',   elementType: 'geometry.stroke',  stylers: [{ color: '#c5c3c0' }] },
  { featureType: 'road.highway',   elementType: 'labels.text.fill', stylers: [{ color: '#6e6e6c' }] },
  // Water — soft grey
  { featureType: 'water',          elementType: 'geometry',        stylers: [{ color: '#e4e3e0' }] },
  { featureType: 'water',          elementType: 'labels.text.fill', stylers: [{ color: '#b0afad' }] },
  // Landscape — slightly warmer off-white
  { featureType: 'landscape',      elementType: 'geometry',        stylers: [{ color: '#edecea' }] },
  // Administrative borders — barely-there
  { featureType: 'administrative',           elementType: 'geometry.stroke', stylers: [{ color: '#d0cfcc' }] },
  { featureType: 'administrative.country',   elementType: 'geometry.stroke', stylers: [{ color: '#bcbbb8' }] },
  { featureType: 'administrative.locality',  elementType: 'labels.text.fill', stylers: [{ color: '#7a7a78' }] },
  // POIs — completely hidden
  { featureType: 'poi',            stylers: [{ visibility: 'off' }] },
  // Transit — completely hidden
  { featureType: 'transit',        stylers: [{ visibility: 'off' }] },
]

// ── Shared input style ────────────────────────────────────────────────────────
const IS = {
  width: '100%',
  background: 'var(--c-bg)',
  borderWidth: 0,
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderBottomColor: 'var(--c-silver3)',
  borderRadius: 0,
  padding: '12px 0',
  color: 'var(--c-text)',
  fontFamily: FONT_EU,
  fontSize: 12,
  letterSpacing: '0.08em',
  outline: 'none',
  transition: 'border-bottom-color 0.2s',
  boxSizing: 'border-box',
}

const IS_FOCUS = { borderBottomColor: 'var(--c-text)' }

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
        style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'var(--c-silver3)' }}
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
          borderWidth: 1, borderStyle: 'solid',
          borderColor: valid ? 'var(--c-text)' : 'var(--c-silver3)',
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

// ── DatePicker ────────────────────────────────────────────────────────────────
// Headless custom calendar — no external deps, zero border-radius,
// full PRYM design token compliance. API matches native <input type="date">:
// value = 'YYYY-MM-DD', onChange({ target: { value } }).
const MONTHS_FR = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE']
const DAYS_FR   = ['LU','MA','ME','JE','VE','SA','DI']

function DatePicker({ value, onChange, min, style }) {
  const parse     = (s) => s ? new Date(s + 'T12:00:00') : null
  const selected  = parse(value)
  const minDate   = parse(min)

  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const b = selected || new Date()
    return { y: b.getFullYear(), m: b.getMonth() }
  })
  const wrapRef = useRef(null)

  // Sync view to value when parent resets/changes it
  useEffect(() => {
    if (selected) setView({ y: selected.getFullYear(), m: selected.getMonth() })
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const prevMonth = () => setView(v => v.m === 0  ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })
  const nextMonth = () => setView(v => v.m === 11 ? { y: v.y + 1, m: 0  } : { y: v.y, m: v.m + 1 })

  const today       = new Date(); today.setHours(0, 0, 0, 0)
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const offset      = (new Date(view.y, view.m, 1).getDay() + 6) % 7 // Mon=0
  const cells       = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const handleDay = (d) => {
    const dt = new Date(view.y, view.m, d); dt.setHours(0, 0, 0, 0)
    if (minDate && dt < minDate) return
    const iso = `${view.y}-${String(view.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onChange({ target: { value: iso } })
    setOpen(false)
  }

  const display = selected
    ? `${String(selected.getDate()).padStart(2, '0')} ${MONTHS_FR[selected.getMonth()].slice(0, 3)} ${selected.getFullYear()}`
    : ''

  const navBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-silver3)', fontFamily: FONT_EU, fontSize: 16, lineHeight: 1, padding: '0 6px' }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <input
        readOnly
        value={display}
        placeholder="DATE"
        onClick={() => setOpen(v => !v)}
        style={{ ...style, cursor: 'pointer', caretColor: 'transparent' }}
      />

      {/* Calendar overlay */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          zIndex: 200,
          width: '100%', minWidth: 252,
          background: 'var(--c-bg)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c-silver3)', borderRadius: 0,
          padding: '14px 10px',
          boxShadow: 'none',
        }}>

          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <button type="button" onClick={prevMonth} style={navBtn}>‹</button>
            <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-text)', fontWeight: 300 }}>
              {MONTHS_FR[view.m]} {view.y}
            </span>
            <button type="button" onClick={nextMonth} style={navBtn}>›</button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAYS_FR.map(h => (
              <div key={h} style={{ fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.2em', textAlign: 'center', color: 'var(--c-silver3)', padding: '2px 0' }}>
                {h}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`_${i}`} />
              const dt       = new Date(view.y, view.m, day); dt.setHours(0, 0, 0, 0)
              const isSel    = selected && dt.getTime() === selected.getTime()
              const isToday  = dt.getTime() === today.getTime()
              const disabled = minDate ? dt < minDate : false
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDay(day)}
                  style={{
                    padding: '7px 0', textAlign: 'center', borderRadius: 0,
                    borderWidth: isToday && !isSel ? 1 : 0, borderStyle: 'solid', borderColor: 'var(--c-silver3)',
                    background: isSel ? 'var(--c-text)' : 'transparent',
                    color: isSel ? 'var(--c-bg)' : disabled ? 'var(--c-silver3)' : 'var(--c-text)',
                    fontFamily: FONT_EU, fontSize: 10,
                    cursor: disabled ? 'default' : 'pointer',
                    opacity: disabled ? 0.25 : 1,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isSel && !disabled) e.currentTarget.style.background = 'var(--c-surface)' }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent' }}
                >
                  {String(day).padStart(2, '0')}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── TimePicker ────────────────────────────────────────────────────────────────
// Two-column overlay (hours 00-23 · minutes 00/05/…/55). Selecting a minute
// fires onChange and closes. Selecting an hour updates value and stays open.
// API matches native <input type="time">: value='HH:MM', onChange({ target }).
const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00','05','10','15','20','25','30','35','40','45','50','55']

function TimePicker({ value, onChange, style }) {
  const [open, setOpen] = useState(false)
  const wrapRef  = useRef(null)
  const hRef     = useRef(null)
  const mRef     = useRef(null)

  const [selH, selM] = value ? value.split(':') : ['', '']

  // Outside-click closes
  useEffect(() => {
    if (!open) return
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  // Scroll selected row into view on open
  useEffect(() => {
    if (!open) return
    const scrollTo = (ref, val, list) => {
      if (!ref.current || !val) return
      const idx = list.indexOf(val)
      if (idx < 0) return
      const itemH = ref.current.scrollHeight / list.length
      ref.current.scrollTop = itemH * idx - (ref.current.clientHeight - itemH) / 2
    }
    setTimeout(() => { scrollTo(hRef, selH, HOURS); scrollTo(mRef, selM, MINUTES) }, 0)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const colStyle = { overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }
  const itemStyle = (isSel) => ({
    display: 'block', width: '100%', padding: '9px 0', textAlign: 'center',
    fontFamily: FONT_EU, fontSize: 11, letterSpacing: '0.08em',
    borderRadius: 0, border: 'none', cursor: 'pointer',
    background: isSel ? 'var(--c-text)' : 'transparent',
    color:      isSel ? 'var(--c-bg)'   : 'var(--c-text)',
    transition: 'background 0.12s',
  })

  const pickH = (h) => {
    onChange({ target: { value: `${h}:${selM || '00'}` } })
    // keep open so user can then pick minutes
  }
  const pickM = (m) => {
    onChange({ target: { value: `${selH || '00'}:${m}` } })
    setOpen(false)
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <input
        readOnly
        value={value || ''}
        placeholder="HH : MM"
        onClick={() => setOpen(v => !v)}
        style={{ ...style, cursor: 'pointer', caretColor: 'transparent' }}
      />

      {/* Overlay */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          zIndex: 200, width: '100%', minWidth: 160,
          background: 'var(--c-bg)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c-silver3)',
          borderRadius: 0, boxShadow: 'none', overflow: 'hidden',
        }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--c-silver3)' }}>
            {['HEURE','MIN'].map((l, i) => (
              <div key={l} style={{
                fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'var(--c-silver3)', padding: '7px 0', textAlign: 'center',
                borderRightWidth: i === 0 ? 1 : 0, borderRightStyle: 'solid', borderRightColor: 'var(--c-silver3)',
              }}>{l}</div>
            ))}
          </div>

          {/* Scrollable columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 200 }}>
            <div ref={hRef} style={{ ...colStyle, borderRightWidth: 1, borderRightStyle: 'solid', borderRightColor: 'var(--c-silver3)' }}>
              {HOURS.map(h => {
                const isSel = h === selH
                return (
                  <button key={h} type="button" onClick={() => pickH(h)} style={itemStyle(isSel)}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--c-surface)' }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent' }}>
                    {h}
                  </button>
                )
              })}
            </div>
            <div ref={mRef} style={colStyle}>
              {MINUTES.map(m => {
                const isSel = m === selM
                return (
                  <button key={m} type="button" onClick={() => pickM(m)} style={itemStyle(isSel)}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--c-surface)' }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent' }}>
                    {m}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── MapPicker ─────────────────────────────────────────────────────────────────
// Flow: click → drop pin + geocode → show confirmation bar → CONFIRMER closes.
function MapPicker({ isLoaded, center, onConfirm }) {
  const { isDark }                = useTheme()
  const [pin,       setPin]       = useState(null)   // { lat, lng }
  const [pending,   setPending]   = useState(null)   // { address, lat, lng }
  const [geocoding, setGeocoding] = useState(false)
  const geoRef                    = useRef(null)

  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      geoRef.current = new window.google.maps.Geocoder()
    }
  }, [isLoaded])

  const handleMapClick = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setPin({ lat, lng })
    setPending(null)
    setGeocoding(true)
    geoRef.current?.geocode({ location: { lat, lng } }, (results, status) => {
      const address = status === 'OK' && results[0] ? results[0].formatted_address : ''
      setPending({ address, lat, lng })
      setGeocoding(false)
    })
  }

  if (!isLoaded) return (
    <div style={{ height: 260, marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c-silver3)' }}>
      <span style={{ fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-silver3)' }}>
        CHARGEMENT
      </span>
    </div>
  )

  const ready = !!pending && !geocoding

  return (
    <div style={{ marginTop: 12, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c-silver3)', borderRadius: 0 }}>

      {/* Map canvas */}
      <div style={{ height: 260 }}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center || CASABLANCA}
          zoom={center ? 13 : 10}
          options={{
            styles: isDark ? DARK_MAP_STYLE : LIGHT_MAP_STYLE,
            disableDefaultUI: true,
            clickableIcons: false,
            gestureHandling: 'cooperative',
          }}
          onClick={handleMapClick}
        >
          {pin && (
            <Marker
              position={pin}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 7,
                fillColor:    isDark ? '#FDFBF7' : '#1a1a18',
                fillOpacity:  1,
                strokeColor:  isDark ? '#9A948F' : '#5a5a58',
                strokeWeight: 1.5,
              }}
            />
          )}
        </GoogleMap>
      </div>

      {/* Confirmation bar — visible once pin is dropped */}
      {pin && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px',
          borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--c-silver3)',
          background: 'var(--c-bg)',
        }}>
          {/* Geocoded address */}
          <span style={{
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: FONT_EU, fontSize: 10, letterSpacing: '0.05em',
            color: geocoding ? 'var(--c-silver3)' : 'var(--c-silver)',
          }}>
            {geocoding ? 'LOCALISATION…' : (pending?.address || '—')}
          </span>

          {/* Confirm button */}
          <button
            type="button"
            disabled={!ready}
            onClick={() => ready && onConfirm(pending.address, pending.lat, pending.lng)}
            style={{
              flexShrink: 0,
              fontFamily: FONT_EU, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase',
              padding: '8px 16px',
              borderWidth: 1, borderStyle: 'solid', borderRadius: 0,
              borderColor: ready ? 'var(--c-text)' : 'var(--c-silver3)',
              color:        ready ? 'var(--c-text)' : 'var(--c-silver3)',
              background: 'transparent',
              cursor: ready ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            CONFIRMER CE POINT
          </button>
        </div>
      )}
    </div>
  )
}

// ── PlaceInput ────────────────────────────────────────────────────────────────
function PlaceInput({ isLoaded, value, onTextChange, onPlaceSelect, placeholder, focused, onFocus, onBlur, isAR, coords }) {
  const [suggestions, setSuggestions] = useState([])
  const [isFocused, setIsFocused]     = useState(false)
  const [showMap, setShowMap]         = useState(false)
  const debounceRef                   = useRef(null)

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const fetchSuggestions = async (val) => {
    if (!val.trim() || !isLoaded) { setSuggestions([]); return }
    const AC = window.google?.maps?.places?.AutocompleteSuggestion
    if (!AC) { console.warn('AutocompleteSuggestion not available'); setSuggestions([]); return }
    try {
      const { suggestions: results } = await AC.fetchAutocompleteSuggestions({
        input: val,
        includedRegionCodes: ['MA'],
      })
      console.log('Google Predictions:', results)
      setSuggestions(results || [])
    } catch (err) {
      console.error('AutocompleteSuggestion error:', err)
      setSuggestions([])
    }
  }

  const handleChange = (val) => {
    onTextChange(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 250)
  }

  const handleSelect = async (suggestion) => {
    const pred = suggestion.placePrediction
    const displayText = pred.text.text
    onTextChange(displayText)
    setSuggestions([])
    setIsFocused(false)
    try {
      const place = pred.toPlace()
      await place.fetchFields({ fields: ['location', 'formattedAddress'] })
      onPlaceSelect(place.formattedAddress || displayText, place.location.lat(), place.location.lng())
    } catch {
      onPlaceSelect(displayText, null, null)
    }
  }

  const handleMapPick = (address, lat, lng) => {
    if (address) onTextChange(address)
    onPlaceSelect(address, lat, lng)
  }

  const showDropdown = isFocused && suggestions.length > 0

  return (
    <div>
      {/* Text input */}
      <div style={{ position: 'relative' }}>
        <input
          value={value}
          onChange={e => handleChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            ...IS,
            ...(focused ? IS_FOCUS : {}),
            textAlign: isAR ? 'right' : 'left',
            direction:  isAR ? 'rtl'   : 'ltr',
          }}
          onFocus={() => { onFocus(); setIsFocused(true) }}
          onBlur={() => { onBlur(); setTimeout(() => setIsFocused(false), 160) }}
        />
        {/* Autocomplete dropdown */}
        {showDropdown && (
          <div
            className="absolute z-50 w-full top-full mt-2 left-0 max-h-60 overflow-y-auto"
            style={{ background: 'var(--c-bg)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--c-silver3)' }}
          >
            {suggestions.map((s, i) => (
              <div
                key={s.placePrediction.placeId}
                onMouseDown={() => handleSelect(s)}
                style={{
                  padding: '10px 14px', cursor: 'pointer',
                  fontFamily: FONT_EU, fontSize: 11, letterSpacing: '0.05em', color: 'var(--c-text)',
                  borderTopWidth: i === 0 ? 0 : 1, borderTopStyle: 'solid', borderTopColor: 'var(--c-border-faint)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--c-surface)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {s.placePrediction.text.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map toggle */}
      <button
        type="button"
        onClick={() => setShowMap(!showMap)}
        className="text-[10px] text-stone-400 uppercase tracking-widest mt-2 flex items-center hover:text-[var(--c-text)] transition-colors"
      >
        {showMap ? '— FERMER LA CARTE' : '+ CHOISIR SUR LA CARTE'}
      </button>

      {/* Inline map picker */}
      {showMap && (
        <MapPicker
          isLoaded={isLoaded}
          center={coords || null}
          onConfirm={(address, lat, lng) => { handleMapPick(address, lat, lng); setShowMap(false) }}
        />
      )}
    </div>
  )
}

// ── Step 2a — Transfer ────────────────────────────────────────────────────────
export function Step2aTransfer({ data, onChange, onNext, onBack, isLoaded }) {
  const { lang } = useLanguage()
  const tb = T[lang].booking.step2Transfer
  const isAR = lang === 'AR'
  const [focused, setFocused] = useState(null)

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
            coords={data.fromCoords}
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
            coords={data.toCoords}
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
            <DatePicker
              value={data.date || ''}
              onChange={e => onChange({ ...data, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              style={{ ...IS, ...(focused === 'date' ? IS_FOCUS : {}) }}
            />
          </div>
          <div>
            <label style={LS(isAR)}>{tb.time}</label>
            <TimePicker
              value={data.time || ''}
              onChange={e => onChange({ ...data, time: e.target.value })}
              style={{ ...IS }}
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
            coords={data.locationCoords}
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
            <DatePicker
              value={data.date || ''}
              onChange={e => onChange({ ...data, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              style={{ ...IS }}
            />
          </div>
          <div>
            <label style={LS(isAR)}>{tb.startTime}</label>
            <TimePicker
              value={data.time || ''}
              onChange={e => onChange({ ...data, time: e.target.value })}
              style={{ ...IS }}
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
