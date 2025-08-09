import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎧 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} dj opus
╰─⬣\n> The-MikuBot-MD`
    );
  }

  await m.react('🔍');

  try {
    const searchRes = await fetch(`https://api.vreden.my.id/api/spotifysearch?query=${encodeURIComponent(text)}`);
    const searchJson = await searchRes.json();

    if (!searchJson.result || searchJson.result.length === 0) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontraron resultados para:* ${text}
╰─⬣`
      );
    }

    const track = searchJson.result[0]; // Puedes hacer que elija aleatoriamente o por popularidad si prefieres
    const { title, artist, album, duration, releaseDate, spotifyLink, coverArt } = track;

    const detailRes = await fetch(`https://api.vreden.my.id/api/spotify?url=${encodeURIComponent(spotifyLink)}`);
    const detailJson = await detailRes.json();

    if (!detailJson.result?.music) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *No se pudo obtener el audio de:* ${title}
╰─⬣`
      );
    }

    const audioUrl = detailJson.result.music;

    await conn.sendMessage(m.chat, {
      image: { url: coverArt },
      caption: `╭─⬣「 *Descargador Spotify* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Artista:* ${artist}
│ ≡◦ 💿 *Álbum:* ${album}
│ ≡◦ ⏱️ *Duración:* ${duration}
│ ≡◦ 📅 *Lanzamiento:* ${releaseDate}
│ ≡◦ 🌐 *Spotify:* ${spotifyLink}
╰─⬣`
    }, { quoted: m });

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

handler.help = ['play1'];
handler.tags = ['descargas'];
handler.command = ['play1'];
handler.register = true;

export default handler;
