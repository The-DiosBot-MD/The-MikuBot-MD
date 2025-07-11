import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `📽️ *Escribe el texto para generar el video.*\nEjemplo:\n${usedPrefix}${command} Un robot aprendiendo a cantar ballet flamenco.`,
}, { quoted: m});
}

  const apiEndpoint = 'https://api.nekorinn.my.id/api/ai/video/gpt';

  try {
    const response = await fetch(`${apiEndpoint}?text=${encodeURIComponent(text)}`);
    const result = await response.json();

    if (!result?.status ||!result.result?.url) {
      return conn.sendMessage(m.chat, {
        text: '🚫 No se pudo generar el video.',
}, { quoted: m});
}

    const videoUrl = result.result.url;
    const infoText = `
🎬 *Video generado con IA*
📝 *Texto:* ${text}
🔗 *Enlace:* ${videoUrl}
    `.trim();

    await conn.sendMessage(m.chat, { text: infoText}, { quoted: m});

    // Intento de enviar el video directamente
    await conn.sendMessage(m.chat, {
      video: {
        url: videoUrl
},
      caption: '✅ Tu video generado está listo 🎉'
}, { quoted: m});

} catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, {
      text: `⚠️ Error al conectar con la API.\n📄 Detalles: ${err.message}`
}, { quoted: m});
}
};

handler.command = ['videogpt', 'crearvideo', 'generarvideo'];
export default handler;