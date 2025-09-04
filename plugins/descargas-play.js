import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎧 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} dj malam pagi slowed
╰─⬣\n> The-MikuBot-MD`
    );
  }

  await m.react('🔍');

  try {
    // 🔎 Buscar en YouTube
    const search = await fetch(`https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`);
    const jsonSearch = await search.json();

    if (!jsonSearch.status || !jsonSearch.data || jsonSearch.data.length === 0) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontró audio para:* ${text}
╰─⬣`
      );
    }

    const video = jsonSearch.data[0]; // Primer resultado

    // 🎵 Descargar en MP3 con la API Starlights
    const dl = await fetch(`https://api.starlights.uk/api/downloader/youtube?url=${encodeURIComponent(video.url)}`);
    const jsonDl = await dl.json();

    if (!jsonDl.status || !jsonDl.mp3) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se pudo obtener el audio de:* ${video.title}
╰─⬣`
      );
    }

    const { mp3 } = jsonDl;

    // 📄 Info con miniatura
    await conn.sendMessage(m.chat, {
      image: { url: mp3.thumbnail },
      caption: `╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${mp3.title}
│ ≡◦ 👤 *Autor:* ${video.author?.name || "Desconocido"}
│ ≡◦ ⏱️ *Duración:* ${video.duration}
│ ≡◦ 👁️ *Vistas:* ${video.views}
│ ≡◦ 🌐 *YouTube:* ${video.url}
│ ≡◦ 📝 *Descripción:* ${video.description || "Sin descripción"}
╰─⬣`
    }, { quoted: m });

    // 🎶 Audio MP3
    await conn.sendMessage(m.chat, {
      audio: { url: mp3.dl_url },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${mp3.title}.mp3`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *Error al procesar la solicitud.*
│ ≡◦ Intenta nuevamente más tarde.
╰─⬣`
    );
  }
};

handler.help = ['play'];
handler.tags = ['descargas'];
handler.command = ['play'];
handler.register = true;

export default handler;