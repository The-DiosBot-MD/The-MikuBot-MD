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

    
    const apiKey = 'stellar-MUdpZwW6';
    const dl = await fetch(`https://api.stellarwa.xyz/dow/ytmp3v2?url=${encodeURIComponent(video.url)}&apikey=${apiKey}`);
    const jsonDl = await dl.json();

    if (!jsonDl.status || !jsonDl.data?.dl) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se pudo obtener el audio de:* ${video.title}
╰─⬣`
      );
    }

    const { title, author, dl: audioUrl } = jsonDl.data;

    
    await conn.sendMessage(m.chat, {
      image: { url: video.thumbnail },
      caption: `╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Autor:* ${author}
│ ≡◦ 🌐 *YouTube:* ${video.url}
╰─⬣`
    }, { quoted: m });

    // 🎶 Audio MP3
    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: `${title}.mp3`
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