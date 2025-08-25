import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const DOWNLOAD_API = 'https://api.vreden.my.id/api/ytmp4?url=';

// Headers tipo navegador para evitar bloqueos 403
const headersNavegador = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
  "Referer": "https://youtube.com/"
};

async function buscarVideo(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query), { headers: headersNavegador });
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch (error) {
    console.error('[🔴 ERROR EN BUSCAR VIDEO]', error);
    return null;
  }
}

async function descargarVideo(url) {
  try {
    const res = await fetch(DOWNLOAD_API + encodeURIComponent(url), { headers: headersNavegador });
    const json = await res.json();
    return json.result?.download?.status ? json.result : null;
  } catch (error) {
    console.error('[🔴 ERROR EN DESCARGAR VIDEO]', error);
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
╰─⬣\n> The-MikuBot-MD`
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
  const vistas = views ? views.toLocaleString() : 'N/A';
  const autor = author?.name || 'Desconocido';
  const descripcion = description || 'Sin descripción';

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: `╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Autor:* ${autor}
│ ≡◦ ⏱️ *Duración:* ${duracion}
│ ≡◦ 👁️ *Vistas:* ${vistas}
│ ≡◦ 🌐 *YouTube:* ${url}
│ ≡◦ 📝 *Descripción:* ${descripcion}
╰─⬣`
  }, { quoted: m });

  const descarga = await descargarVideo(url);
  if (!descarga || !descarga.download?.url) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *No se pudo convertir el video a MP4.*
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