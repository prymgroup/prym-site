import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import { useIsMobile } from '../hooks/useIsMobile'
import { useLanguage } from '../context/LanguageContext'
import { T } from '../i18n/translations'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg:      'var(--c-bg)',
  silver:  'var(--c-silver)',
  silver2: 'var(--c-silver2)',
  silver3: 'var(--c-silver3)',
  white:   'var(--c-text)',
}

const GUTTER = 'clamp(40px,6vw,120px)'

// Base input style — letter-spacing will be overridden inline per isRTL
const IS_BASE = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--c-silver3)', borderRadius: 0,
  padding: '12px 0', color: 'var(--c-text)',
  outline: 'none', transition: 'border-bottom-color 0.25s', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none',
}

// Shared snap base
const SNAP = {
  height: '100dvh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
}

/* Label style — conditionally removes tracking + uppercase for Arabic */
function ls(isRTL) {
  return {
    fontFamily: FONT_EU,
    fontSize: isRTL ? 12 : 9,         // #4: larger for Arabic legibility
    letterSpacing: isRTL ? 0 : '0.3em',
    textTransform: isRTL ? 'none' : 'uppercase',
    color: 'var(--c-silver3)',
    marginBottom: 8, display: 'block',
  }
}

function ContactForm({ isMobile, tc, isRTL }) {
  const [form, setForm] = useState({
    company: '', name: '', role: '', email: '', phone: '',
    volume: '', besoins: [], message: '', consent: false,
  })
  const [focus, setFocus]   = useState(null)
  const [status, setStatus] = useState('idle')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggleBesoin = b => setForm(f => ({
    ...f,
    besoins: f.besoins.includes(b) ? f.besoins.filter(x => x !== b) : [...f.besoins, b],
  }))

  const valid  = form.company && form.name && form.email && form.phone && form.volume && form.consent

  const IS = {
    ...IS_BASE,
    fontFamily: FONT_EU,
    fontSize: isRTL ? 13 : 12,
    letterSpacing: isRTL ? 0 : '0.08em',
    textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr',
  }

  const focusStyle = k => ({ ...IS, borderBottomColor: focus === k ? 'var(--c-silver2)' : 'var(--c-silver3)' })

  const submit = async () => {
    if (!valid || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
        style={{ padding:'40px 0' }}>
        <div style={{ width:48, height:1, background:'var(--c-silver)', marginBottom:32 }} />
        <p style={{ fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9, letterSpacing: isRTL ? 0 : '0.4em', textTransform: isRTL ? 'none' : 'uppercase', color:'var(--c-silver3)', marginBottom:16 }}>
          {tc.success.eyebrow}
        </p>
        <h3 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(16px,1.8vw,24px)', letterSpacing: isRTL ? 0 : '0.14em', textTransform: isRTL ? 'none' : 'uppercase', color:'var(--c-text)', marginBottom:16, lineHeight: isRTL ? 1.5 : 1.2 }}>
          {tc.success.h3}
        </h3>
        <p style={{ fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic', fontSize:13, color:'var(--c-silver2)', lineHeight:1.8 }}>
          {tc.success.body}
        </p>
      </motion.div>
    )
  }

  const volumeOptions = ['', ...tc.volumeOptions]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Row 1: Company + Name */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: isMobile ? 20 : 14 }}>
        <div>
          <label style={ls(isRTL)}>{tc.company}</label>
          <input style={focusStyle('company')} placeholder="PRYM S.A." value={form.company}
            onChange={set('company')} onFocus={()=>setFocus('company')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={ls(isRTL)}>{tc.name}</label>
          <input style={focusStyle('name')} placeholder="Ahmed Benali" value={form.name}
            onChange={set('name')} onFocus={()=>setFocus('name')} onBlur={()=>setFocus(null)} />
        </div>
      </div>

      {/* Row 2: Role + Phone */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: isMobile ? 20 : 14 }}>
        <div>
          <label style={ls(isRTL)}>{tc.role}</label>
          <input style={focusStyle('role')} placeholder="CEO, DRH, Office Manager..." value={form.role}
            onChange={set('role')} onFocus={()=>setFocus('role')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={ls(isRTL)}>{tc.phone}</label>
          <input type="tel" style={focusStyle('phone')} placeholder="+212 6XX XXX XXX" value={form.phone}
            onChange={set('phone')} onFocus={()=>setFocus('phone')} onBlur={()=>setFocus(null)} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={ls(isRTL)}>{tc.email}</label>
        <input type="email" style={focusStyle('email')} placeholder="vous@entreprise.com" value={form.email}
          onChange={set('email')} onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} />
      </div>

      {/* Volume select */}
      <div style={{ position:'relative' }}>
        <label style={ls(isRTL)}>{tc.volume}</label>
        <select
          style={{ ...focusStyle('volume'), cursor:'pointer', colorScheme:'light dark', paddingRight: isRTL ? 0 : 24, paddingLeft: isRTL ? 24 : 0 }}
          value={form.volume} onChange={set('volume')}
          onFocus={()=>setFocus('volume')} onBlur={()=>setFocus(null)}>
          {volumeOptions.map((v, i) => (
            <option key={i} value={v} style={{ background:'var(--c-bg)' }}>
              {v || '—'}
            </option>
          ))}
        </select>
        <span style={{ position:'absolute', [isRTL ? 'left' : 'right']:0, bottom:14, fontSize:9, color:'var(--c-silver3)', pointerEvents:'none' }}>▾</span>
      </div>

      {/* Besoins multi-select */}
      <div>
        <label style={{ ...ls(isRTL), marginBottom:14 }}>{tc.besoins}</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 16px' }}>
          {tc.besoinsOptions.map(b => {
            const active = form.besoins.includes(b)
            return (
              <button key={b} onClick={()=>toggleBesoin(b)}
                style={{
                  fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9,
                  letterSpacing: isRTL ? 0 : '0.22em',
                  textTransform: isRTL ? 'none' : 'uppercase',
                  padding:'4px 0', cursor:'pointer', transition:'color 0.2s',
                  background:'none', border:'none',
                  color: active ? 'var(--c-text)' : 'var(--c-silver3)',
                  fontWeight: active ? 400 : 300,
                }}>
                {b}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={ls(isRTL)}>{tc.message}</label>
        <textarea style={{ ...focusStyle('message'), minHeight:72, resize:'none', lineHeight:1.7 }}
          placeholder="..."
          value={form.message} onChange={set('message')}
          onFocus={()=>setFocus('message')} onBlur={()=>setFocus(null)} />
      </div>

      {/* Consent checkbox — #4: perfect vertical alignment */}
      <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer', direction: isRTL ? 'rtl' : 'ltr' }}>
        <input type="checkbox" checked={form.consent}
          onChange={e=>setForm(f=>({...f,consent:e.target.checked}))}
          style={{
            marginTop: isRTL ? 4 : 3,
            accentColor:'var(--c-silver)', width:14, height:14,
            flexShrink:0, cursor:'pointer',
          }} />
        <span style={{
          fontSize: isRTL ? 12 : 11,      // #4: slightly larger for Arabic
          color:'var(--c-silver3)', lineHeight:1.7,
          fontFamily: FONT_SE, fontStyle: isRTL ? 'normal' : 'italic',
        }}>
          {tc.consent}
        </span>
      </label>

      {/* Submit */}
      <button onClick={submit} disabled={!valid || status === 'sending'}
        style={{
          padding:'16px', cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? 'var(--c-silver)' : 'transparent',
          border: valid ? '1px solid var(--c-silver)' : '1px solid var(--c-border-faint)',
          fontFamily:FONT_EU, fontSize: isRTL ? 12 : 10,
          letterSpacing: isRTL ? 0 : '0.35em',
          textTransform: isRTL ? 'none' : 'uppercase',
          color: valid ? 'var(--c-bg)' : 'var(--c-silver3)',
          transition:'all 0.3s',
        }}
        onMouseEnter={e=>{ if(valid) e.currentTarget.style.background = 'var(--c-text)' }}
        onMouseLeave={e=>{ if(valid) e.currentTarget.style.background = 'var(--c-silver)' }}>
        {status === 'sending' ? tc.sending : tc.submit}
      </button>

      {status === 'error' && (
        <p style={{ fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic', fontSize:12, color:'var(--c-error)' }}>
          {tc.error}
        </p>
      )}
    </div>
  )
}


export default function EntreprisesPage() {
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const te   = T[lang].entreprises
  const isRTL = lang === 'AR'

  useEffect(() => {
    document.title = 'Comptes Entreprises PRYM — Mobilité Executive Maroc'
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'PRYM propose aux entreprises un service de mobilité executive sur mesure : chauffeur attitré, facturation mensuelle, NDA étendu, priorité de disponibilité. Casablanca, Rabat, Marrakech.')
  }, [])

  return (
    <div style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* ── 1 · Hero ─────────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: `0 ${GUTTER} clamp(48px,8vh,80px)`,
        background: 'var(--c-hero-bg)',
        borderBottom: '1px solid var(--c-border)',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'var(--c-grid-line)' }} />

        {/* Eyebrow — #2: no tracking in RTL */}
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}}
          style={{
            fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9,
            letterSpacing: isRTL ? 0 : '0.45em',
            textTransform: isRTL ? 'none' : 'uppercase',
            color:C.silver3, marginBottom:20,
            position:'relative', zIndex:1,
          }}>
          {te.hero.eyebrow}
        </motion.p>

        {/* H1 — #1: dir follows lang, no forced ltr override for Arabic */}
        <motion.h1
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:0.4,duration:0.9,ease:[0.22,1,0.36,1]}}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            fontFamily:FONT_EU, fontWeight:300,
            fontSize:'clamp(28px,5vw,60px)',
            letterSpacing: isRTL ? 0 : '0.06em',
            textTransform: isRTL ? 'none' : 'uppercase',
            color:C.white, lineHeight: isRTL ? 1.4 : 1.05,
            marginBottom:24, maxWidth:700,
            position:'relative', zIndex:1,
          }}>
          {te.hero.h1a}<br />
          <span style={{ color:C.silver }}>{te.hero.h1b}</span>
        </motion.h1>

        {/* Body */}
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8,duration:0.8}}
          style={{
            fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic',
            fontSize:'clamp(13px,1.6vw,16px)',
            color:C.silver2, lineHeight:1.9, maxWidth:480,
            position:'relative', zIndex:1,
          }}>
          {te.hero.body}
        </motion.p>

        {/* Hero CTA */}
        <motion.a initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1,duration:0.8}}
          href="#contact"
          style={{
            fontFamily:FONT_EU, fontSize: isRTL ? 12 : 8,
            letterSpacing: isRTL ? 0 : '0.32em',
            textTransform: isRTL ? 'none' : 'uppercase',
            color:C.silver2, textDecoration:'none',
            marginTop:'clamp(20px,3vh,32px)', display:'inline-block',
            position:'relative', zIndex:1, transition:'color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-text)' }}
          onMouseLeave={e => { e.currentTarget.style.color = C.silver2 }}>
          {te.hero.cta}
        </motion.a>
      </section>

      {/* ── 2 · Avantages ─────────────────────────────────────────────
           #3: flex-start + top padding instead of justifyContent:center
           to kill the dead white space below the grid.                 */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        padding: `clamp(80px,11vh,108px) ${GUTTER} clamp(32px,5vh,48px)`,
        borderTop: '1px solid var(--c-border)',
      }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{
            fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9,
            letterSpacing: isRTL ? 0 : '0.4em',
            textTransform: isRTL ? 'none' : 'uppercase',
            color:C.silver3, marginBottom: isMobile ? 24 : 36,
          }}>
          {te.avantages.eyebrow}
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          columnGap: isMobile ? 0 : 'clamp(28px,4vw,52px)',
          rowGap: isMobile ? 24 : 'clamp(24px,3.5vh,36px)',  // #3: tighter row gap
          maxWidth: 1100,
        }}>
          {te.avantages.items.map((a, i) => (
            <motion.div key={a.n}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.08,duration:0.7}}>
              <p data-latin style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.35em',textTransform:'uppercase',color:C.silver3,marginBottom:8}}>{a.n}</p>
              <h3 style={{
                fontFamily:FONT_EU, fontWeight:300,
                fontSize:'clamp(14px,1.6vw,18px)',
                letterSpacing: isRTL ? 0 : '0.14em',
                textTransform: isRTL ? 'none' : 'uppercase',
                color:C.white, marginBottom:10, lineHeight: isRTL ? 1.5 : 1.2,
              }}>{a.title}</h3>
              <p style={{
                fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic',
                fontSize:13, color:C.silver2, lineHeight:1.75,
              }}>{a.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3 · Visual divider ───────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        background: 'var(--c-split-img)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderTop: '1px solid var(--c-border)',
      }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'var(--c-panel-grad)' }} />
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'var(--c-grid-line)' }} />
        <span style={{ position:'relative', zIndex:1, fontFamily:FONT_EU, fontSize:8, letterSpacing: isRTL ? 0 : '0.4em', textTransform: isRTL ? 'none' : 'uppercase', color:C.silver3, opacity:0.45 }}>
          {te.divider.caption}
        </span>
        <span style={{ position:'absolute', bottom:'clamp(16px,3vw,28px)', [isRTL ? 'right' : 'left']:'clamp(24px,6vw,80px)', fontFamily:FONT_EU, fontSize:7, letterSpacing: isRTL ? 0 : '0.3em', textTransform: isRTL ? 'none' : 'uppercase', color:C.silver3, opacity:0.3 }}>
          {te.divider.credit}
        </span>
      </section>

      {/* ── 4 · Clients ──────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-start',
        padding: `clamp(80px,11vh,108px) ${GUTTER} clamp(32px,5vh,48px)`,
        borderTop: '1px solid var(--c-border)',
      }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{
            fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9,
            letterSpacing: isRTL ? 0 : '0.4em',
            textTransform: isRTL ? 'none' : 'uppercase',
            color:C.silver3, marginBottom: isMobile ? 28 : 40,
          }}>
          {te.clients.eyebrow}
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(220px,1fr))',
          gap: isMobile ? 28 : 'clamp(24px,3vw,40px)',
          maxWidth: 900,
        }}>
          {te.clients.items.map((c, i) => (
            <motion.div key={c.label}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}>
              <p style={{
                fontFamily:FONT_EU, fontSize: isRTL ? 12 : 10,
                letterSpacing: isRTL ? 0 : '0.2em',
                textTransform: isRTL ? 'none' : 'uppercase',
                color:C.silver, marginBottom:8, lineHeight: isRTL ? 1.5 : 1.2,
              }}>{c.label}</p>
              <p style={{ fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic', fontSize:12, color:C.silver2, lineHeight:1.7 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5 · Form ─────────────────────────────────────────────────── */}
      <section id="contact" style={{
        ...SNAP,
        padding: `clamp(72px,10vh,96px) ${GUTTER} clamp(32px,4vh,48px)`,
        borderTop: '1px solid var(--c-border)',
        overflowY: 'auto',    // #3: allow internal scroll if form overflows snap height
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          columnGap: isMobile ? 0 : 'clamp(40px,6vw,80px)',
          rowGap: 0,
          maxWidth: 1100, margin: '0 auto',
          alignItems: 'start',
        }}>
          {/* Left intro */}
          <div>
            <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
              style={{
                fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9,
                letterSpacing: isRTL ? 0 : '0.4em',
                textTransform: isRTL ? 'none' : 'uppercase',
                color:C.silver3, marginBottom:20,
              }}>
              {te.contact.eyebrow}
            </motion.p>
            <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.1}}
              style={{
                fontFamily:FONT_EU, fontWeight:300,
                fontSize:'clamp(22px,3.5vw,36px)',
                letterSpacing: isRTL ? 0 : '0.08em',
                textTransform: isRTL ? 'none' : 'uppercase',
                color:C.white, marginBottom:20, lineHeight: isRTL ? 1.5 : 1.15,
              }}>
              {te.contact.h2}
            </motion.h2>
            <div style={{
              width:48, height:1,
              background: isRTL
                ? 'linear-gradient(270deg, var(--c-silver3), transparent)'
                : 'linear-gradient(90deg, var(--c-silver3), transparent)',
              marginBottom:20,
            }} />
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7,delay:0.2}}
              style={{ fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic', fontSize:13, color:C.silver2, lineHeight:1.9, marginBottom:24 }}>
              {te.contact.body}
            </motion.p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {te.contact.bullets.map(text => (
                <div key={text} style={{ display:'flex', gap:12, alignItems:'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                  <span style={{ fontFamily:FONT_EU, fontSize:10, color:C.silver3, flexShrink:0 }}>◎</span>
                  <span style={{ fontFamily:FONT_SE, fontStyle: isRTL ? 'normal' : 'italic', fontSize:13, color:C.silver2 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.15}}>
            <ContactForm isMobile={isMobile} tc={te.contact} isRTL={isRTL} />
          </motion.div>
        </div>

        {/* Footer note */}
        <div style={{ borderTop:'1px solid var(--c-border)', marginTop:'clamp(28px,4vh,40px)', paddingTop:20 }}>
          <p style={{ fontFamily:FONT_EU, fontSize: isRTL ? 11 : 9, letterSpacing: isRTL ? 0 : '0.4em', textTransform: isRTL ? 'none' : 'uppercase', color:C.silver3 }}>
            {te.footer}
          </p>
        </div>
      </section>

    </div>
  )
}
