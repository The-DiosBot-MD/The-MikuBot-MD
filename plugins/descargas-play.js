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
    const res = await fetch(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.result?.download?.url) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontró audio para:* ${text}
╰─⬣`
      );
    }

    const {
      metadata: {
        title,
        description,
        duration,
        views,
        author,
        url,
        thumbnail
      },
      download: {
        url: audioUrl,
        filename
      }
    } = json.result;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: `╭─⬣「 *Descargador YouTube* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 👤 *Autor:* ${author.name}
│ ≡◦ ⏱️ *Duración:* ${duration.timestamp}
│ ≡◦ 👁️ *Vistas:* ${views}
│ ≡◦ 🌐 *YouTube:* ${url}
│ ≡◦ 📝 *Descripción:* ${description}
╰─⬣`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false,
      fileName: filename
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