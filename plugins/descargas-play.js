import fetch from 'node-fetch';

const STELLAR_API = 'https://api.stellarwa.xyz/dow/ytmp3?url=';

// 🌠 Claves API disponibles para rotación ritual
const API_KEYS = [
  'stellar-xI80Ci6e',
  'stellar-abc123xyz',
  'stellar-otroToken987'
];

// 🔮 Selección aleatoria de clave
function getRandomKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

let handler = async (m, { text, conn, command, isOwner, isAdmin }) => {
  if (!text || !text.includes('youtube.com') && !text.includes('youtu.be')) return m.reply(`
╔═🌠═══🪄═══🌠═╗
║  🎧 Invoca con un enlace válido de YouTube.
║  ✨ Ejemplo: .play https://youtu.be/TdrL3QxjyVw
╚═🌠═══🪄═══🌠═╝
`.trim());

  try {
    const apikey = getRandomKey();
    const res = await fetch(`${STELLAR_API}${encodeURIComponent(text)}&apikey=${apikey}`);
    const json = await res.json();

    if (!json.status || !json.download?.url) return m.reply(`
╔══🌌═══⚠️═══🌌══╗
║  🚫 El ritual fue rechazado por el oráculo.
║  🧪 Clave usada: ${apikey}
║  📜 Mensaje: ${json.message || 'Error desconocido'}
╚══🌌═══⚠️═══🌌══╝
`.trim());

    const { title, author, duration, views, image, download } = json;

    const msgInfo = `
🎶 *𝑺𝒐𝒏𝒊𝒅𝒐 𝒄𝒐𝒔𝒎𝒊𝒄𝒐 𝒆𝒏𝒄𝒐𝒏𝒕𝒓𝒂𝒅𝒐* 🎶

🎵 *Título:* ${title}
🧑‍💻 *Autor:* ${author}
⏱️ *Duración:* ${duration}s
👁️ *Vistas:* ${views}
📁 *Archivo:* ${download.filename}
🔗 *Enlace:* ${text}
🔑 *Clave usada:* ${apikey}
🌐 *Servidor:* StellarWA
`.trim();

    await conn.sendMessage(m.chat, { image: { url: image }, caption: msgInfo }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: download.url },
      mimetype: 'audio/mpeg',
      fileName: download.filename || 'ritual.mp3'
    }, { quoted: m });

    console.log(`[🌌 StellarWA] Descarga completada: ${title} | Clave: ${apikey}`);

  } catch (e) {
    console.error(e);
    m.reply(`
╔══🌌═══❌═══🌌══╗
║  ⚠️ El ritual fue interrumpido por fuerzas desconocidas.
║  🔁 Intenta nuevamente o consulta al oráculo.
╚══🌌═══❌═══🌌══╝
`.trim());
  }
};

handler.command = ['play'];
handler.help = ['play <enlace de YouTube>'];
handler.tags = ['downloader'];
export default handler;
