import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MobileNavbar from './MobileNavbar'
import DesktopNav from './DesktopNav'
import RevealOnScroll from './RevealOnScroll'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = '"Nexa","Nexa Light",sans-serif'
const C = {
  bg: '#0a0a0a',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}

const IS = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid #333', borderRadius: 0,
  padding: '12px 0', color: C.white,
  fontFamily: FONT_EU, fontSize: 12, letterSpacing: '0.08em',
  outline: 'none', transition: 'border-bottom-color 0.25s', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none',
}

const LS = {
  fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em',
  textTransform: 'uppercase', color: C.silver3,
  marginBottom: 8, display: 'block',
}


// ── Avantages ─────────────────────────────────────────────────────────────────
const AVANTAGES = [
  {
    n: '01',
    title: 'Chauffeur attitré',
    body: 'Un chauffeur dédié à votre compte. Il connaît vos préférences, votre agenda, vos adresses habituelles. Pas besoin de répéter deux fois ce qui vous convient.',
  },
  {
    n: '02',
    title: 'Facturation mensuelle',
    body: 'Récapitulatif détaillé en fin de mois. Intégration comptable simplifiée. Aucune avance de frais pour vos collaborateurs.',
  },
  {
    n: '03',
    title: 'Priorité de disponibilité',
    body: 'Les comptes entreprise sont servis en priorité. Même en période de forte demande, votre véhicule est là.',
  },
  {
    n: '04',
    title: 'Reporting & suivi',
    body: 'Rapport mensuel de toutes vos courses : coûts, trajets, collaborateurs. Visibilité totale sur vos dépenses de mobilité.',
  },
  {
    n: '05',
    title: 'NDA étendu',
    body: 'Accord de confidentialité signé pour l\'ensemble de votre compte. Discrétion absolue pour tous vos collaborateurs et invités.',
  },
  {
    n: '06',
    title: 'Flotte dédiée',
    body: 'Accès à l\'ensemble des 6 tiers PRYM selon vos besoins — transfert aéroport, mise à disposition, événement, délégation.',
  },
]

// ── Clients types ─────────────────────────────────────────────────────────────
const CLIENTS = [
  { label: 'Cabinets & Conseil', desc: 'Transferts clients, partenaires et candidats. Discrétion garantie.' },
  { label: 'Hôtels & Palaces', desc: 'Service de conciergerie mobilité pour vos clients VIP.' },
  { label: 'Agences de voyage', desc: 'Transferts haut de gamme pour vos groupes et UHNWI.' },
  { label: 'Entreprises Corporate', desc: 'Mobilité exécutive pour vos dirigeants et équipes.' },
]

// ── Form ──────────────────────────────────────────────────────────────────────
const VOLUMES = [
  '', '1 à 5 courses/mois', '5 à 15 courses/mois',
  '15 à 30 courses/mois', '30+ courses/mois', 'Événementiel ponctuel',
]

const BESOINS = [
  'Transferts aéroport', 'Mise à disposition', 'Événements & séminaires',
  'Délégations & VIP', 'Navettes régulières', 'Voyages inter-villes',
]

