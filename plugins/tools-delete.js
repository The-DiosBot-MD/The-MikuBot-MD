
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command}) => {
  // Validación básica del texto
  if (!text) {
    return conn.sendMessage(m.chat, {
      text: `🎥 *Debes escribir un texto para generar el video.*\nEjemplo:\n${usedPrefix}${command} Un robot aprendiendo a cantar ballet flamenco.`,
}, { quoted: m});
}

  const apiUrl = `https://api.nekorinn.my.id/api/ai/video/gpt?text=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data?.status ||!data?.result?.url) {
      return conn.sendMessage(m.chat, {
        text: '🚫 No se pudo generar el video desde la API.',
}, { quoted: m});
}

    const videoUrl = data.result.url;

    const infoMessage = `
🎬 *Video generado con IA*
📝 *Prompt:* ${text}
📎 *Enlace:* ${videoUrl}
    `.trim();

    // Primero se envía info como texto
    await conn.sendMessage(m.chat, { text: infoMessage}, { quoted: m});

    // Luego se intenta enviar el video si el enlace es compatible
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl},
      caption: '✅ Aquí tienes tu video generado automáticamente 🎉'
}, { quoted: m});

} catch (error) {
    console.error('[ERROR AL GENERAR VIDEO]', error);
    await conn.sendMessage(m.chat, {
      text: `⚠️ No se pudo conectar con la API.\n📄 Detalles: ${error.message}`,
}, { quoted: m});
}
};

handler.command = ['videogpt', 'crearvideo', 'generarvideo'];
export default handler;