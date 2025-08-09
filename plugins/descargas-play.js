import fetch from 'node-fetch';

const YTS_API = 'https://api.vreden.my.id/api/yts?query=';
const YTMP3_API = 'https://api.vreden.my.id/api/ytmp3?url=';

async function fetchYTS(query) {
  try {
    const res = await fetch(YTS_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.all?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchYTMP3(videoUrl) {
  try {
    const res = await fetch(YTMP3_API + encodeURIComponent(videoUrl));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.download?.url ? json.result : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command, isOwner, isAdmin }) => {
  if (!text) return m.reply(`
╔═🎶═══🪄═══🎶═╗
║  🗣️ Invoca tu hechizo musical.
║  ✨ Ejemplo: .play DJ Ambatukam
╚═🎶═══🪄═══🎶═╝
`.trim());

  try {
    const video = await fetchYTS(text);
    if (!video) return m.reply(`
╔══🎭═══⚠️═══🎭══╗
║  🔍 Ningún ritual fue encontrado.
║  🌀 Intenta con otro conjuro.
╚══🎭═══⚠️═══🎭══╝
`.trim());

    const { title, url, duration, views, thumbnail, author } = video;

    const msgInfo = `
🎬 *𝑹𝒊𝒕𝒖𝒂𝒍 𝒅𝒆 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑺𝒐𝒏𝒐𝒓𝒐* 🎬

🎵 *Título:* ${title}
🧑‍💻 *Autor:* ${author.name}
⏱️ *Duración:* ${duration.timestampviews.toLocaleString()}
🔗 *Enlace:* ${url}
🌐 *Servidor:* Vreden YTS API
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msgInfo }, { quoted: m });

    const download = await fetchYTMP3(url);
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

    console.log(`[🔍 YTS] Consulta: ${text}`);
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
