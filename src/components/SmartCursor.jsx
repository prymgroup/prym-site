/**
 * SmartCursor — hardware-gated, zero-state custom cursor.
 *
 * Renders ONLY when ALL three capability checks pass at module-load time:
 *   A) pointer: fine      — real mouse/trackpad, never a touch device
 *   B) prefers-reduced-motion: no-preference — user allows animations
 *   C) hardwareConcurrency > 4 — at least 4 logical cores (avoids throttled/low-power devices)
 *
 * If ANY check fails → returns null instantly, system cursor untouched,
 * zero GPU overhead, zero JS event listeners registered.
 *
 * When all checks pass:
 *   • Single white 16×16 circle with mix-blend-difference (negative-lens effect)
 *   • mousemove handler writes translate3d directly to the DOM node —
 *     no useState, no re-renders, no React reconciler in the hot path
 *   • translate3d(x, y, 0) forces the element onto its own GPU compositor layer
 */

import { useEffect, useRef } from 'react'

// ── Capability gate — evaluated once at import, never re-evaluated ──────────
const CAPABLE =
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
  (navigator.hardwareConcurrency || 0) > 4

const HALF = 8  // half of w-4 (16 px) — centers the hot-spot on the circle

// ── Component ───────────────────────────────────────────────────────────────
export default function SmartCursor() {
  const elRef = useRef(null)

  useEffect(() => {
    // Guard is redundant (component already returns null when !CAPABLE)
    // but kept as a safety net if the component is ever reused elsewhere.
    if (!CAPABLE) return

    const el = elRef.current
    if (!el) return

    const onMove = ({ clientX: x, clientY: y }) => {
      // Synchronous direct DOM write — the only code that runs on every mousemove.
      // No state update, no vDOM diff, no scheduler, no batching delay.
      el.style.transform = `translate3d(${x - HALF}px,${y - HALF}px,0)`
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Failing any capability check: bail out completely
  if (!CAPABLE) return null

  return (
    <div
      ref={elRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999]"
      style={{
        mixBlendMode : 'difference',
        willChange   : 'transform',
        // Start well offscreen — no flash at (0, 0) before first mousemove
        transform    : `translate3d(${-HALF - 100}px,${-HALF - 100}px,0)`,
      }}
    />
  )
}
