import fetch from 'node-fetch';

const YT_SEARCH_API = 'https://api.dorratz.com/v3/yt-search?query=';
const YT_DOWNLOAD_API = 'https://api.vreden.my.id/api/ytmp3?url=';

async function fetchYouTubeSearch(query) {
  try {
    const res = await fetch(YT_SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchYouTubeDownload(videoUrl) {
  try {
    const res = await fetch(YT_DOWNLOAD_API + encodeURIComponent(videoUrl));
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
║  🗣️ Invoca tu video con palabras mágicas.
║  ✨ Ejemplo: .ytmusic Minecraft Hardcore
╚═🎶═══🪄═══🎶═╝
`.trim());

  try {
    const video = await fetchYouTubeSearch(text);
    if (!video) return m.reply(`
╔══🎭═══⚠️═══🎭══╗
║  🔍 No se encontró ningún ritual audiovisual.
║  🌀 Intenta con otro hechizo.
╚══🎭═══⚠️═══🎭══╝
`.trim());

    const { title, url, duration, views, publishedAt, thumbnail, author } = video;

    const msgInfo = `
🎬 *𝑹𝒊𝒕𝒖𝒂𝒍 𝒅𝒆 𝒀𝒐𝒖𝑻𝒖𝒃𝒆 𝑺𝒐𝒏𝒐𝒓𝒐* 🎬

🎵 *Título:* ${title}
🧑‍💻 *Autor:* ${author.name}
⏱️ *Duración:* ${duration}
📅 *Publicado:* ${publishedAt}
👁️ *Vistas:* ${views.toLocaleString()}
🔗 *Enlace:* ${url}
🌐 *Servidor:* Dorratz API
`.trim();

    await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption: msgInfo }, { quoted: m });

    const download = await fetchYouTubeDownload(url);
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

    console.log(`[🔍 YouTubeSearch] Consulta: ${text}`);
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
