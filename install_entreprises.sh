#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym/src"

cat > "$BASE/components/EntreprisesPage.jsx" << 'EOF'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FONT_EU = '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif'
const FONT_SE = 'Georgia,"Times New Roman",serif'
const C = {
  bg: '#0a0a0a', bg2: '#0e0e0f',
  silver: '#c6c6c6', silver2: '#706f6f', silver3: '#3c3c3b',
  white: '#f6f6f6',
}

const IS = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: `1px solid rgba(60,60,59,0.6)`, borderRadius: 0,
  padding: '14px 16px', color: C.white,
  fontFamily: FONT_EU, fontSize: 12, letterSpacing: '0.08em',
  outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none',
}

const LS = {
  fontFamily: FONT_EU, fontSize: 9, letterSpacing: '0.3em',
  textTransform: 'uppercase', color: C.silver3,
  marginBottom: 8, display: 'block',
}

function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px clamp(24px,6vw,80px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.silver3}22`,
    }}>
      <a href="/" style={{ textDecoration: 'none' }}>
        <img src="/logos/silver-logo-full.svg" alt="PRYM" style={{ height: 20, opacity: 0.9 }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }} />
        <span style={{ display:'none', fontFamily:FONT_EU, fontSize:13, letterSpacing:'0.35em', textTransform:'uppercase', color:C.white, fontWeight:300 }}>PRYM</span>
      </a>
      <div style={{ display:'flex', gap:'clamp(16px,4vw,40px)', alignItems:'center' }}>
        {[['La Flotte','/flotte'],['Expérience','/experience'],['À propos','/a-propos']].map(([l,h]) => (
          <a key={h} href={h} style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.silver3, textDecoration:'none', transition:'color 0.2s' }}
            onMouseEnter={e=>e.target.style.color=C.silver} onMouseLeave={e=>e.target.style.color=C.silver3}>{l}</a>
        ))}
        <a href="/reserver" style={{ fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:C.bg, background:C.silver, padding:'10px 20px', textDecoration:'none', transition:'all 0.2s' }}
          onMouseEnter={e=>e.target.style.background=C.white} onMouseLeave={e=>e.target.style.background=C.silver}>
          Réserver
        </a>
      </div>
    </nav>
  )
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

function ContactForm() {
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

  const focusStyle = k => ({ ...IS, borderColor: focus === k ? C.silver2 : 'rgba(60,60,59,0.6)' })

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
        style={{ textAlign:'center', padding:'60px 0' }}>
        <div style={{ width:48, height:1, background:C.silver, margin:'0 auto 32px' }} />
        <p style={{ fontFamily:FONT_EU, fontSize:9, letterSpacing:'0.4em', textTransform:'uppercase', color:C.silver3, marginBottom:16 }}>
          Demande reçue
        </p>
        <h3 style={{ fontFamily:FONT_EU, fontWeight:300, fontSize:24, letterSpacing:'0.1em', textTransform:'uppercase', color:C.white, marginBottom:16 }}>
          Nous vous contactons sous 24h.
        </h3>
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:13, color:C.silver2, lineHeight:1.8 }}>
          Un conseiller PRYM analysera votre demande et reviendra vers vous pour construire une offre sur mesure.
        </p>
      </motion.div>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* Company + Name */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
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
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
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
      <div>
        <label style={LS}>Volume estimé *</label>
        <select style={{ ...focusStyle('volume'), cursor:'pointer', colorScheme:'dark' }}
          value={form.volume} onChange={set('volume')}
          onFocus={()=>setFocus('volume')} onBlur={()=>setFocus(null)}>
          {VOLUMES.map(v => (
            <option key={v} value={v} style={{ background:'#0a0a0a' }}>
              {v || 'Sélectionner un volume'}
            </option>
          ))}
        </select>
      </div>

      {/* Besoins */}
      <div>
        <label style={{ ...LS, marginBottom:12 }}>Besoins (sélection multiple)</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {BESOINS.map(b => {
            const active = form.besoins.includes(b)
            return (
              <button key={b} onClick={()=>toggleBesoin(b)}
                style={{
                  fontFamily:FONT_EU, fontSize:8, letterSpacing:'0.15em', textTransform:'uppercase',
                  padding:'8px 16px', cursor:'pointer', transition:'all 0.2s',
                  background: active ? 'rgba(198,198,198,0.1)' : 'transparent',
                  border: `1px solid ${active ? C.silver2 : C.silver3+'55'}`,
                  color: active ? C.silver : C.silver3,
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
        <textarea style={{ ...focusStyle('message'), minHeight:100, resize:'vertical', lineHeight:1.7 }}
          placeholder="Décrivez votre contexte, vos besoins spécifiques, vos contraintes..."
          value={form.message} onChange={set('message')}
          onFocus={()=>setFocus('message')} onBlur={()=>setFocus(null)} />
      </div>

      {/* Consent */}
      <label style={{ display:'flex', gap:12, alignItems:'flex-start', cursor:'pointer' }}>
        <input type="checkbox" checked={form.consent}
          onChange={e=>setForm(f=>({...f,consent:e.target.checked}))}
          style={{ marginTop:3, accentColor:C.silver, width:14, height:14, flexShrink:0 }} />
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
        <p style={{ fontFamily:FONT_SE, fontStyle:'italic', fontSize:12, color:'rgba(200,100,100,0.7)', textAlign:'center' }}>
          Une erreur est survenue. Veuillez nous contacter directement.
        </p>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EntreprisesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Comptes Entreprises — PRYM Executive Transport'
  }, [])

  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.white }}>
      <Nav />

      {/* Hero */}
      <section style={{
        padding:'clamp(140px,18vw,200px) clamp(24px,6vw,80px) clamp(60px,8vw,100px)',
        background:`radial-gradient(ellipse at 50% 80%, #141416 0%, ${C.bg} 65%)`,
        borderBottom:`1px solid ${C.silver3}22`,
      }}>
        <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.45em',textTransform:'uppercase',color:C.silver3,marginBottom:20}}>
          Comptes Entreprises
        </motion.p>
        <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4,duration:0.9,ease:[0.22,1,0.36,1]}}
          style={{fontFamily:FONT_EU,fontWeight:300,fontSize:'clamp(28px,5vw,60px)',letterSpacing:'0.1em',textTransform:'uppercase',color:C.white,lineHeight:1.05,marginBottom:24,maxWidth:700}}>
          La mobilité executive,<br />
          <span style={{color:C.silver}}>sans friction.</span>
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8,duration:0.8}}
          style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:'clamp(13px,1.6vw,16px)',color:C.silver2,lineHeight:1.9,maxWidth:520}}>
          PRYM propose aux entreprises un service de mobilité executive sur mesure. Un seul interlocuteur, une facturation centralisée, et le standard PRYM pour chaque trajet de vos équipes.
        </motion.p>
      </section>

      {/* Avantages */}
      <section style={{padding:'clamp(60px,8vw,100px) clamp(24px,6vw,80px)', borderBottom:`1px solid ${C.silver3}22`}}>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:48,textAlign:'center'}}>
          Ce que PRYM entreprise inclut
        </motion.p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,maxWidth:1100,margin:'0 auto'}}>
          {AVANTAGES.map((a,i) => (
            <motion.div key={a.n}
              initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.08,duration:0.7}}
              style={{
                border:`1px solid ${C.silver3}33`, padding:'32px 28px',
                position:'relative', background:C.bg2,
              }}>
              <div style={{position:'absolute',top:0,left:0,width:20,height:1,background:C.silver2}} />
              <div style={{position:'absolute',top:0,left:0,width:1,height:20,background:C.silver2}} />
              <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.35em',textTransform:'uppercase',color:C.silver3,marginBottom:12}}>
                {a.n}
              </p>
              <h3 style={{fontFamily:FONT_EU,fontWeight:300,fontSize:16,letterSpacing:'0.15em',textTransform:'uppercase',color:C.white,marginBottom:16}}>
                {a.title}
              </h3>
              <p style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2,lineHeight:1.8}}>
                {a.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Qui nous fait confiance */}
      <section style={{padding:'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',borderBottom:`1px solid ${C.silver3}22`,background:C.bg2}}>
        <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
          style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3,marginBottom:48,textAlign:'center'}}>
          Ils font confiance à PRYM
        </motion.p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16,maxWidth:900,margin:'0 auto'}}>
          {CLIENTS.map((c,i) => (
            <motion.div key={c.label}
              initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
              viewport={{once:true}} transition={{delay:i*0.1,duration:0.6}}
              style={{padding:'24px',border:`1px solid ${C.silver3}33`}}>
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
        padding:'clamp(60px,8vw,100px) clamp(24px,6vw,80px)',
        display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'clamp(40px,6vw,80px)',
        maxWidth:1100, margin:'0 auto',
      }}>
        {/* Left — intro */}
        <div style={{paddingTop:8}}>
          <motion.p initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:0.7}}
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
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[
              ['◎', 'Aucun engagement initial'],
              ['◎', 'Offre personnalisée sous 24h'],
              ['◎', 'Contrat NDA inclus'],
            ].map(([icon,text]) => (
              <div key={text} style={{display:'flex',gap:12,alignItems:'center'}}>
                <span style={{fontFamily:FONT_EU,fontSize:10,color:C.silver3}}>{icon}</span>
                <span style={{fontFamily:FONT_SE,fontStyle:'italic',fontSize:13,color:C.silver2}}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.8,delay:0.15}}>
          <ContactForm />
        </motion.div>
      </section>

      {/* Footer note */}
      <div style={{borderTop:`1px solid ${C.silver3}22`,padding:'32px clamp(24px,6vw,80px)',textAlign:'center',background:C.bg2}}>
        <p style={{fontFamily:FONT_EU,fontSize:9,letterSpacing:'0.4em',textTransform:'uppercase',color:C.silver3}}>
          Driven by Excellence — prym.ma
        </p>
      </div>
    </div>
  )
}
EOF

