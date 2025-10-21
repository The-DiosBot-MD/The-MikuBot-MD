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

    const video = jsonSearch.data[0]; 
    const videoUrl = video.url;

    // 🎧 Descargar audio con Vreden API
    const dl = await fetch(`https://api.vreden.my.id/api/v1/download/youtube/audio?url=${encodeURIComponent(videoUrl)}&quality=128`);
    const jsonDl = await dl.json();

    if (!jsonDl.status || !jsonDl.result?.download?.url) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se pudo obtener el audio de:* ${video.title}
╰─⬣`
      );
    }

    const { metadata, download } = jsonDl.result;
    const { title, thumbnail } = metadata;
    const audioUrl = download.url;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Autor:* ${metadata.author.name}
│ ≡◦ 🌐 *YouTube:* ${metadata.url}
╰─⬣`
    }, { quoted: m });

    // 🎶 Audio MP3
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title} (128kbps).mp3`
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