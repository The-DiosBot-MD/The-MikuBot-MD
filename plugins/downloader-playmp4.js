import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const DOWNLOAD_API = 'https://api.vreden.my.id/api/ytmp4?url=';

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

async function fetchVredenDownload(videoUrl) {
  try {
    const res = await fetch(DOWNLOAD_API + encodeURIComponent(videoUrl));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.download?.status ? json.result : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(
    `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎥 *Uso correcto del comando:*
│ ≡◦ ${command} nombre del video
╰─⬣`
  );

  try {
    const video = await fetchSearch(text);
    if (!video) return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontraron resultados para:* ${text}
╰─⬣`
    );

    const { title, url, thumbnail, seconds, views, author } = video;

    const msgInfo = `
╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ ⏱️ *Duración:* ${seconds}s
│ ≡◦ 👁️ *Vistas:* ${views.toLocaleString()}
│ ≡◦ 🧑‍🎤 *Autor:* ${author?.name || 'Desconocido'}
│ ≡◦ 🔗 *Link:* ${url}
│ ≡◦ 🌐 *Servidor:* Vreden API
╰─⬣`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msgInfo }, { quoted: m });

    const download = await fetchVredenDownload(url);
    if (!download || !download.download?.url) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *No se pudo convertir el video.*
│ ≡◦ Intenta con otro título o más tarde.
╰─⬣`
      );
    }

    await conn.sendMessage(m.chat, {
      video: { url: download.download.url },
      mimetype: 'video/mp4',
      fileName: `${download.metadata.title || 'video'}.mp4`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *Error inesperado.*
│ ≡◦ Revisa tu conexión o intenta más tarde.
╰─⬣`
    );
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['downloader'];
export default handler;