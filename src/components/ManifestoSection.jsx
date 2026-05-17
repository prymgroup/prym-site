import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT = "'Eurostile', 'Russo One', 'Helvetica Neue', Arial, sans-serif"

function WordReveal({ text, lang, delay = 0 }) {
  const [ref, inView] = useInView(0.3)
  const isAR = lang === 'AR'

  /* Arabic: animate as a single block.
   * Splitting into individual <span>s breaks cursive connections, misplaces
   * sentence-final punctuation (the period binds to the wrong bidi boundary),
   * and staggers reveal left-to-right (wrong reading order for RTL). */
  if (isAR) {
    return (
      <motion.p ref={ref}
        className="tracking-normal"
        initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
        animate={inView
          ? { opacity: 1, y: 0,  filter: 'blur(0px)' }
          : { opacity: 0, y: 22, filter: 'blur(8px)' }}
        transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{
          margin: 0, fontWeight: 300,
          fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
          color: 'var(--c-text)', lineHeight: 1.2,
          textAlign: 'center',
          /* letterSpacing: 0 — explicit zero beats any inherited or
             Framer Motion-injected spacing that breaks Arabic ligatures */
          letterSpacing: 0,
          direction: 'rtl', unicodeBidi: 'plaintext',
          willChange: 'transform, opacity, filter',
        }}
      >
        {text}
      </motion.p>
    )
  }

  const words = text.split(' ')
  return (
    <p ref={ref} aria-label={text}
      style={{
        margin: 0, fontFamily: FONT, fontWeight: 300,
        fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--c-text)', lineHeight: 1.1,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.35em',
      }}
    >
      {words.map((word, i) => (
        <motion.span key={i} aria-hidden
          initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
          animate={inView
            ? { opacity: 1, y: 0,  filter: 'blur(0px)' }
            : { opacity: 0, y: 22, filter: 'blur(8px)' }}
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
  const t        = T[lang].teasing

  return (
    <section style={{
      height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 clamp(1.5rem, 6vw, 5rem)',
      backgroundColor: 'var(--c-bg)', position: 'relative',
      transition: 'background-color 0.3s ease',
      scrollSnapAlign: 'start', scrollSnapStop: 'always',
      direction: lang === 'AR' ? 'rtl' : 'ltr',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 1000 }}>
        <WordReveal text={t.manifesto} lang={lang} delay={0} />
      </div>
    </section>
  )
}
