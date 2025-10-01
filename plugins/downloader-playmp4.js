import fetch from 'node-fetch';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const DOWNLOAD_API = 'https://api.vreden.my.id/api/v1/download/youtube/video?url=';

async function searchYoutube(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    const first = json.data?.[0];
    return first?.url || null;
  } catch (e) {
    console.log('🔍 Error en búsqueda:', e);
    return null;
  }
}

async function fetchVideoByUrl(youtubeUrl, quality = '360') {
  try {
    const apiUrl = `${DOWNLOAD_API}${encodeURIComponent(youtubeUrl)}&quality=${quality}`;
    const res = await fetch(apiUrl);
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
          videoUrl: meta.url,
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
  if (!text) return m.reply('🔍 Ingresa el nombre del video. Ejemplo: .play2 TWICE Happy Nation');

  try {
    const videoUrl = await searchYoutube(text);
    if (!videoUrl) return m.reply('⚠️ No se encontraron resultados para tu búsqueda.');

    const video = await fetchVideoByUrl(videoUrl);
    if (!video) return m.reply('⚠️ No se pudo descargar el video.');

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${video.title}
║ ⏱️ Duración: ${video.duration}
║ 👀 Vistas: ${video.views.toLocaleString()}
║ 🧑‍🎤 Autor: ${video.author}
║ 🔗 Link: ${video.videoUrl}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: video.thumbnail }, caption: msgInfo }, { quoted: m });

    await conn.sendMessage(m.chat, {
      video: { url: video.dl_url },
      mimetype: 'video/mp4',
      fileName: video.filename || `${video.title}.mp4`,
      caption: `🎬 ${video.title}`
    }, { quoted: m });

  } catch (e) {
    console.error('💥 Error general en el flujo:', e);
    m.reply('❌ Error al procesar tu solicitud.');
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <nombre del video>'];
handler.tags = ['downloader'];

export default handler;