echo "✅ EntreprisesPage.jsx créé"

# ── API b2b endpoint ───────────────────────────────────────────────────────────
cat > "/Users/Apple/Desktop/prym site/prym/api/b2b.js" << 'EOF'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { company, name, role, email, phone, volume, besoins, message } = req.body

  if (!company || !name || !email) return res.status(400).json({ error: 'Données manquantes' })

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#f6f6f6;font-family:'Helvetica Neue',Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border:1px solid #3c3c3b;padding:40px;">
    <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#706f6f;margin:0 0 8px;">Demande B2B</p>
    <h1 style="font-size:22px;letter-spacing:0.1em;text-transform:uppercase;color:#f6f6f6;margin:0 0 32px;font-weight:300;">
      ${company}
    </h1>
    <table style="width:100%;border-collapse:collapse;">
      ${[
        ['Entreprise', company],
        ['Contact', name],
        ['Fonction', role || '—'],
        ['Email', email],
        ['Téléphone', phone],
        ['Volume estimé', volume],
        ['Besoins', besoins?.join(', ') || '—'],
      ].map(([k,v]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;width:35%;">${k}</td>
          <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${v}</td>
        </tr>
      `).join('')}
    </table>
    ${message ? `
    <div style="margin-top:24px;padding:20px;background:#0e0e0f;border:1px solid #3c3c3b33;">
      <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;margin:0 0 12px;">Message</p>
      <p style="font-size:13px;color:#c6c6c6;margin:0;font-style:italic;line-height:1.7;">${message}</p>
    </div>` : ''}
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #3c3c3b;display:flex;gap:12px;">
      <a href="tel:${phone}" style="display:inline-block;background:#c6c6c6;color:#0a0a0a;padding:14px 28px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">
        Appeler
      </a>
      <a href="mailto:${email}" style="display:inline-block;border:1px solid #3c3c3b;color:#c6c6c6;padding:14px 28px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">
        Répondre par email
      </a>
    </div>
    <p style="margin-top:24px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#3c3c3b;">
      PRYM Enterprise — ${new Date().toLocaleDateString('fr-FR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
    </p>
  </div>
</body></html>
  `

  try {
    await resend.emails.send({
      from: 'PRYM <onboarding@resend.dev>',
      to: ['fahd@prym.ma'],
      subject: `[PRYM B2B] ${company} — ${name}`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Erreur envoi' })
  }
}
EOF

echo "✅ api/b2b.js créé"

# ── Patch App.jsx ─────────────────────────────────────────────────────────────
APP="/Users/Apple/Desktop/prym site/prym/src/App.jsx"

if ! grep -q "EntreprisesPage" "$APP"; then
  sed -i '' "s/const FlottePage = lazy/const EntreprisesPage = lazy(() => import('.\/components\/EntreprisesPage'))\nconst FlottePage = lazy/" "$APP"
  echo "✅ EntreprisesPage import ajouté"
fi

if ! grep -q "isEntreprises\|\/entreprises" "$APP"; then
  sed -i '' "s/const isFlotte = /const isEntreprises = path === '\/entreprises' || path === '\/entreprises\/'\n  const isFlotte = /" "$APP"
  sed -i '' "s/if (isFlotte) {/if (isEntreprises) {\n    return (\n      <Suspense fallback={<BookingLoader \/>}>\n        <EntreprisesPage \/>\n      <\/Suspense>\n    )\n  }\n\n  if (isFlotte) {/" "$APP"
  echo "✅ Route \/entreprises ajoutée"
fi

echo ""
echo "========================================"
echo "✅ EntreprisesPage installée"
echo "Test: http://localhost:5175/entreprises"
echo "========================================"
