import fetch from 'node-fetch';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const DOWNLOAD_API = 'https://api.starlights.uk/api/downloader/youtube?url=';

async function fetchSearch(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.status && json.data && json.data.length > 0 ? json.data[0] : null;
  } catch (e) {
    console.log('⚠️ Error en búsqueda:', e);
    return null;
  }
}

async function fetchDownload(videoUrl) {
  try {
    const res = await fetch(DOWNLOAD_API + encodeURIComponent(videoUrl));
    if (!res.ok) return null;
    const json = await res.json();
    return json.status && json.mp4 ? json.mp4 : null;
  } catch (e) {
    console.log('❌ Error en descarga:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 Miku');

  try {
    // 🔎 Buscar en YouTube
    const video = await fetchSearch(text);
    if (!video) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const thumb = video.thumbnail;
    const videoTitle = video.title;
    const videoUrl = video.url;
    const duration = video.duration;
    const views = video.views;
    const author = video.author?.name || 'Desconocido';

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${videoTitle}
║ ⏱️ Duración: ${duration}
║ 👀 Vistas: ${views.toLocaleString()}
║ 🧑‍🎤 Autor: ${author}
║ 🔗 Link: ${videoUrl}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumb }, caption: msgInfo }, { quoted: m });

    // 📥 Descargar en MP4
    const download = await fetchDownload(videoUrl);
    if (!download || !download.dl_url) return m.reply('❌ No se pudo descargar el video.');

    await conn.sendMessage(m.chat, {
      video: { url: download.dl_url },
      mimetype: 'video/mp4',
      fileName: `${download.title || 'video'}.mp4`,
      caption: `🎬 ${download.title || videoTitle}`
    }, { quoted: m });

  } catch (e) {
    console.error('💥 Error general en el flujo:', e);
    m.reply('❌ Error al procesar tu solicitud.');
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['downloader'];

export default handler;