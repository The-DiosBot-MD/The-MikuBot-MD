import fetch from 'node-fetch';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const VREDEN_API = 'https://api.vreden.my.id/api/ytmp4?url=';

async function fetchSearch(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.status && json.data?.length > 0 ? json.data[0] : null;
  } catch (e) {
    console.log('⚠️ Error en búsqueda:', e);
    return null;
  }
}

async function fetchDownload(videoUrl) {
  try {
    const res = await fetch(VREDEN_API + encodeURIComponent(videoUrl));
    if (!res.ok) return null;
    const json = await res.json();
    const meta = json.result?.metadata;
    const dl = json.result?.download;

    return meta && dl?.url
      ? {
          title: meta.title,
          duration: meta.duration.timestamp,
          views: meta.views,
          author: meta.author?.name || 'Desconocido',
          thumbnail: meta.thumbnail,
          dl_url: dl.url,
          filename: dl.filename
        }
      : null;
  } catch (e) {
    console.log('❌ Error en descarga:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 Miku');

  try {
    const video = await fetchSearch(text);
    if (!video) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const videoUrl = video.url;

    const download = await fetchDownload(videoUrl);
    if (!download || !download.dl_url) return m.reply('❌ No se pudo descargar el video.');

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${download.title}
║ ⏱️ Duración: ${download.duration}
║ 👀 Vistas: ${download.views.toLocaleString()}
║ 🧑‍🎤 Autor: ${download.author}
║ 🔗 Link: ${videoUrl}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: download.thumbnail }, caption: msgInfo }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: download.dl_url },
      mimetype: 'video/mp4',
      fileName: download.filename || `${download.title}.mp4`,
      caption: `🎬 ${download.title}`
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