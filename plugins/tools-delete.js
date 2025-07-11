
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command}) => {
  // Validación de entrada
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎥 *Escribe el texto para generar el video.*\nEjemplo:\n${usedPrefix}${command} Un robot aprendiendo a cantar ballet flamenco.`,
}, { quoted: m});
}

  const apiUrl = `https://api.nekorinn.my.id/api/ai/video/gpt?text=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result ||!result.status ||!result.result ||!result.result.url) {
      return conn.sendMessage(m.chat, {
        text: '🚫 La API no devolvió un video válido.',
}, { quoted: m});
}

    const videoUrl = result.result.url;
    const infoText = `
🎬 *Video generado con IA*
📝 *Prompt:* ${text}
📎 *Enlace directo:* ${videoUrl}
`.trim();

    // Mensaje informativo
    await conn.sendMessage(m.chat, { text: infoText}, { quoted: m});

    // Enviar video generado
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl},
      caption: '✅ Tu video generado está listo 🎉',
}, { quoted: m});

} catch (error) {
    console.error('[ERROR]', error);
    await conn.sendMessage(m.chat, {
      text: `⚠️ No se pudo conectar con la API.\n📄 Detalles: ${error.message}`,
}, { quoted: m});
}
};

// Comandos que activan el manejador
handler.command = ['videogpt', 'crearvideo', 'generarvideo'];
export default handler;