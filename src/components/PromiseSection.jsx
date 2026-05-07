import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

function PromiseLine({ text, lang, index }) {
  const [ref, inView] = useInView(0.4)
  const isAR = lang === 'AR'

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: isAR ? 18 : -18, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : { opacity: 0, x: isAR ? 18 : -18, filter: 'blur(6px)' }}
      transition={{ duration: 1.4, delay: index * 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex', alignItems: 'center',
        flexDirection: isAR ? 'row-reverse' : 'row',
        gap: '1.2em', willChange: 'transform, opacity, filter',
      }}
    >
      <span style={{ fontFamily: FONT, fontSize: 'clamp(0.8rem, 1.6vw, 1.1rem)', color: '#3c3c3b', lineHeight: 1, flexShrink: 0, letterSpacing: '0.05em' }}>
        —
      </span>
      <p style={{
        margin: 0, fontFamily: FONT, fontWeight: 400,
        fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
        letterSpacing: isAR ? '0.03em' : '0.12em',
        textTransform: isAR ? 'none' : 'uppercase',
        color: '#c6c6c6', lineHeight: 1.4,
        direction: isAR ? 'rtl' : 'ltr',
      }}>
        {text}
      </p>
    </motion.div>
  )
}

export default function PromiseSection() {
  const { lang } = useLanguage()
  const t = T[lang].teasing
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const y      = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])

  return (
    <section ref={sectionRef} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(2rem, 8vw, 8rem)', backgroundColor: '#0a0a0a', position: 'relative',
    }}>
      <motion.div style={{
        y, opacity,
        display: 'flex', flexDirection: 'column', gap: 'clamp(1.8rem, 4vh, 3rem)',
        maxWidth: 720, width: '100%', willChange: 'transform, opacity',
      }}>
        {t.promise.map((line, i) => (
          <PromiseLine key={i} text={line} lang={lang} index={i} />
        ))}
      </motion.div>
    </section>
  )
}
