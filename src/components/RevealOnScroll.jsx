/**
 * RevealOnScroll — mobile-optimised, accessibility-first scroll-reveal wrapper.
 *
 * • Shorter translate on mobile (translate-y-4) vs desktop (md:translate-y-10)
 * • Faster on mobile: duration-700 / md:duration-[1200ms]
 * • motion-safe: ALL animation classes are gated behind Tailwind's
 *   `motion-safe:` modifier — users with prefers-reduced-motion get an
 *   instant appearance with zero slide or fade delay.
 * • IntersectionObserver threshold: 0.1 so elements fire as soon as
 *   10 % of the element enters the mobile viewport.
 *
 * Props:
 *   delay    {number}  – stagger delay in seconds (default 0)
 *   once     {boolean} – fire once and stay (default true)
 *   style    {object}  – forwarded to the wrapper div
 *   className {string} – merged into the wrapper div's className
 */

import { useEffect, useRef, useState } from 'react'

export default function RevealOnScroll({
  children,
  delay     = 0,
  once      = true,
  style,
  className = '',
}) {
  const ref              = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '-60px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const classes = [
    // ── Opacity ─────────────────────────────────────────────────────────────
    visible ? 'opacity-100' : 'opacity-0',

    // ── Translate — mobile: 4 (1rem) · desktop: 10 (2.5rem) ─────────────────
    // Gated behind motion-safe: so reduced-motion users see no layout shift
    visible
      ? 'motion-safe:translate-y-0'
      : 'motion-safe:translate-y-4 motion-safe:md:translate-y-10',

    // ── Transition — motion-safe only ────────────────────────────────────────
    'motion-safe:transition-all',
    'motion-safe:duration-700',             // mobile: 700 ms
    'motion-safe:md:duration-[1200ms]',     // desktop: 1200 ms
    'motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]',

    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classes}
      style={{
        ...style,
        // transitionDelay is a no-op when motion-safe: suppresses the transition,
        // so reduced-motion users are unaffected by this property.
        transitionDelay: delay ? `${delay}s` : undefined,
      }}
    >
      {children}
    </div>
  )
}
