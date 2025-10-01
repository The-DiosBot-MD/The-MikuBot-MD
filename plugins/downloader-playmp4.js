import fetch from 'node-fetch';

const SEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const DOWNLOAD_API = 'https://api.stellarwa.xyz/dow/ytmp4?apikey=Carlos&url=';

async function fetchPlay(query) {
  try {
    const searchRes = await fetch(SEARCH_API + encodeURIComponent(query));
    if (!searchRes.ok) return null;
    const searchJson = await searchRes.json();
    const first = searchJson.data?.[0];
    if (!first?.url) return null;

    const downloadRes = await fetch(DOWNLOAD_API + encodeURIComponent(first.url));
    if (!downloadRes.ok) return null;
    const downloadJson = await downloadRes.json();
    const dl = downloadJson.data?.dl;

    return dl
      ? {
          title: downloadJson.data.title,
          duration: first.duration,
          views: first.views,
          author: first.author?.name || 'Desconocido',
          thumbnail: first.thumbnail,
          videoUrl: first.url,
          dl_url: dl,
          filename: `${downloadJson.data.title}.mp4`
        }
      : null;
  } catch (e) {
    console.log('❌ Error en búsqueda/descarga:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`🔍 Ingresa el nombre del video. Ejemplo: .${command} DJ Malam Pagi`);

  try {
    const video = await fetchPlay(text);
    if (!video) return m.reply('⚠️ No se encontraron resultados o no se pudo descargar el video.');

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
      fileName: video.filename,
      caption: `🎬 ${video.title}`
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