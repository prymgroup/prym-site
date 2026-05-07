/**
 * RevealOnScroll — canonical quiet-luxury scroll-reveal wrapper.
 *
 * Animates only `opacity` and `transform: translateY` so the browser
 * compositor handles everything — guaranteed 60 fps, zero layout thrash.
 *
 * Props:
 *   delay    {number}  – seconds before the tween starts (use for stagger)
 *   y        {number}  – initial y-offset in px (default 24)
 *   duration {number}  – tween length in seconds (default 1.1)
 *   once     {boolean} – fire once and stay (default true)
 *   margin   {string}  – IntersectionObserver root margin (default '-60px')
 *   style    {object}  – forwarded to the motion.div wrapper
 *   className {string} – forwarded to the motion.div wrapper
 */

import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] // custom cubic-bezier — slow start, quick settle

export default function RevealOnScroll({
  children,
  delay    = 0,
  y        = 24,
  duration = 1.1,
  once     = true,
  margin   = '-60px',
  style,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, ease: EASE, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  )
}
