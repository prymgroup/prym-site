import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, prenom, nom, email, phone, societe, fonction } = req.body

  if (!email || !type) return res.status(400).json({ error: 'Données manquantes' })

  const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const rows = type === 'b2c'
    ? [['Prénom', prenom || '—'], ['Nom', nom || '—'], ['Email', email], ['Téléphone', phone || '—'], ['Profil', 'Particulier']]
    : [['Email', email], ['Société', societe || '—'], ['Fonction', fonction || '—'], ['Profil', 'Entreprise']]

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="background:#0a0a0a;color:#f6f6f6;font-family:'Helvetica Neue',Arial,sans-serif;padding:40px;max-width:600px;margin:0 auto;">
  <div style="border:1px solid #3c3c3b;padding:40px;">
    <p style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#706f6f;margin:0 0 8px;">Accès Prioritaire — ${type === 'b2c' ? 'Particulier' : 'Entreprise'}</p>
    <h1 style="font-size:22px;letter-spacing:0.1em;text-transform:uppercase;color:#f6f6f6;margin:0 0 32px;font-weight:300;">${type === 'b2c' ? `${prenom || ''} ${nom || ''}`.trim() || email : societe || email}</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${rows.map(([k, v]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#706f6f;width:35%;">${k}</td>
          <td style="padding:10px 0;border-bottom:1px solid #3c3c3b22;font-size:13px;color:#c6c6c6;">${v}</td>
        </tr>
      `).join('')}
    </table>
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #3c3c3b;display:flex;gap:12px;">
      ${phone ? `<a href="tel:${phone}" style="display:inline-block;background:#c6c6c6;color:#0a0a0a;padding:14px 28px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">Appeler</a>` : ''}
      <a href="mailto:${email}" style="display:inline-block;border:1px solid #3c3c3b;color:#c6c6c6;padding:14px 28px;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;text-decoration:none;">Répondre</a>
    </div>
    <p style="margin-top:24px;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#3c3c3b;">PRYM — ${date}</p>
  </div>
</body></html>
  `

  try {
    await resend.emails.send({
      from: 'PRYM <onboarding@resend.dev>',
      to: ['fahd@prym.ma'],
      subject: `[PRYM Lead] ${type === 'b2c' ? `${prenom} ${nom}` : societe} — ${email}`,
      html,
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Erreur envoi' })
  }
}
