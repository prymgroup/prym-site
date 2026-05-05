import { useState } from 'react'
import { motion } from 'framer-motion'

const IS = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: '14px 16px', color: '#F5F5F0', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 12, letterSpacing: '0.08em', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }
const LS = { fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.5)', marginBottom: 6, display: 'block' }

export function Step4Passenger({ data, onChange, onNext, onBack }) {
  const [f, setF] = useState(null)
  const set = k => e => { const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value; onChange({ ...data, [k]: v }) }
  const valid = data.name && data.phone && data.email && data.paymentMethod && data.consent
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}
      style={{ padding: '32px 24px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
      <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 8 }}>04 — Vos coordonnées</p>
      <h2 style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 20, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F5F5F0', fontWeight: 300, marginBottom: 32 }}>Finaliser la demande</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div><label style={LS}>Nom complet</label><input style={{ ...IS, borderColor: f === 'name' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="Prénom et nom de famille" value={data.name || ''} onChange={set('name')} onFocus={() => setF('name')} onBlur={() => setF(null)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={LS}>Téléphone</label><input type="tel" style={{ ...IS, borderColor: f === 'phone' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="+212 6XX XXX XXX" value={data.phone || ''} onChange={set('phone')} onFocus={() => setF('phone')} onBlur={() => setF(null)} /></div>
          <div><label style={LS}>Email</label><input type="email" style={{ ...IS, borderColor: f === 'email' ? 'rgba(200,200,204,0.4)' : 'rgba(200,200,204,0.15)' }} placeholder="votre@email.com" value={data.email || ''} onChange={set('email')} onFocus={() => setF('email')} onBlur={() => setF(null)} /></div>
        </div>
        <div><label style={LS}>Demandes particulières (optionnel)</label><textarea style={{ ...IS, minHeight: 72, resize: 'vertical', lineHeight: 1.6 }} placeholder="Siège enfant, accueil nominatif, eau gazeuse, langue du chauffeur..." value={data.requests || ''} onChange={set('requests')} /></div>
        <div>
          <label style={{ ...LS, marginBottom: 10 }}>Préférence de paiement</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['online','En ligne','Lien envoyé après confirmation'],['onsite','Sur place','Espèces ou carte au chauffeur']].map(([v,l,s]) => (
              <button key={v} onClick={() => onChange({ ...data, paymentMethod: v })} style={{ flex: 1, padding: 12, textAlign: 'left', cursor: 'pointer', background: data.paymentMethod === v ? 'rgba(200,200,204,0.08)' : 'transparent', border: `1px solid ${data.paymentMethod === v ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.12)'}`, borderRadius: 2, transition: 'all 0.2s' }}>
                <div style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F5F5F0', marginBottom: 3 }}>{l}</div>
                <div style={{ fontSize: 10, color: 'rgba(200,200,204,0.4)', fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>{s}</div>
              </button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <input type="checkbox" checked={data.consent || false} onChange={set('consent')} style={{ marginTop: 2, accentColor: '#C8C8CC', width: 14, height: 14, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(200,200,204,0.5)', lineHeight: 1.6, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>J'accepte d'être contacté par un conseiller PRYM pour confirmer et finaliser ma demande.</span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
        <button onClick={onBack} style={{ ...IS, width: 'auto', padding: '14px 24px', cursor: 'pointer', color: 'rgba(200,200,204,0.5)' }}>← Retour</button>
        <button onClick={onNext} disabled={!valid} style={{ flex: 1, padding: 14, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? 'rgba(200,200,204,0.1)' : 'transparent', border: `1px solid ${valid ? 'rgba(200,200,204,0.3)' : 'rgba(200,200,204,0.1)'}`, borderRadius: 2, fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: valid ? '#F5F5F0' : 'rgba(200,200,204,0.3)', transition: 'all 0.3s' }}>Confirmer la demande →</button>
      </div>
    </motion.div>
  )
}

export function Step5Confirm({ reference, mode, tier, passenger, onReset }) {
  const corners = [['top','left'],['top','right'],['bottom','left'],['bottom','right']]
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
      style={{ padding: '40px 24px', maxWidth: 480, margin: '0 auto', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ width: '100%', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: 32, position: 'relative', background: 'rgba(200,200,204,0.02)' }}>
        {corners.map(([v,h]) => (
          <div key={`${v}${h}`} style={{ position: 'absolute', [v]: 0, [h]: 0, width: 16, height: 1, background: 'rgba(200,200,204,0.5)' }}>
            <div style={{ position: 'absolute', top: 0, [h]: 0, width: 1, height: 16, background: 'rgba(200,200,204,0.5)' }} />
          </div>
        ))}
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', marginBottom: 12 }}>Référence de demande</p>
        <p style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 22, letterSpacing: '0.15em', color: '#F5F5F0', marginBottom: 24 }}>{reference}</p>
        <div style={{ borderTop: '1px solid rgba(200,200,204,0.08)', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[['Service', mode === 'transfer' ? 'Transfert' : 'Mise à disposition'],['Véhicule', tier?.name],['Contact', passenger?.name]].map(([k,v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)' }}>{k}</span>
              <span style={{ fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 10, letterSpacing: '0.1em', color: '#C8C8CC' }}>{v}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ fontSize: 13, color: 'rgba(200,200,204,0.5)', lineHeight: 1.8, fontFamily: 'Georgia,serif', fontStyle: 'italic', maxWidth: 360 }}>
        Votre demande est reçue. Un conseiller PRYM vous contactera sous <span style={{ color: '#C8C8CC' }}>30 minutes</span> pour confirmer les détails.
      </motion.p>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={onReset}
        style={{ background: 'none', border: '1px solid rgba(200,200,204,0.15)', borderRadius: 2, padding: '12px 24px', cursor: 'pointer', fontFamily: '"Eurostile","Arial Narrow",sans-serif', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,200,204,0.4)', transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.3)'; e.currentTarget.style.color = '#C8C8CC' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,200,204,0.15)'; e.currentTarget.style.color = 'rgba(200,200,204,0.4)' }}>
        Nouvelle demande
      </motion.button>
    </motion.div>
  )
}
