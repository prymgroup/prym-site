import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

function WordReveal({ text, lang, delay = 0 }) {
  const [ref, inView] = useInView(0.3)
  const words = text.split(' ')
  const isAR = lang === 'AR'

  return (
    <p ref={ref} aria-label={text}
      style={{
        margin: 0, fontFamily: FONT, fontWeight: 400,
        fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
        letterSpacing: isAR ? '0.04em' : '0.18em',
        textTransform: isAR ? 'none' : 'uppercase',
        color: '#f6f6f6', lineHeight: 1.1,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.35em',
        direction: isAR ? 'rtl' : 'ltr',
      }}
    >
      {words.map((word, i) => (
        <motion.span key={i} aria-hidden
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 22, filter: 'blur(8px)' }}
          transition={{ duration: 1.4, delay: delay + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default function ManifestoSection() {
  const { lang } = useLanguage()
  const t = T[lang].teasing
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const y          = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60])
  const opacity    = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0])
  const blurVal    = useTransform(scrollYProgress, [0, 0.18, 0.72, 1], [14, 0, 0, 14])
  const blurFilter = useTransform(blurVal, v => `blur(${v}px)`)

  return (
    <section ref={sectionRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(1.5rem, 6vw, 5rem)', backgroundColor: '#0a0a0a', position: 'relative',
    }}>
      <motion.div style={{ y, opacity, filter: blurFilter, textAlign: 'center', maxWidth: 1000, willChange: 'transform, opacity, filter' }}>
        <WordReveal text={t.manifesto} lang={lang} delay={0} />
      </motion.div>
    </section>
  )
}
