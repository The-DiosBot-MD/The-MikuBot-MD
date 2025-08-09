import fetch from 'node-fetch';

const YTSEARCH_API = 'https://delirius-apiofc.vercel.app/search/ytsearch?q=';
const YTMP3_API = 'https://delirius-apiofc.vercel.app/download/ytmp3?url=';

async function fetchDeliriusSearch(query) {
  try {
    const res = await fetch(YTSEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchDeliriusDownload(videoUrl) {
  try {
    const res = await fetch(YTMP3_API + encodeURIComponent(videoUrl));
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.download?.url ? json.data : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command, isOwner, isAdmin }) => {
  if (!text) return m.reply(`
╔═🎶═══🪄═══🎶═╗
║  🗣️ Invoca tu hechizo musical.
║  ✨ Ejemplo: .ytmusic TWICE
╚═🎶═══🪄═══🎶═╝
`.trim());

  try {
    const video = await fetchDeliriusSearch(text);
    if (!video) return m.reply(`
╔══🎭═══⚠️═══🎭══╗
║  🔍 Ningún ritual fue encontrado.
║  🌀 Intenta con otro conjuro.
╚══🎭═══⚠️═══🎭══╝
`.trim());

    const { title, url, duration, views, thumbnail, author, publishedAt } = video;

    const msgInfo = `
🎬 *𝑹𝒊𝒕𝒖𝒂𝒍 𝒅𝒆 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑺𝒐𝒏𝒐𝒓𝒐* 🎬

🎵 *Título:* ${title}
🧑‍💻 *Autor:* ${author.name}
⏱️ *Duración:* ${duration}
📅 *Publicado:* ${publishedAt}
👁️ *Vistas:* ${views.toLocaleString()}
🔗 *Enlace:* ${url}
🌐 *Servidor:* Delirius API
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msgInfo }, { quoted: m });

    const download = await fetchDeliriusDownload(url);
    if (!download || !download.download?.url) return m.reply(`
╔══🎭═══❌═══🎭══╗
║  💔 No se pudo extraer el hechizo sonoro.
║  🔁 Intenta con otro video.
╚══🎭═══❌═══🎭══╝
`.trim());

    if (isOwner || isAdmin) {
      await conn.sendMessage(m.chat, {
        text: '🧙‍♂️ Invocación privilegiada completada. El archivo será entregado con bendición sonora.',
        quoted: m
      });
    }

    await conn.sendMessage(m.chat, {
      audio: { url: download.download.url },
      mimetype: 'audio/mpeg',
      fileName: download.download.filename || 'ritual.mp3'
    }, { quoted: m });

    console.log(`[🔍 DeliriusSearch] Consulta: ${text}`);
    console.log(`[🎧 Resultado] Título: ${title} | Autor: ${author.name}`);

  } catch (e) {
    console.error(e);
    m.reply(`
╔══🎭═══⚠️═══🎭══╗
║  ⚠️ El ritual fue interrumpido por fuerzas desconocidas.
║  🧪 Revisa el hechizo o consulta al oráculo.
╚══🎭═══⚠️═══🎭══╝
`.trim());
  }
};

handler.command = ['play'];
handler.help = ['play <consulta>'];
handler.tags = ['downloader'];
export default handler;
