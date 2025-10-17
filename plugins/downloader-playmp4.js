import fetch from 'node-fetch';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const DOWNLOAD_API = 'https://api.stellarwa.xyz/dow/ytmp4?apikey=stellar-MUdpZwW6&url=';

async function fetchPlay(query) {
  try {
    const resBusqueda = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!resBusqueda.ok) return null;
    const jsonBusqueda = await resBusqueda.json();
    const video = jsonBusqueda.data?.[0];
    if (!video?.url) return null;

    const resDescarga = await fetch(DOWNLOAD_API + encodeURIComponent(video.url));
    if (!resDescarga.ok) return null;
    const jsonDescarga = await resDescarga.json();
    const dl = jsonDescarga.data?.dl;

    return dl
      ? {
          title: jsonDescarga.data.title,
          duration: video.duration,
          views: video.views,
          author: video.author?.name || 'Desconocido',
          thumbnail: video.thumbnail,
          videoUrl: video.url,
          dl_url: dl,
          filename: `${jsonDescarga.data.title}.mp4`
        }
      : null;
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