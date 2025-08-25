import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const DOWNLOAD_API = https://itzpire.com/download/ytmp4?url=';

async function buscarVideo(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query));
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch {
    return null;
  }
}

async function descargarVideo(url) {
  try {
    const res = await fetch(DOWNLOAD_API + encodeURIComponent(url));
    const json = await res.json();
    return json.result?.download?.status ? json.result : null;
  } catch {
    return null;
  }
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎥 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} dj ambatukam
╰─⬣`
    );
  }

  await m.react('🔍');

  const video = await buscarVideo(text);
  if (!video) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontraron resultados para:* ${text}
╰─⬣`
    );
  }

  const {
    title,
    description,
    duration,
    seconds,
    views,
    author,
    url,
    thumbnail
  } = video;

  const duracion = duration?.timestamp || (seconds ? `${seconds}s` : 'Desconocida');

  const caption = `
╭─⬣「 *Descargador YouTube MP4* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 🧑‍🎤 *Autor:* ${author?.name || 'Desconocido'}
│ ≡◦ ⏱️ *Duración:* ${duracion}
│ ≡◦ 👁️ *Vistas:* ${views?.toLocaleString() || 'N/A'}
│ ≡◦ 🌐 *YouTube:* ${url}
│ ≡◦ 📝 *Descripción:* ${description || 'Sin descripción'}
╰─⬣`.trim();

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption
  }, { quoted: m });

  const descarga = await descargarVideo(url);
  if (!descarga || !descarga.download?.url) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *No se pudo convertir el video.*
│ ≡◦ Intenta con otro título o más tarde.
╰─⬣`
    );
  }

  await conn.sendMessage(m.chat, {
    video: { url: descarga.download.url },
    mimetype: 'video/mp4',
    fileName: descarga.download.filename || `${title}.mp4`
  }, { quoted: m });

  await m.react('✅');
};

handler.command = ['play2', 'ytmp4', 'mp4'];
handler.help = ['playmp4 <video>'];
handler.tags = ['descargas'];
export default handler;