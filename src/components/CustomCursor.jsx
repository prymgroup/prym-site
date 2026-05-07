/**
 * CustomCursor — quiet-luxury cursor with mix-blend-difference.
 *
 * • Pure white 16×16 circle (w-4 h-4 rounded-full bg-white)
 * • mix-blend-difference: acts as a negative lens — inverts whatever
 *   text or background sits beneath the cursor circle.
 * • rAF loop with lerp drives the transform directly on the DOM node —
 *   zero React re-renders, zero virtual-DOM diffing, GPU-composited only.
 * • Completely disabled on touch/pointer:coarse devices so the system
 *   cursor is fully restored and no phantom element floats on screen.
 */

import { useEffect, useRef, useState } from 'react'

const HALF = 8      // half of w-4 (16px) — used to center the dot on the pointer
const LERP = 0.18   // interpolation factor — higher = snappier, lower = more trailing

export default function CustomCursor() {
  const elRef = useRef(null)

  // Lazy-initialise once: checks pointer type before first render so
  // touch devices never receive the cursor element at all — no flash.
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  )

  useEffect(() => {
    if (isTouch) return

    let rafId
    let targetX  = -100
    let targetY  = -100
    let currentX = -100
    let currentY = -100

    // Passive listener — never blocks the main thread scroll pipeline
    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const tick = () => {
      // Lerp: smooth trailing without noticeable lag at LERP = 0.18
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP

      // Direct DOM mutation — bypasses React reconciler entirely
      if (elRef.current) {
        elRef.current.style.transform =
          `translate(${currentX - HALF}px, ${currentY - HALF}px)`
      }

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [isTouch])

  // Touch devices: render nothing — restores the native system cursor
  if (isTouch) return null

  return (
    <div
      ref={elRef}
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999]"
      style={{
        mixBlendMode : 'difference',
        willChange   : 'transform',
        // Start well offscreen so it never flashes at (0, 0)
        transform    : `translate(${-HALF - 100}px, ${-HALF - 100}px)`,
      }}
    />
  )
}
