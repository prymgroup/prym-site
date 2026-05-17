import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'

// SHA-256 of the access password — never stored as plaintext.
// To update the password: sha256sum <(echo -n 'newpassword') and update VITE_GATE_HASH.
const EXPECTED_HASH = import.meta.env.VITE_GATE_HASH || '9b1eba78db157841e45116dcce949d98bee45e4ab60696ff8d257fc8a8c8e816'
const STORAGE_KEY   = 'prym_auth_h' // stores the hash, never the raw secret

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function PasswordGate({ children }) {
  const [auth, setAuth]     = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === EXPECTED_HASH } catch { return false }
  })
  const [value, setValue]   = useState('')
  const [error, setError]   = useState(false)
  const [shake, setShake]   = useState(false)
  const inputRef            = useRef(null)

  useEffect(() => {
    if (!auth) setTimeout(() => inputRef.current?.focus(), 400)
  }, [auth])

  const submit = async () => {
    const hash = await sha256(value)
    if (hash === EXPECTED_HASH) {
      try { localStorage.setItem(STORAGE_KEY, EXPECTED_HASH) } catch { /* noop */ }
      setAuth(true)
    } else {
      setError(true)
      setShake(true)
      setValue('')
      setTimeout(() => setShake(false), 600)
      setTimeout(() => { setError(false); inputRef.current?.focus() }, 2200)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') submit()
    if (error) setError(false)
  }

  if (auth) return children

  return (
    <div style={{
      background: '#0a0a0a', /* intentionally dark-locked — pre-theme access gate */
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 48,
    }}>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/logos/logo-slogan-white.svg"
          alt="PRYM"
          style={{ height: 52, opacity: 0.85 }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <span style={{
          display: 'none',
          fontFamily: FONT_EU,
          fontSize: 13,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: '#c6c6c6',
          fontWeight: 300,
        }}>
          PRYM
        </span>
      </motion.div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: 220 }}
      >
        <motion.input
          ref={inputRef}
          type="password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKey}
          autoComplete="current-password"
          placeholder="••••••"
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${error ? 'var(--c-error)' : 'rgba(198,198,198,0.25)'}`,
            color: '#f6f6f6',
            textAlign: 'center',
            fontSize: 14,
            letterSpacing: '0.35em',
            padding: '10px 0',
            outline: 'none',
            fontFamily: FONT_EU,
            transition: 'border-color 0.3s',
            caretColor: 'rgba(198,198,198,0.6)',
          }}
        />

        <AnimatePresence>
          {error && (
            <motion.span
              key="err"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: FONT_EU,
                fontSize: 8,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--c-error)',
              }}
            >
              Accès refusé
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom watermark */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.6 }}
        style={{
          position: 'absolute',
          bottom: 32,
          fontFamily: FONT_EU,
          fontSize: 7,
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(198,198,198,0.18)',
        }}
      >
        Accès restreint — {new Date().getFullYear()}
      </motion.span>
    </div>
  )
}
