import fetch from 'node-fetch';

const SEARCH_API = 'https://sky-api-ashy.vercel.app/search/youtube?q=';
const VREDEN_API = 'https://api.vreden.my.id/api/v1/download/youtube/video?quality=360&url=';

async function fetchPlay(query) {
  try {
    const resBusqueda = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!resBusqueda.ok) return null;
    const jsonBusqueda = await resBusqueda.json();
    const video = jsonBusqueda.result?.[0];
    if (!video?.link) return null;

    const resDescarga = await fetch(VREDEN_API + encodeURIComponent(video.link));
    if (!resDescarga.ok) return null;
    const jsonDescarga = await resDescarga.json();
    const result = jsonDescarga.result;
    const meta = result?.metadata;
    const dl = result?.download?.url;
    const calidad = result?.download?.quality;

    if (!dl || calidad !== '360p') {
      console.log(`⚠️ Calidad disponible: ${calidad}. No es 360p.`);
      return null;
    }

    return {
      title: meta.title,
      duration: meta.duration.timestamp,
      views: meta.views,
      author: meta.author?.name || video.channel || 'Desconocido',
      thumbnail: meta.thumbnail || video.imageUrl,
      videoUrl: meta.url || video.link,
      dl_url: dl,
      filename: result.download.filename,
      quality: calidad
    };
  } catch (e) {
    console.log('❌ Error en búsqueda/descarga:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });
    return m.reply(`🔍 Ingresa el nombre del video. Ejemplo: .${command} DJ Malam Pagi`);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });

    const video = await fetchPlay(text);
    if (!video) {
      await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
      return m.reply('⚠️ No se encontraron resultados o no se pudo descargar el video.');
    }

    await conn.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${video.title}
║ ⏱️ Duración: ${video.duration}
║ 👀 Vistas: ${video.views.toLocaleString()}
║ 🧑‍🎤 Autor: ${video.author}
║ 📺 Calidad: ${video.quality}
║ 🔗 Link: ${video.videoUrl}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: video.thumbnail }, caption: msgInfo }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

    await conn.sendMessage(m.chat, {
      video: { url: video.dl_url },
      mimetype: 'video/mp4',
      fileName: video.filename,
      caption: `🎬 ${video.title}`
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error('💥 Error general en el flujo:', e);
    await conn.sendMessage(m.chat, { react: { text: '💥', key: m.key } });
    m.reply('❌ Error al procesar tu solicitud.');
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['downloader'];

export default handler;