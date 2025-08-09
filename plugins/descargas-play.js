import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const STELLAR_API = 'https://api.stellarwa.xyz/dow/ytmp3?url=';

// 🌠 Claves API disponibles para rotación ritual
const API_KEYS = [
  'stellar-xI80Ci6e',
  '',
  ''
];

// 🔮 Selección aleatoria de clave
function getRandomKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`
╔═🌠═══🪄═══🌠═╗
║  🔍 Invoca con una palabra clave o título.
║  ✨ Ejemplo: .play dj ambatukam
╚═🌠═══🪄═══🌠═╝
`.trim());

  try {
    // 🔍 Paso 1: Búsqueda con Vreden
    const searchRes = await fetch(`${SEARCH_API}${encodeURIComponent(text)}`);
    const searchJson = await searchRes.json();

    if (searchJson.status !== 200 || !searchJson.result?.all?.length) return m.reply(`
╔══🌌═══⚠️═══🌌══╗
║  🚫 El oráculo no encontró sonidos cósmicos.
║  🔍 Consulta: "${text}"
║  📜 Fuente: Vreden API
╚══🌌═══⚠️═══🌌══╝
`.trim());

    const video = searchJson.result.all[0]; // Puedes expandir con selección múltiple

    // 🗝️ Paso 2: Invocación de descarga con StellarWA
    const apikey = getRandomKey();
    const downloadRes = await fetch(`${STELLAR_API}${encodeURIComponent(video.url)}&apikey=${apikey}`);
    const downloadJson = await downloadRes.json();

    if (!downloadJson.status || !downloadJson.download?.url) return m.reply(`
╔══🌌═══⚠️═══🌌══╗
║  🚫 El ritual fue rechazado por el oráculo de StellarWA.
║  🧪 Clave usada: ${apikey}
║  📜 Mensaje: ${downloadJson.message || 'Error desconocido'}
╚══🌌═══⚠️═══🌌══╝
`.trim());

    // 🎭 Paso 3: Presentación visual
    const msgInfo = `
🎶 *𝑺𝒐𝒏𝒊𝒅𝒐 𝒄𝒐𝒔𝒎𝒊𝒄𝒐 𝒆𝒏𝒄𝒐𝒏𝒕𝒓𝒂𝒅𝒐* 🎶

🎵 *Título:* ${video.title}
🧑‍💻 *Autor:* ${video.author.name}
⏱️ *Duración:* ${video.duration.timestamp}
👁️ *Vistas:* ${video.views.toLocaleString()}
📁 *Archivo:* ${downloadJson.download.filename}
🔗 *Enlace:* ${video.url}
🔑 *Clave usada:* ${apikey}
🌐 *Servidores:* Vreden + StellarWA
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: video.image },
      caption: msgInfo
    }, { quoted: m });

    // 🎧 Paso 4: Envío del audio
    await conn.sendMessage(m.chat, {
      audio: { url: downloadJson.download.url },
      mimetype: 'audio/mpeg',
      fileName: downloadJson.download.filename || 'ritual.mp3'
    }, { quoted: m });

    console.log(`[🌌 Ritual completado] ${video.title} | Clave: ${apikey}`);

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
handler.help = ['play <título o palabra clave>'];
handler.tags = ['downloader'];
export default handler;
