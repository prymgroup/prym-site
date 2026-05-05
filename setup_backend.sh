#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym"

# ── Vercel Function ───────────────────────────────────────────────────────────
mkdir -p "$BASE/api"

cat > "$BASE/api/reservation.js" << 'EOF'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mode, tier, transfer, disposal, passenger, reference } = req.body

  if (!passenger?.email || !reference) {
    return res.status(400).json({ error: 'Données manquantes' })
  }

  // ── Email interne à Fahd ──────────────────────────────────────────────────
  const serviceLabel = mode === 'transfer' ? 'Transfert' : 'Mise à disposition'
  const trajetDetails = mode === 'transfer'
    ? `De : ${transfer?.from || '—'}\nVers : ${transfer?.to || '—'}\nDate : ${transfer?.date || '—'} à ${transfer?.time || '—'}\nPassagers : ${transfer?.passengers || 1} · Bagages : ${transfer?.luggage || 0}`
    : `Lieu : ${disposal?.location || '—'}\nDate : ${disposal?.date || '—'} à ${disposal?.time || '—'}\nDurée : ${disposal?.duration || '—'}h\nNotes : ${disposal?.notes || '—'}`

  const internalHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#f6f6f6;font-family:'Helvetica Neue',Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border:1px solid #3c3c3b;padding:40px;">
    <div style="border-bottom:1px solid #3c3c3b;padding-bottom:24px;margin-bottom:24px;">
      <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#706f6f;margin:0 0 8px;">
        Nouvelle demande
      </p>
      <h1 style="font-size:24px;letter-spacing:0.1em;text-transform:uppercase;color:#f6f6f6;margin:0;font-weight:300;">
        ${reference}
      </h1>
    </div>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;width:40%;">Service</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${serviceLabel}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Véhicule</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${tier?.name || '—'}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Client</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${passenger?.name || '—'}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Téléphone</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">
          <a href="tel:${passenger?.phone}" style="color:#c6c6c6;">${passenger?.phone || '—'}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Email</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">
          <a href="mailto:${passenger?.email}" style="color:#c6c6c6;">${passenger?.email || '—'}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Paiement</td>
        <td style="padding:12px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${passenger?.paymentMethod === 'online' ? 'En ligne' : 'Sur place'}</td>
      </tr>
    </table>

    <div style="margin-top:24px;padding:20px;background:#0e0e0f;border:1px solid #3c3c3b33;">
      <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;margin:0 0 12px;">Détails du trajet</p>
      <pre style="font-size:12px;color:#c6c6c6;margin:0;white-space:pre-wrap;font-family:inherit;">${trajetDetails}</pre>
    </div>

    ${passenger?.requests ? `
    <div style="margin-top:16px;padding:20px;background:#0e0e0f;border:1px solid #3c3c3b33;">
      <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;margin:0 0 12px;">Demandes particulières</p>
      <p style="font-size:12px;color:#c6c6c6;margin:0;font-style:italic;">${passenger.requests}</p>
    </div>` : ''}

    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #3c3c3b;">
      <a href="tel:${passenger?.phone}" style="display:inline-block;background:#c6c6c6;color:#0a0a0a;padding:14px 32px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;margin-right:12px;">
        Appeler le client
      </a>
      <a href="https://wa.me/${passenger?.phone?.replace(/\D/g, '')}" style="display:inline-block;border:1px solid #3c3c3b;color:#c6c6c6;padding:14px 32px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">
        WhatsApp
      </a>
    </div>

    <p style="margin-top:32px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#3c3c3b;">
      PRYM Executive Transport — ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>
</body>
</html>
  `

  // ── Email de confirmation au client ───────────────────────────────────────
  const clientHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#f6f6f6;font-family:'Helvetica Neue',Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border:1px solid #3c3c3b;padding:40px;">
    <div style="text-align:center;border-bottom:1px solid #3c3c3b;padding-bottom:32px;margin-bottom:32px;">
      <p style="font-size:10px;letter-spacing:0.5em;text-transform:uppercase;color:#706f6f;margin:0 0 16px;">
        PRYM Executive Transport
      </p>
      <h1 style="font-size:20px;letter-spacing:0.15em;text-transform:uppercase;color:#f6f6f6;margin:0;font-weight:300;">
        Demande reçue
      </h1>
    </div>

    <p style="font-size:14px;color:#c6c6c6;line-height:1.8;font-style:italic;margin-bottom:32px;">
      Bonjour ${passenger?.name?.split(' ')[0] || 'Madame, Monsieur'},
    </p>

    <p style="font-size:13px;color:#706f6f;line-height:1.8;margin-bottom:32px;">
      Votre demande a bien été reçue. Un conseiller PRYM vous contactera dans les 30 minutes pour confirmer les détails de votre trajet.
    </p>

    <div style="border:1px solid #3c3c3b33;padding:24px;margin-bottom:32px;text-align:center;">
      <p style="font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#706f6f;margin:0 0 8px;">
        Référence
      </p>
      <p style="font-size:22px;letter-spacing:0.2em;color:#c6c6c6;margin:0;">
        ${reference}
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;width:40%;">Service</td>
        <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:12px;color:#c6c6c6;">${serviceLabel}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Véhicule</td>
        <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:12px;color:#c6c6c6;">${tier?.name || '—'}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;">Paiement</td>
        <td style="padding:10px 0;font-size:12px;color:#c6c6c6;">${passenger?.paymentMethod === 'online' ? 'En ligne — lien sécurisé envoyé à confirmation' : 'Sur place'}</td>
      </tr>
    </table>

    <p style="font-size:12px;color:#706f6f;line-height:1.8;font-style:italic;margin-bottom:32px;">
      La discrétion est notre engagement. Toutes les informations partagées restent strictement confidentielles.
    </p>

    <div style="border-top:1px solid #3c3c3b;padding-top:24px;text-align:center;">
      <p style="font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:#3c3c3b;margin:0;">
        Driven by Excellence — prym.ma
      </p>
    </div>
  </div>
</body>
</html>
  `

  try {
    // Send both emails in parallel
    await Promise.all([
      resend.emails.send({
        from: 'PRYM <onboarding@resend.dev>',
        to: ['fahd@prym.ma'],
        subject: `[PRYM] Nouvelle demande — ${reference} — ${passenger?.name}`,
        html: internalHtml,
      }),
      resend.emails.send({
        from: 'PRYM Executive Transport <onboarding@resend.dev>',
        to: [passenger.email],
        subject: `Votre demande PRYM — ${reference}`,
        html: clientHtml,
      }),
    ])

    return res.status(200).json({ success: true, reference })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Erreur envoi email' })
  }
}
EOF

echo "✅ api/reservation.js créé"

# ── Patch Step4And5.jsx to call the API on submit ─────────────────────────────
STEP4="$BASE/src/components/booking/steps/Step4And5.jsx"

# Add submitRequest function at the top of Step4Passenger
# We patch the onNext prop usage to call API first

cat > /tmp/submit_patch.js << 'PATCH'
// This function will be called before onNext
async function submitRequest(data) {
  try {
    const res = await fetch('/api/reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.ok
  } catch {
    return false
  }
}
PATCH

echo "✅ Patch prêt"
echo ""
echo "========================================"
echo "Backend installé. Prochaine étape :"
echo "Brancher l'API dans BookingFlow.jsx"
echo "========================================"
