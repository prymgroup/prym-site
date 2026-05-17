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

const IS = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid var(--c-silver3)', borderRadius: 0,
  padding: '12px 0', color: 'var(--c-text)',
  fontFamily: FONT_EU, fontSize: 12, letterSpacing: '0.08em',
  outline: 'none', transition: 'border-bottom-color 0.25s', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none',
}

const LS = {
  fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em',
  textTransform: 'uppercase', color: 'var(--c-silver3)',
  marginBottom: 8, display: 'block',
}

// Shared snap base
const SNAP = {
  height: '100dvh',
  scrollSnapAlign: 'start',
  scrollSnapStop: 'always',
}

function ContactForm({ isMobile, tc }) {
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
        <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:'var(--c-silver3)', marginBottom:16 }}>
          {tc.success.eyebrow}
        </p>
        <h3 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(16px,1.8vw,24px)', letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--c-text)', marginBottom:16 }}>
          {tc.success.h3}
        </h3>
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:'var(--c-silver2)', lineHeight:1.8 }}>
          {tc.success.body}
        </p>
      </motion.div>
    )
  }

  const volumeOptions = ['', ...tc.volumeOptions]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))', gap: isMobile ? 22 : 14 }}>
        <div>
          <label style={LS}>{tc.company}</label>
          <input style={focusStyle('company')} placeholder="PRYM S.A." value={form.company}
            onChange={set('company')} onFocus={()=>setFocus('company')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={LS}>{tc.name}</label>
          <input style={focusStyle('name')} placeholder="Ahmed Benali" value={form.name}
            onChange={set('name')} onFocus={()=>setFocus('name')} onBlur={()=>setFocus(null)} />
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))', gap: isMobile ? 22 : 14 }}>
        <div>
          <label style={LS}>{tc.role}</label>
          <input style={focusStyle('role')} placeholder="CEO, DRH, Office Manager..." value={form.role}
            onChange={set('role')} onFocus={()=>setFocus('role')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={LS}>{tc.phone}</label>
          <input type="tel" style={focusStyle('phone')} placeholder="+212 6XX XXX XXX" value={form.phone}
            onChange={set('phone')} onFocus={()=>setFocus('phone')} onBlur={()=>setFocus(null)} />
        </div>
      </div>
      <div>
        <label style={LS}>{tc.email}</label>
        <input type="email" style={focusStyle('email')} placeholder="vous@entreprise.com" value={form.email}
          onChange={set('email')} onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} />
      </div>
      <div style={{ position:'relative' }}>
        <label style={LS}>{tc.volume}</label>
        <select style={{ ...focusStyle('volume'), cursor:'pointer', colorScheme:'light dark', paddingRight:24 }}
          value={form.volume} onChange={set('volume')}
          onFocus={()=>setFocus('volume')} onBlur={()=>setFocus(null)}>
          {volumeOptions.map((v, i) => (
            <option key={i} value={v} style={{ background:'var(--c-bg)' }}>
              {v || (tc.volumePlaceholder ?? '—')}
            </option>
          ))}
        </select>
        <span style={{ position:'absolute', right:0, bottom:14, fontSize:9, color:'var(--c-silver3)', pointerEvents:'none' }}>▾</span>
      </div>
      <div>
        <label style={{ ...LS, marginBottom:14 }}>{tc.besoins}</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'8px 20px' }}>
          {tc.besoinsOptions.map(b => {
            const active = form.besoins.includes(b)
            return (
              <button key={b} onClick={()=>toggleBesoin(b)}
                style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', padding:'4px 0', cursor:'pointer', transition:'color 0.2s', background:'none', border:'none', color: active ? 'var(--c-text)' : 'var(--c-silver3)', fontWeight: active ? 400 : 300 }}>
                {b}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <label style={LS}>{tc.message}</label>
        <textarea style={{ ...focusStyle('message'), minHeight:80, resize:'none', lineHeight:1.7 }}
          placeholder="..."
          value={form.message} onChange={set('message')}
          onFocus={()=>setFocus('message')} onBlur={()=>setFocus(null)} />
      </div>
      <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer' }}>
        <input type="checkbox" checked={form.consent}
          onChange={e=>setForm(f=>({...f,consent:e.target.checked}))}
          style={{ marginTop:3, accentColor:'var(--c-silver)', width:14, height:14, flexShrink:0, cursor:'pointer' }} />
        <span style={{ fontSize:11, color:'var(--c-silver3)', lineHeight:1.7, fontFamily:FONT_SE, fontStyle:'italic' }}>
          {tc.consent}
        </span>
      </label>
      <button onClick={submit} disabled={!valid || status === 'sending'}
        style={{ padding:'16px', cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'var(--c-silver)' : 'transparent', border: valid ? '1px solid var(--c-silver)' : '1px solid var(--c-border-faint)', fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase', color: valid ? 'var(--c-bg)' : 'var(--c-silver3)', transition:'all 0.3s' }}
        onMouseEnter={e=>{ if(valid) e.currentTarget.style.background = 'var(--c-text)' }}
        onMouseLeave={e=>{ if(valid) e.currentTarget.style.background = 'var(--c-silver)' }}>
        {status === 'sending' ? tc.sending : tc.submit}
      </button>
      {status === 'error' && (
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:12, color:'var(--c-error)' }}>
          {tc.error}
        </p>
      )}
    </div>
  )
}


export default function EntreprisesPage() {
  const isMobile = useIsMobile()
  const { lang } = useLanguage()
  const te = T[lang].entreprises

  useEffect(() => {
    document.title = 'Comptes Entreprises PRYM — Mobilité Executive Maroc'
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', 'PRYM propose aux entreprises un service de mobilité executive sur mesure : chauffeur attitré, facturation mensuelle, NDA étendu, priorité de disponibilité. Casablanca, Rabat, Marrakech.')
  }, [])

  const isRTL = lang === 'AR'

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
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.45em',textTransform:'uppercase',color:C.silver3,marginBottom:20,position:'relative',zIndex:1}}>
          {te.hero.eyebrow}
        </motion.p>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.9,ease:[0.22,1,0.36,1]}}
          dir="ltr"
          style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(28px,5vw,60px)',letterSpacing:'0.06em',textTransform:'uppercase',color:C.white,lineHeight:1.05,marginBottom:24,maxWidth:700,position:'relative',zIndex:1,direction:'ltr',unicodeBidi:'isolate'}}>
          {te.hero.h1a}<br />
          <span style={{color:C.silver,direction:'ltr',unicodeBidi:'isolate'}}>{te.hero.h1b}</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8,duration:0.8}}
          style={{fontFamily:FONT_SE,fontSize:'clamp(13px,1.6vw,16px)',color:C.silver2,lineHeight:1.9,maxWidth:480,position:'relative',zIndex:1}}>
          {te.hero.body}
        </motion.p>
      </section>

      {/* ── 2 · Avantages ────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `0 ${GUTTER}`,
        borderTop: '1px solid var(--c-border)',
      }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom: isMobile ? 28 : 44}}>
          {te.avantages.eyebrow}
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          columnGap: isMobile ? 0 : 'clamp(28px,4vw,52px)',
          rowGap: isMobile ? 28 : 'clamp(28px,4vh,44px)',
          maxWidth: 1100,
        }}>
          {te.avantages.items.map((a, i) => (
            <motion.div key={a.n}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.08,duration:0.7}}>
              <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.35em',textTransform:'uppercase',color:C.silver3,marginBottom:10}}>{a.n}</p>
              <h3 style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(14px,1.6vw,18px)',letterSpacing:'0.14em',textTransform:'uppercase',color:C.white,marginBottom:12}}>{a.title}</h3>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.8}}>{a.body}</p>
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
        <span style={{ position:'relative', zIndex:1, fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, opacity:0.45 }}>
          {te.divider.caption}
        </span>
        <span style={{ position:'absolute', bottom:'clamp(16px,3vw,28px)', left:'clamp(24px,6vw,80px)', fontFamily:FONT_EU, fontSize:7, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3, opacity:0.3 }}>
          {te.divider.credit}
        </span>
      </section>

      {/* ── 4 · Clients ──────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `clamp(72px,10vh,96px) ${GUTTER} clamp(40px,6vh,56px)`,
        borderTop: '1px solid var(--c-border)',
      }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom: isMobile ? 36 : 56}}>
          {te.clients.eyebrow}
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(220px,1fr))',
          gap: isMobile ? 36 : 'clamp(28px,3vw,48px)',
          maxWidth: 900,
        }}>
          {te.clients.items.map((c, i) => (
            <motion.div key={c.label}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}>
              <p style={{fontFamily:FONT_EU,fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:C.silver,marginBottom:10}}>{c.label}</p>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:12,color:C.silver2,lineHeight:1.7}}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5 · Form ─────────────────────────────────────────────────── */}
      <section style={{
        ...SNAP,
        padding: `clamp(72px,10vh,96px) ${GUTTER} clamp(40px,6vh,56px)`,
        borderTop: '1px solid var(--c-border)',
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
              style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:20}}>
              {te.contact.eyebrow}
            </motion.p>
            <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.1}}
              style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(22px,3.5vw,36px)',letterSpacing:'0.08em',textTransform:'uppercase',color:C.white,marginBottom:24,lineHeight:1.15}}>
              {te.contact.h2}
            </motion.h2>
            <div style={{width:48,height:1,background:'linear-gradient(90deg, var(--c-silver3), transparent)',marginBottom:24}} />
            <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7,delay:0.2}}
              style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.9,marginBottom:28}}>
              {te.contact.body}
            </motion.p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {te.contact.bullets.map(text => (
                <div key={text} style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <span style={{ fontFamily:FONT_EU, fontSize:10, color:C.silver3 }}>◎</span>
                  <span style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:C.silver2 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.15}}>
            <ContactForm isMobile={isMobile} tc={te.contact} />
          </motion.div>
        </div>

        {/* Footer note */}
        <div style={{ borderTop:'1px solid var(--c-border)', marginTop:'clamp(40px,6vh,56px)', paddingTop:24 }}>
          <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3 }}>
            {te.footer}
          </p>
        </div>
      </section>

    </div>
  )
}
