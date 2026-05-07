/**
 * ScrambleText - signature PRYM text-scramble reveal.
 *
 * Phase 1 (0 to SCRAMBLE_MS):   every character cycles through random glyphs
 * Phase 2 (SCRAMBLE_MS to END): characters lock in left-to-right, one by one
 *
 * All animation runs through requestAnimationFrame with direct textContent
 * mutation - zero React re-renders, zero virtual-DOM diffing.
 *
 * Props:
 *   text      {string}  - target string to resolve to
 *   delay     {number}  - ms before the effect starts (default 0)
 *   tag       {string}  - wrapper element tag (default 'span')
 *   style / className   - forwarded to the wrapper element
 */

import { useEffect, useRef } from 'react'

// Glyph pool: uppercase alpha + numerals + geometric symbols
const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&x+'
const rand = () => POOL[Math.floor(Math.random() * POOL.length)]

// Characters preserved in-place so visual rhythm never breaks.
// Using unicode escapes to avoid any curly-quote / em-dash parser confusion.
const SKIP = new Set([
  ' ',
  ',',
  '.',
  "'",        // U+0027 apostrophe  (used in "D'ART")
  '\u2019',   // U+2019 right single quotation mark
  '\u2014',   // U+2014 em dash
  '/',
  '\n',
])

const SCRAMBLE_MS = 900   // pure scramble phase
const RESOLVE_MS  = 600   // progressive resolution phase
const FRAME_SKIP  = 3     // update scrambled glyphs every N rAF frames

export default function ScrambleText({
  text,
  delay    = 0,
  tag: Tag = 'span',
  style,
  className,
}) {
  const elRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    // Unicode-aware split so accented chars (E, E with accent...) are single entries
    const chars = [...text]
    const total = chars.length

    let rafId
    let timerId
    let frame = 0

    // Warm the scramble buffer so the first rendered frame has real random chars
    let lastScrambled = chars.map(c => (SKIP.has(c) ? c : rand()))

    const run = () => {
      const start = performance.now()

      const tick = (now) => {
        const elapsed      = now - start
        const resolveT     = Math.max(0, elapsed - SCRAMBLE_MS)
        const progress     = Math.min(resolveT / RESOLVE_MS, 1)
        const resolved     = Math.floor(progress * total)
        const updateGlyphs = frame % FRAME_SKIP === 0

        const display = chars.map((char, i) => {
          if (SKIP.has(char)) return char   // always preserve punctuation/spaces
          if (i < resolved)   return char   // settled to final value
          // Scramble: new random glyph every FRAME_SKIP frames, else hold last
          if (updateGlyphs) {
            const g = rand()
            lastScrambled[i] = g
            return g
          }
          return lastScrambled[i]
        })

        el.textContent = display.join('')
        frame++

        if (progress < 1) {
          rafId = requestAnimationFrame(tick)
        } else {
          el.textContent = text  // guarantee exact final string
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    timerId = setTimeout(run, delay)

    return () => {
      clearTimeout(timerId)
      cancelAnimationFrame(rafId)
    }
  }, [text, delay])

  // Render the real text as initial content - the parent h1 is opacity:0
  // during the scramble startup delay, so no unscrambled flash occurs.
  return (
    <Tag ref={elRef} style={style} className={className}>
      {text}
    </Tag>
  )
}
