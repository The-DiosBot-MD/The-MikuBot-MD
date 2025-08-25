import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const Miku_API = 'https://api.vreden.my.id/api/ytmp4?url=';

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
    const fullUrl = `${Miku_API}${encodeURIComponent(videoUrl)}`;
    const res = await fetch(fullUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.download?.status ? json.result.download : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 Miku');

  try {
    const video = await fetchSearch(text);
    if (!video) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const thumb = video.thumbnail;
    const videoTitle = video.title;
    const videoUrl = video.url;
    const duration = video.seconds;
    const views = video.views;
    const author = video.author?.name || 'Desconocido';

    // Validación ceremonial por duración
    if (duration > 600) return m.reply('⏳ Este video es muy largo para descargarlo directamente. Intenta con uno más corto.');

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
    if (!download || !download.url) return m.reply('❌ No se pudo descargar el video.');

    const qualityEmoji = {
      144: '🧊',
      360: '🎞️',
      480: '📼',
      720: '📺',
      1080: '🎬'
    }[download.quality] || '🎥';

    await conn.sendMessage(m.chat, {
      video: { url: download.url },
      mimetype: 'video/mp4',
      fileName: `${qualityEmoji} ${download.filename || 'video.mp4'}`
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