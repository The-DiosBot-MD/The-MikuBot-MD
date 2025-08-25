import fetch from 'node-fetch';

const SEARCH_API = 'https://api.vreden.my.id/api/yts?query=';
const DOWNLOAD_API = 'https://api.vreden.my.id/api/ytmp4?url=';

const headersNavegador = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "*/*",
  "Referer": "https://youtube.com/"
};

async function buscarVideo(query) {
  try {
    const res = await fetch(SEARCH_API + encodeURIComponent(query), { headers: headersNavegador });
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch (e) {
    console.error('❌ Error buscarVideo:', e);
    return null;
  }
}

async function descargarVideo(url) {
  try {
    const res = await fetch(DOWNLOAD_API + encodeURIComponent(url), { headers: headersNavegador });
    const json = await res.json();
    return json.result?.download?.status ? json.result : null;
  } catch (e) {
    console.error('❌ Error descargarVideo:', e);
    return null;
  }
}

async function bajarComoBuffer(url) {
  try {
    const res = await fetch(url, { headers: headersNavegador });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.error('❌ Error bajarComoBuffer:', e);
    return null;
  }
}

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ Uso: ${usedPrefix + command} nombre del video
╰─⬣`
    );
  }

  await m.react('🔍');

  const video = await buscarVideo(text);
  if (!video) return m.reply(`❌ No encontré resultados para: ${text}`);

  const { title, author, url, thumbnail, views, duration } = video;
  const vistas = views?.toLocaleString() || 'N/A';
  const duracion = duration?.timestamp || 'N/A';
  const autor = author?.name || 'Desconocido';

  await conn.sendMessage(m.chat, {
    image: { url: thumbnail },
    caption: `🎵 *${title}*\n👤 ${autor}\n⏱ ${duracion}\n👁 ${vistas}\n🌐 ${url}`
  }, { quoted: m });

  const descarga = await descargarVideo(url);
  if (!descarga?.download?.url) return m.reply("⚠️ No pude convertir el video.");

  const buffer = await bajarComoBuffer(descarga.download.url);
  if (!buffer) return m.reply("⚠️ No pude bajar el archivo (403).");

  await conn.sendMessage(m.chat, {
    video: buffer,
    mimetype: 'video/mp4',
    fileName: descarga.download.filename || `${title}.mp4`
  }, { quoted: m });

  await m.react('✅');
};

handler.command = ['play2', 'ytmp4', 'mp4'];
handler.help = ['playmp4 <video>'];
handler.tags = ['descargas'];
export default handler;