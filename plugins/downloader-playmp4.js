import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const Miku_API = 'https://api.vreden.my.id/api/ytmp4?url=';

async function fetchSearch(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch (e) {
    console.error('[🔍 LOG] Error en búsqueda:', e);
    return null;
  }
}

async function fetchStellarDownload(videoUrl) {
  try {
    const full}${encodeURIComponent(videoUrl)}`;
    const res = await fetch(fullUrl);
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.download?.status ? json.result.download : null;
  } catch (e) {
    console.error('[📥 LOG] Error en descarga:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 Usewa Ado');

  try {
    const video = await fetchSearch(text);
    console.log('[🔍 LOG] Resultado de búsqueda:', video);
    if (!video) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const { thumbnail, title, url, seconds, views, author } = video;
    const duration = seconds;
    const authorName = author?.name || 'Desconocido';

    if (duration > 600) {
      return m.reply('⏳ Este video es muy largo para descargarlo directamente. Intenta con uno más corto.');
    }

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${title}
║ ⏱️ Duración: ${duration}s
║ 👀 Vistas: ${views.toLocaleString()}
║ 🧑‍🎤 Autor: ${authorName}
║ 🔗 Link: ${url}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msgInfo }, { quoted: m });

    const download = await fetchStellarDownload(url);
    console.log('[📥 LOG] Resultado de descarga:', download);
    if (!download || !download.url) {
      return m.reply('❌ No se pudo obtener el enlace de descarga. Tal vez el video no está disponible en formato MP4.');
    }

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
    console.error('[❌ LOG] Error general:', e);
    m.reply('❌ Error al procesar tu solicitud. Intenta nuevamente o revisa el nombre del video.');
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['downloader'];
export default handler;