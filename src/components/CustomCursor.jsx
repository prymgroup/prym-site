/**
 * CustomCursor — zero-lag, zero-state quiet-luxury cursor.
 *
 * • IS_TOUCH resolved at module-load time — no useState, no re-renders ever
 * • mousemove handler writes translate3d directly to the DOM node
 *   synchronously — no rAF buffer, no lerp, no React reconciler in the path
 * • translate3d(x, y, 0) forces GPU compositing on every browser
 * • mix-blend-difference: white circle acts as a negative lens over content
 * • Completely absent on touch/coarse-pointer devices — no element, no handler
 */

import { useEffect, useRef } from 'react'

// Evaluated once at import time — pointer capability never changes mid-session
const IS_TOUCH = typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches

const HALF = 8  // half of w-4 (16 px) — centers the dot on the hot-spot

export default function CustomCursor() {
  const elRef = useRef(null)

  useEffect(() => {
    if (IS_TOUCH) return
    const el = elRef.current
    if (!el) return

    // Passive: never blocks scroll or touch pipeline
    const onMove = ({ clientX: x, clientY: y }) => {
      // Single synchronous style write — bypasses React entirely
      el.style.transform = `translate3d(${x - HALF}px,${y - HALF}px,0)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Touch devices: no element, no event listener — system cursor untouched
  if (IS_TOUCH) return null

  return (
    <div
      ref={elRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999]"
      style={{
        mixBlendMode : 'difference',
        willChange   : 'transform',
        transform    : `translate3d(${-HALF - 100}px,${-HALF - 100}px,0)`,
      }}
    />
  )
}
