import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const FONT_EU = '"Eurostile", "Russo One", "Helvetica Neue", Arial, sans-serif'
const FONT_SE = 'Georgia, "Times New Roman", serif'

// ── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:      '#0a0a0a',
  bg2:     '#0e0e0f',
  silver:  '#c6c6c6',
  silver2: '#706f6f',
  silver3: '#3c3c3b',
  white:   '#f6f6f6',
  dim:     'rgba(198,198,198,0.35)',
}

// ── Thin horizontal rule ─────────────────────────────────────────────────────
function Rule({ style }) {
  return (
    <div style={{
      width: '100%', height: '1px',
      background: `linear-gradient(90deg, transparent, ${C.silver3}, transparent)`,
      ...style,
    }} />
  )
}

// ── Section counter ───────────────────────────────────────────────────────────
function Counter({ n }) {
  return (
    <span style={{
      fontFamily: FONT_EU, fontSize: '10px', letterSpacing: '0.3em',
      color: C.silver3, display: 'block', marginBottom: '32px',
    }}>
      {String(n).padStart(2, '0')} —
    </span>
  )
}

// ── Protocol block ────────────────────────────────────────────────────────────
function Block({ n, label, title, body, accent, reverse, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        padding: 'clamp(60px, 8vw, 120px) clamp(24px, 6vw, 80px)',
        borderBottom: `1px solid ${C.silver3}22`,
        background: accent ? C.bg2 : C.bg,
      }}
    >
      {/* Text side */}
      <div style={{ order: reverse ? 2 : 1 }}>
        <Counter n={n} />
        {label && (
          <p style={{
            fontFamily: FONT_EU, fontSize: '9px', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: C.silver2, marginBottom: '16px',
          }}>
            {label}
          </p>
        )}
        <h2 style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: 'clamp(22px, 3.5vw, 36px)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: C.white, marginBottom: '24px', lineHeight: 1.15,
        }}>
          {title}
        </h2>
        <Rule style={{ marginBottom: '28px', width: '60px', background: C.silver3 }} />
        <p style={{
          fontFamily: FONT_SE, fontStyle: 'italic',
          fontSize: 'clamp(13px, 1.6vw, 16px)',
          color: C.silver2, lineHeight: 1.9, maxWidth: '460px',
        }}>
          {body}
        </p>
      </div>

      {/* Visual / detail side */}
      {children && (
        <div style={{ order: reverse ? 1 : 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </motion.section>
  )
}

// ── Detail card ───────────────────────────────────────────────────────────────
function DetailCard({ icon, label, value }) {
  return (
    <div style={{
      border: `1px solid ${C.silver3}55`,
      padding: '28px 24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '1px', background: C.silver2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '20px', background: C.silver2 }} />
      <span style={{ fontSize: '18px' }}>{icon}</span>
      <span style={{ fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.25em', textTransform: 'uppercase', color: C.silver3 }}>
        {label}
      </span>
      <span style={{ fontFamily: FONT_SE, fontStyle: 'italic', fontSize: '13px', color: C.silver2, lineHeight: 1.6 }}>
        {value}
      </span>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)',
      textAlign: 'center', position: 'relative',
      background: `radial-gradient(ellipse at 50% 60%, #141416 0%, ${C.bg} 70%)`,
    }}>
      {/* Decorative lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(60,60,59,0.08) 80px)',
      }} />

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{
          fontFamily: FONT_EU, fontSize: '9px', letterSpacing: '0.45em',
          textTransform: 'uppercase', color: C.silver3, marginBottom: '32px',
        }}
      >
        Le Protocole Silencieux
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: FONT_EU, fontWeight: 300,
          fontSize: 'clamp(32px, 6vw, 72px)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C.white, lineHeight: 1.05, marginBottom: '32px',
          maxWidth: '900px',
        }}
      >
        Plus qu'un trajet.
        <br />
        <span style={{ color: C.silver }}>Une transition parfaite.</span>
      </motion.h1>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '80px', height: '1px',
          background: `linear-gradient(90deg, transparent, ${C.silver}, transparent)`,
          margin: '0 auto 32px',
        }}
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{
          fontFamily: FONT_SE, fontStyle: 'italic',
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: C.silver2, lineHeight: 1.8, maxWidth: '560px',
        }}
      >
        Chaque détail est orchestré avant votre arrivée.
        Chaque geste, chaque silence, chaque sensation —
        tout est pensé pour que vous n'ayez qu'à être.
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: 'absolute', bottom: '48px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}
      >
        <span style={{ fontFamily: FONT_EU, fontSize: '7px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.silver3 }}>
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{ width: '1px', height: '32px', background: `linear-gradient(180deg, ${C.silver3}, transparent)` }}
        />
      </motion.div>
    </section>
  )
}

// ── Signature olfactive visual ────────────────────────────────────────────────
function OlfactifVisual() {
  return (
    <div style={{
      width: '100%', maxWidth: '280px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {['Cèdre de l\'Atlas', 'Cuir nubuck', 'Ambre blanc', 'Vétiver'].map((note, i) => (
        <motion.div
          key={note}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.6 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
          }}
        >
          <div style={{
            height: '1px',
            width: `${70 - i * 12}px`,
            background: `linear-gradient(90deg, ${C.silver}, transparent)`,
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: FONT_SE, fontStyle: 'italic',
            fontSize: '12px', color: C.silver2, letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}>
            {note}
          </span>
        </motion.div>
      ))}
      <p style={{
        fontFamily: FONT_EU, fontSize: '7px', letterSpacing: '0.3em',
        textTransform: 'uppercase', color: C.silver3, marginTop: '8px',
      }}>
        Accord exclusif — PRYM
      </p>
    </div>
  )
}

// ── Temperature visual ────────────────────────────────────────────────────────
function TempVisual() {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'inline-flex', flexDirection: 'column',
          alignItems: 'center', gap: '4px',
          border: `1px solid ${C.silver3}44`,
          padding: '32px 40px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '16px', height: '1px', background: C.silver2 }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '16px', background: C.silver2 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '1px', background: C.silver2 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '1px', height: '16px', background: C.silver2 }} />

        <span style={{ fontFamily: FONT_EU, fontSize: '52px', letterSpacing: '-0.02em', color: C.white, lineHeight: 1 }}>
          21°
        </span>
        <span style={{ fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.4em', textTransform: 'uppercase', color: C.silver3 }}>
          Température standard
        </span>
        <Rule style={{ width: '40px', margin: '12px 0', background: C.silver3 }} />
        <span style={{ fontFamily: FONT_SE, fontStyle: 'italic', fontSize: '11px', color: C.silver3 }}>
          Ajustable sur demande
        </span>
      </motion.div>
    </div>
  )
}

// ── NDA visual ────────────────────────────────────────────────────────────────
function NDAVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      style={{
        border: `1px solid ${C.silver3}33`,
        padding: '32px',
        maxWidth: '300px',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '1px', background: C.silver2 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '24px', background: C.silver2 }} />

      <p style={{
        fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.35em',
        textTransform: 'uppercase', color: C.silver3, marginBottom: '16px',
      }}>
        Accord de confidentialité
      </p>
      {['Conversations', 'Destinations', 'Identité', 'Habitudes'].map((item, i) => (
        <div key={item} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 0',
          borderBottom: i < 3 ? `1px solid ${C.silver3}22` : 'none',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', border: `1px solid ${C.silver3}`, flexShrink: 0 }} />
          <span style={{ fontFamily: FONT_SE, fontStyle: 'italic', fontSize: '12px', color: C.silver2 }}>
            {item}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: FONT_EU, fontSize: '7px', letterSpacing: '0.2em', color: C.silver3 }}>
            PROTÉGÉ
          </span>
        </div>
      ))}
    </motion.div>
  )
}

// ── Ponctuality visual ────────────────────────────────────────────────────────
function PonctualiteVisual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', width: '100%' }}>
      {[
        { label: 'Chauffeur en route', time: '-30 min', active: false },
        { label: 'Notification envoyée', time: '-15 min', active: false },
        { label: 'Chauffeur sur place', time: '-5 min', active: true },
        { label: 'Prise en charge', time: '00:00', active: false },
      ].map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
            background: step.active ? C.silver : 'transparent',
            border: `1px solid ${step.active ? C.silver : C.silver3}`,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              height: '1px',
              background: step.active
                ? `linear-gradient(90deg, ${C.silver}, transparent)`
                : `${C.silver3}44`,
            }} />
          </div>
          <span style={{
            fontFamily: FONT_SE, fontStyle: 'italic', fontSize: '11px',
            color: step.active ? C.silver : C.silver3,
            whiteSpace: 'nowrap',
          }}>
            {step.label}
          </span>
          <span style={{
            fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.15em',
            color: step.active ? C.white : C.silver3,
            minWidth: '45px', textAlign: 'right',
          }}>
            {step.time}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

// ── Closing CTA ───────────────────────────────────────────────────────────────
function Closing() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      style={{
        padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px)',
        textAlign: 'center',
        background: `radial-gradient(ellipse at 50% 0%, #141416 0%, ${C.bg} 60%)`,
      }}
    >
      <p style={{
        fontFamily: FONT_EU, fontSize: '9px', letterSpacing: '0.45em',
        textTransform: 'uppercase', color: C.silver3, marginBottom: '24px',
      }}>
        Driven by Excellence
      </p>

      <h2 style={{
        fontFamily: FONT_EU, fontWeight: 300,
        fontSize: 'clamp(24px, 4vw, 48px)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: C.white, marginBottom: '20px', lineHeight: 1.1,
      }}>
        Le standard n'a pas changé.
        <br />
        <span style={{ color: C.silver }}>Nous l'avons perfectionné.</span>
      </h2>

      <p style={{
        fontFamily: FONT_SE, fontStyle: 'italic',
        fontSize: 'clamp(13px, 1.6vw, 16px)',
        color: C.silver2, lineHeight: 1.9, maxWidth: '480px',
        margin: '0 auto 48px',
      }}>
        L'hospitalité est notre héritage.
        La précision est notre métier.
        PRYM — Né au Maroc, pour le monde.
      </p>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="/reserver"
          style={{
            fontFamily: FONT_EU, fontSize: '10px', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: C.bg,
            background: C.silver, border: 'none',
            padding: '16px 40px', cursor: 'pointer',
            textDecoration: 'none', display: 'inline-block',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.target.style.background = C.white }}
          onMouseLeave={e => { e.target.style.background = C.silver }}
        >
          Demander un trajet
        </a>
        <a
          href="/flotte"
          style={{
            fontFamily: FONT_EU, fontSize: '10px', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: C.silver,
            background: 'transparent',
            border: `1px solid ${C.silver3}`,
            padding: '16px 40px', cursor: 'pointer',
            textDecoration: 'none', display: 'inline-block',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.target.style.borderColor = C.silver }}
          onMouseLeave={e => { e.target.style.borderColor = C.silver3 }}
        >
          Découvrir la flotte
        </a>
      </div>
    </motion.section>
  )
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'L\'Expérience — PRYM Executive Transport'
  }, [])

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px clamp(24px, 6vw, 80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.silver3}22`,
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img
            src="/logos/logo-slogan-white.svg"
            alt="PRYM"
            style={{ height: '44px', opacity: 0.9 }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span style={{
            display: 'none',
            fontFamily: FONT_EU, fontSize: '13px', letterSpacing: '0.35em',
            textTransform: 'uppercase', color: C.white, fontWeight: 300,
          }}>PRYM</span>
        </a>
        <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 40px)', alignItems: 'center' }}>
          {[['La Flotte', '/flotte'], ['Entreprises', '/entreprises'], ['À propos', '/a-propos']].map(([label, href]) => (
            <a key={href} href={href} style={{
              fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.3em',
              textTransform: 'uppercase', color: C.silver3,
              textDecoration: 'none', transition: 'color 0.2s',
              display: window.innerWidth < 600 ? 'none' : 'block',
            }}
              onMouseEnter={e => e.target.style.color = C.silver}
              onMouseLeave={e => e.target.style.color = C.silver3}
            >
              {label}
            </a>
          ))}
          <a href="/reserver" style={{
            fontFamily: FONT_EU, fontSize: '8px', letterSpacing: '0.3em',
            textTransform: 'uppercase', color: C.bg,
            background: C.silver, padding: '10px 20px',
            textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = C.white}
            onMouseLeave={e => e.target.style.background = C.silver}
          >
            Réserver
          </a>
        </div>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: '0px' }}>
        <Hero />

        {/* 01 — La tenue */}
        <Block
          n={1}
          label="Le Chauffeur"
          title={"Le protocole\nde l'élégance"}
          body="Total black, toujours. Un pin argenté PRYM sur le col gauche — seul marqueur de la marque. Chemise noire en été, veste structurée en hiver. Le chauffeur n'est pas un accessoire. Il est le premier ambassadeur de votre expérience."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '280px' }}>
            {[
              { icon: '◈', label: 'Tenue', value: 'Total black\nSaisonnière' },
              { icon: '◈', label: 'Insigne', value: 'Pin PRYM argenté\nCol gauche uniquement' },
              { icon: '◈', label: 'Présentation', value: 'Vérifiée\nAvant chaque course' },
              { icon: '◈', label: 'Conduite', value: 'Silencieuse\nSi non sollicitée' },
            ].map(d => <DetailCard key={d.label} {...d} />)}
          </div>
        </Block>

        {/* 02 — La signature olfactive */}
        <Block
          n={2}
          label="L'Habitacle"
          title="La signature"
          body="Un accord olfactif exclusif. La même fragrance dans chaque véhicule PRYM — cèdre de l'Atlas, cuir nubuck, ambre blanc, vétiver. Vous la reconnaîtrez avant même de vous asseoir. Un repère sensoriel qui devient, avec le temps, synonyme de sérénité."
          accent
          reverse
        >
          <OlfactifVisual />
        </Block>

        {/* 03 — L'eau et l'Oshibori */}
        <Block
          n={3}
          label="L'Attention"
          title={"L'eau. La serviette.\nLe détail qui dit tout."}
          body="Eau minérale en verre — jamais en plastique. Une serviette Oshibori, froide en été, chaude en hiver, parfumée à la menthe et au citron. Des rituels empruntés aux grandes maisons hôtelières du monde, posés sur la banquette arrière d'une berline PRYM à Casablanca."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '260px' }}>
            {[
              { icon: '◇', label: 'Eau', value: 'En verre. Fraîche.\nJamais en plastique.' },
              { icon: '◇', label: 'Oshibori', value: 'Froide en été.\nChaude en hiver.\nParfumée menthe & citron.' },
            ].map(d => <DetailCard key={d.label} {...d} />)}
          </div>
        </Block>

        {/* 04 — Température */}
        <Block
          n={4}
          label="L'Environnement"
          title="21 degrés.\nNi plus, ni moins."
          body="La température de l'habitacle est réglée à 21°C avant votre embarquement. Ni trop fraîche, ni trop chaude — le seuil du confort absolu. Vous pouvez demander un ajustement. Nous préférons que vous n'ayez pas à le faire."
          accent
          reverse
        >
          <TempVisual />
        </Block>

        {/* 05 — NDA */}
        <Block
          n={5}
          label="La Discrétion"
          title="Ce qui se passe\ndans un PRYM."
          body="Chaque chauffeur signe un accord de confidentialité avant sa première course. Vos conversations, vos destinations, votre identité — rien ne sort de l'habitacle. Pas par politesse. Par contrat. La discrétion n'est pas une valeur chez PRYM. C'est une obligation légale."
        >
          <NDAVisual />
        </Block>

        {/* 06 — Ponctualité */}
        <Block
          n={6}
          label="La Ponctualité"
          title={"Chirurgicale.\nSans exception."}
          body="Le chauffeur arrive 5 minutes avant l'heure convenue. Toujours. Si un imprévu survient — embouteillage, incident — vous êtes prévenu avant même d'avoir vérifié votre téléphone. La ponctualité n'est pas un effort pour PRYM. C'est un standard non négociable."
          accent
          reverse
        >
          <PonctualiteVisual />
        </Block>

        {/* 07 — Mémoire client */}
        <Block
          n={7}
          label="La Personnalisation"
          title={"Votre chauffeur\nvous connaît."}
          body="Pour les clients réguliers, votre chauffeur mémorise vos préférences. L'itinéraire habituel. La radio ou le silence. Le niveau de climatisation. Votre place favorite. Vous n'avez pas à répéter deux fois ce qui vous convient. PRYM s'en souvient."
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '280px' }}>
            {[
              { icon: '◈', label: 'Itinéraire', value: 'Mémorisé dès\nla première course' },
              { icon: '◈', label: 'Ambiance', value: 'Musique, silence,\ntemperature' },
              { icon: '◈', label: 'Préférences', value: 'Enregistrées\nPour chaque trajet' },
              { icon: '◈', label: 'Accueil', value: 'Pancarte nominative\nSur demande' },
            ].map(d => <DetailCard key={d.label} {...d} />)}
          </div>
        </Block>

        <Closing />
      </div>
    </div>
  )
}
