import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

function WordReveal({ text, lang, delay = 0 }) {
  const [ref, inView] = useInView(0.3)
  const words = text.split(' ')
  const isAR  = lang === 'AR'

  return (
    <p ref={ref} aria-label={text}
      style={{
        margin: 0, fontFamily: FONT, fontWeight: 400,
        fontSize: 'clamp(2.4rem, 7vw, 7.5rem)',
        letterSpacing: isAR ? '0.04em' : '0.15em',
        textTransform: isAR ? 'none' : 'uppercase',
        color: 'var(--c-text)', lineHeight: 1.05,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.32em',
        direction: isAR ? 'rtl' : 'ltr',
      }}
    >
      {words.map((word, i) => (
        <motion.span key={i} aria-hidden
          initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
          animate={inView
            ? { opacity: 1, y: 0,  filter: 'blur(0px)' }
            : { opacity: 0, y: 28, filter: 'blur(10px)' }}
          transition={{ duration: 1.5, delay: delay + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}

export default function ScrollSection() {
  const { lang } = useLanguage()
  const t        = T[lang].teasing

  return (
    <section style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(1.5rem, 6vw, 5rem)',
      backgroundColor: 'var(--c-bg)', position: 'relative',
      transition: 'background-color 0.3s ease',
      scrollSnapAlign: 'start', scrollSnapStop: 'always',
    }}>
      <div style={{ textAlign: 'center' }}>
        <WordReveal text={t.scroll_line} lang={lang} delay={0} />
      </div>
    </section>
  )
}
