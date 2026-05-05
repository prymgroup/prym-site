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