function ContactForm({ isMobile }) {
  const [form, setForm] = useState({
    company: '', name: '', role: '', email: '', phone: '',
    volume: '', besoins: [], message: '', consent: false,
  })
  const [focus, setFocus] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggleBesoin = b => setForm(f => ({
    ...f,
    besoins: f.besoins.includes(b) ? f.besoins.filter(x => x !== b) : [...f.besoins, b],
  }))

  const valid = form.company && form.name && form.email && form.phone && form.volume && form.consent

  const submit = async () => {
    if (!valid || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const focusStyle = k => ({ ...IS, borderBottomColor: focus === k ? C.silver2 : '#333' })

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
        style={{ padding:'60px 0' }}>
        <div style={{ width:48, height:1, background:C.silver, marginBottom:32 }} />
        <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, marginBottom:16 }}>
          Demande reçue
        </p>
        <h3 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:'clamp(16px,1.8vw,24px)', letterSpacing:'0.14em', textTransform:'uppercase', color:C.white, marginBottom:16 }}>
          Nous vous contactons sous 24h.
        </h3>
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:C.silver2, lineHeight:1.8 }}>
          Un conseiller PRYM analysera votre demande et reviendra vers vous pour construire une offre sur mesure.
        </p>
      </motion.div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28 }}>

      {/* Company + Name */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))', gap: isMobile ? 28 : 16 }}>
        <div>
          <label style={LS}>Entreprise *</label>
          <input style={focusStyle('company')} placeholder="Raison sociale" value={form.company}
            onChange={set('company')} onFocus={()=>setFocus('company')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={LS}>Nom complet *</label>
          <input style={focusStyle('name')} placeholder="Prénom et nom" value={form.name}
            onChange={set('name')} onFocus={()=>setFocus('name')} onBlur={()=>setFocus(null)} />
        </div>
      </div>

      {/* Role + Phone */}
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(200px,1fr))', gap: isMobile ? 28 : 16 }}>
        <div>
          <label style={LS}>Fonction</label>
          <input style={focusStyle('role')} placeholder="Directeur, DRH, Office Manager..." value={form.role}
            onChange={set('role')} onFocus={()=>setFocus('role')} onBlur={()=>setFocus(null)} />
        </div>
        <div>
          <label style={LS}>Téléphone *</label>
          <input type="tel" style={focusStyle('phone')} placeholder="+212 6XX XXX XXX" value={form.phone}
            onChange={set('phone')} onFocus={()=>setFocus('phone')} onBlur={()=>setFocus(null)} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={LS}>Email professionnel *</label>
        <input type="email" style={focusStyle('email')} placeholder="vous@entreprise.com" value={form.email}
          onChange={set('email')} onFocus={()=>setFocus('email')} onBlur={()=>setFocus(null)} />
      </div>

      {/* Volume */}
      <div style={{ position:'relative' }}>
        <label style={LS}>Volume estimé *</label>
        <select style={{ ...focusStyle('volume'), cursor:'pointer', colorScheme:'dark', paddingRight:24 }}
          value={form.volume} onChange={set('volume')}
          onFocus={()=>setFocus('volume')} onBlur={()=>setFocus(null)}>
          {VOLUMES.map(v => (
            <option key={v} value={v} style={{ background:'#0a0a0a' }}>
              {v || 'Sélectionner un volume'}
            </option>
          ))}
        </select>
        <span style={{ position:'absolute', right:0, bottom:14, fontSize:9, color:C.silver3, pointerEvents:'none' }}>▾</span>
      </div>

      {/* Besoins */}
      <div>
        <label style={{ ...LS, marginBottom:16 }}>Besoins (sélection multiple)</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'10px 24px' }}>
          {BESOINS.map(b => {
            const active = form.besoins.includes(b)
            return (
              <button key={b} onClick={()=>toggleBesoin(b)}
                style={{
                  fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                  padding: '4px 0', cursor: 'pointer', transition: 'color 0.2s',
                  background: 'none', border: 'none',
                  color: active ? C.white : C.silver3,
                  fontWeight: active ? 500 : 300,
                }}>
                {b}
              </button>
            )
          })}
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={LS}>Message (optionnel)</label>
        <textarea style={{ ...focusStyle('message'), minHeight:100, resize:'none', lineHeight:1.7 }}
          placeholder="Décrivez votre contexte, vos besoins spécifiques, vos contraintes..."
          value={form.message} onChange={set('message')}
          onFocus={()=>setFocus('message')} onBlur={()=>setFocus(null)} />
      </div>

      {/* Consent */}
      <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer' }}>
        <input type="checkbox" checked={form.consent}
          onChange={e=>setForm(f=>({...f,consent:e.target.checked}))}
          style={{ marginTop:3, accentColor:'#444', width:14, height:14, flexShrink:0, cursor:'pointer' }} />
        <span style={{ fontSize:11, color:C.silver3, lineHeight:1.7, fontFamily:FONT_SE, fontStyle:'italic' }}>
          J'accepte d'être contacté par un conseiller PRYM pour étudier ma demande. Les informations partagées restent strictement confidentielles.
        </span>
      </label>

      {/* Submit */}
      <button onClick={submit} disabled={!valid || status === 'sending'}
        style={{
          padding:'16px', cursor: valid ? 'pointer' : 'not-allowed',
          background: valid ? C.silver : 'transparent',
          border: `1px solid ${valid ? C.silver : C.silver3+'44'}`,
          fontFamily:FONT_EU, fontSize:10, letterSpacing:'0.35em', textTransform:'uppercase',
          color: valid ? C.bg : C.silver3, transition:'all 0.3s', marginTop:8,
        }}
        onMouseEnter={e=>{ if(valid) e.currentTarget.style.background = C.white }}
        onMouseLeave={e=>{ if(valid) e.currentTarget.style.background = C.silver }}>
        {status === 'sending' ? 'Envoi en cours...' : 'Envoyer la demande'}
      </button>

      {status === 'error' && (
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:12, color:'rgba(200,100,100,0.7)' }}>
          Une erreur est survenue. Veuillez nous contacter directement.
        </p>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

