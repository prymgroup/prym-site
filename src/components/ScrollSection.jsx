import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

function WordReveal({ text, delay = 0 }) {
  const [ref, inView] = useInView(0.3)
  const words = text.split(' ')

  return (
    <p
      ref={ref}
      aria-label={text}
      style={{
        margin: 0,
        fontFamily: FONT,
        fontWeight: 400,
        fontSize: 'clamp(2.4rem, 7vw, 7.5rem)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#f6f6f6',
        lineHeight: 1.05,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 0.32em',
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={
            inView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 28, filter: 'blur(10px)' }
          }
          transition={{
            duration: 1.5,
            delay: delay + i * 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default function ScrollSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const y      = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70])
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.68, 1], [0, 1, 1, 0])
  const blurVal = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [16, 0, 0, 16])
  const blurFilter = useTransform(blurVal, v => `blur(${v}px)`)

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 clamp(1.5rem, 6vw, 5rem)',
        backgroundColor: '#0a0a0a',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          y,
          opacity,
          filter: blurFilter,
          textAlign: 'center',
          willChange: 'transform, opacity, filter',
        }}
      >
        <WordReveal text="Il s'exécute." delay={0} />
      </motion.div>
    </section>
  )
}
