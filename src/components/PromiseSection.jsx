import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

const LINES = [
  "L'exactitude des gestes.",
  'La justesse du silence.',
  'La précision du timing.',
]

function PromiseLine({ text, index }) {
  const [ref, inView] = useInView(0.4)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -18, filter: 'blur(6px)' }}
      animate={
        inView
          ? { opacity: 1, x: 0, filter: 'blur(0px)' }
          : { opacity: 0, x: -18, filter: 'blur(6px)' }
      }
      transition={{
        duration: 1.4,
        delay: index * 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.2em',
        willChange: 'transform, opacity, filter',
      }}
    >
      <span
        style={{
          fontFamily: FONT,
          fontSize: 'clamp(0.8rem, 1.6vw, 1.1rem)',
          color: '#3c3c3b',
          lineHeight: 1,
          flexShrink: 0,
          letterSpacing: '0.05em',
        }}
      >
        —
      </span>
      <p
        style={{
          margin: 0,
          fontFamily: FONT,
          fontWeight: 400,
          fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#c6c6c6',
          lineHeight: 1.4,
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}

export default function PromiseSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y      = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(2rem, 8vw, 8rem)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          y,
          opacity,
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1.8rem, 4vh, 3rem)',
          maxWidth: 720,
          width: '100%',
          willChange: 'transform, opacity',
        }}
      >
        {LINES.map((line, i) => (
          <PromiseLine key={i} text={line} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