export default function EntreprisesPage() {
  const isMobile = useIsMobile()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Comptes Entreprises PRYM — Mobilité Executive Maroc'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'PRYM propose aux entreprises un service de mobilité executive sur mesure : chauffeur attitré, facturation mensuelle, NDA étendu, priorité de disponibilité. Casablanca, Rabat, Marrakech.')
  }, [])

  const SP = isMobile
    ? '80px clamp(24px,5vw,40px)'
    : 'clamp(120px,14vw,180px) clamp(24px,6vw,80px)'

  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.white }}>
      {isMobile ? <MobileNavbar /> : <DesktopNav />}

      {/* Hero */}
      <section style={{
        padding: 'clamp(140px,18vw,200px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)',
        background: `radial-gradient(ellipse at 50% 80%, #141416 0%, ${C.bg} 65%)`,
        borderBottom: `1px solid ${C.silver3}22`,
      }}>
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.45em',textTransform:'uppercase',color:C.silver3,marginBottom:20}}>
          Comptes Entreprises
        </motion.p>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.9,ease:[0.22,1,0.36,1]}}
          style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(28px,5vw,60px)',letterSpacing:'0.06em',textTransform:'uppercase',color:C.white,lineHeight:1.05,marginBottom:24,maxWidth:700}}>
          La mobilité executive,<br />
          <span style={{color:C.silver}}>sans friction.</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8,duration:0.8}}
          style={{fontFamily:FONT_SE,fontSize:'clamp(13px,1.6vw,16px)',color:C.silver2,lineHeight:1.9,maxWidth:520}}>
          PRYM propose aux entreprises un service de mobilité executive sur mesure. Un seul interlocuteur, une facturation centralisée, et le standard PRYM pour chaque trajet de vos équipes.
        </motion.p>
      </section>

      {/* Avantages */}
      <section style={{ padding: SP }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom: isMobile ? 40 : 64}}>
          Ce que PRYM entreprise inclut
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(280px,1fr))',
          gap: isMobile ? 40 : 'clamp(40px,5vw,64px)',
          maxWidth: 1100, margin: '0 auto',
        }}>
          {AVANTAGES.map((a, i) => (
            <motion.div key={a.n}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.08,duration:0.7}}>
              <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.35em',textTransform:'uppercase',color:C.silver3,marginBottom:12}}>
                {a.n}
              </p>
              <h3 style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(16px,1.8vw,20px)',letterSpacing:'0.14em',textTransform:'uppercase',color:C.white,marginBottom:16}}>
                {a.title}
              </h3>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.8}}>
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Image placeholder — Détail flotte / Service B2B ─────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.2 }}
        style={{
          width: '100%',
          height: 'max(400px, 50vh)',
          marginTop:    'clamp(80px,12vw,140px)',
          marginBottom: 'clamp(80px,12vw,140px)',
          background: '#0d0d0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* Depth gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 40% 55%, #141418 0%, #080808 70%)',
        }} />
        {/* Subtle vertical line texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(90deg, transparent, transparent 119px, rgba(60,60,59,0.05) 120px)',
        }} />
        {/* Dev caption — centered */}
        <span style={{
          position: 'relative', zIndex: 1,
          fontFamily: FONT_EU, fontSize: 8,
          letterSpacing: '0.4em', textTransform: 'uppercase',
          color: C.silver3, opacity: 0.45,
        }}>
          Visuel : Détail flotte / Service B2B
        </span>
        {/* Bottom-left slot label */}
        <span style={{
          position: 'absolute', bottom: 'clamp(16px,3vw,28px)', left: 'clamp(24px,6vw,80px)',
          fontFamily: FONT_EU, fontSize: 7, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: C.silver3, opacity: 0.3,
        }}>
          PRYM Corporate — Service B2B
        </span>
      </motion.div>

      {/* Qui nous fait confiance */}
      <section style={{ padding: SP, borderBottom: `1px solid ${C.silver3}22` }}>
        <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom: isMobile ? 40 : 64}}>
          Ils font confiance à PRYM
        </motion.p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(220px,1fr))',
          gap: isMobile ? 40 : 'clamp(32px,4vw,56px)',
          maxWidth: 900, margin: '0 auto',
        }}>
          {CLIENTS.map((c, i) => (
            <motion.div key={c.label}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}>
              <p style={{fontFamily:FONT_EU,fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:C.silver,marginBottom:10}}>
                {c.label}
              </p>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:12,color:C.silver2,lineHeight:1.7}}>
                {c.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Formulaire */}
      <section style={{
        padding: SP,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(300px,1fr))',
        gap: isMobile ? 48 : 'clamp(40px,6vw,80px)',
        maxWidth: 1100, margin: '0 auto',
      }}>
        <RevealOnScroll y={32}>
        {/* Left — intro */}
        <div style={{ paddingTop: 8 }}>
          <motion.p initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}
            style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:20}}>
            Ouvrir un compte
          </motion.p>
          <motion.h2 initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.1}}
            style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(22px,3.5vw,36px)',letterSpacing:'0.08em',textTransform:'uppercase',color:C.white,marginBottom:24,lineHeight:1.15}}>
            Parlons de votre mobilité.
          </motion.h2>
          <div style={{width:48,height:1,background:`linear-gradient(90deg,${C.silver3},transparent)`,marginBottom:24}} />
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7,delay:0.2}}
            style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.9,marginBottom:32}}>
            Remplissez ce formulaire et un conseiller PRYM vous contactera sous 24 heures pour construire ensemble une offre adaptée à vos besoins.
          </motion.p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              ['◎', 'Aucun engagement initial'],
              ['◎', 'Offre personnalisée sous 24h'],
              ['◎', 'Contrat NDA inclus'],
            ].map(([icon, text]) => (
              <div key={text} style={{ display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontFamily:FONT_EU, fontSize:10, color:C.silver3 }}>{icon}</span>
                <span style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:C.silver2 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.15}}>
          <ContactForm isMobile={isMobile} />
        </motion.div>
        </RevealOnScroll>
      </section>

      {/* Footer note */}
      <RevealOnScroll delay={0.1}>
        <div style={{ borderTop:`1px solid ${C.silver3}22`, padding:'32px clamp(24px,6vw,80px)' }}>
          <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3 }}>
            Driven by Excellence — prym.ma
          </p>
        </div>
      </RevealOnScroll>
    </div>
  )
}
