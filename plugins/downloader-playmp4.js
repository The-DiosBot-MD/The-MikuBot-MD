import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const STELLAR_API = 'https://api.stellarwa.xyz/dow/ytmp4?url=';
const STELLAR_KEY = 'stellar-Gn3yNy3a';

async function fetchSearch(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchStellarDownload(videoUrl) {
  try {
    const fullUrl = `${STELLAR_API}${encodeURIComponent(videoUrl)}&apikey=${STELLAR_KEY}`;
    const res = await fetch(fullUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return json.status ? json.data : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 Usewa Ado');

  try {
    const video = await fetchSearch(text);
    if (!video) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const thumb = video.thumbnail;
    const videoTitle = video.title;
    const videoUrl = video.url;
    const duration = video.seconds;
    const views = video.views;
    const author = video.author?.name || 'Desconocido';

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${videoTitle}
║ ⏱️ Duración: ${duration}s
║ 👀 Vistas: ${views.toLocaleString()}
║ 🧑‍🎤 Autor: ${author}
║ 🔗 Link: ${videoUrl}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumb }, caption: msgInfo }, { quoted: m });

    const download = await fetchStellarDownload(videoUrl);
    if (!download || !download.dl) return m.reply('❌ No se pudo descargar el video.');

    await conn.sendMessage(m.chat, {
      video: { url: download.dl },
      mimetype: 'video/mp4',
      fileName: download.title || 'video.mp4'
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error al procesar tu solicitud.');
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['downloader'];
export default handler;
