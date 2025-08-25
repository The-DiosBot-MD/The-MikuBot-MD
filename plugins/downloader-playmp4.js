import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ 🎥 *Uso correcto del comando:*
│ ≡◦ ${usedPrefix + command} DJ malam pagi slowed
╰─⬣`
    );
  }

  await m.react('🔍');

  try {
    const res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.result?.metadata) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ❌ *No se encontró contenido para:* ${text}
╰─⬣`
      );
    }

    const {
      title,
      description,
      duration,
      views,
      author,
      url,
      thumbnail
    } = json.result.metadata;

    const caption = `
╭─⬣「 *Descargador YouTube MP4* 」⬣
│ ≡◦ 🎵 *Título:* ${title}
│ ≡◦ 🧑‍🎤 *Autor:* ${author.name}
│ ≡◦ ⏱️ *Duración:* ${duration.timestamp}
│ ≡◦ 👁️ *Vistas:* ${views.toLocaleString()}
│ ≡◦ 🌐 *YouTube:* ${url}
│ ≡◦ 📝 *Descripción:* ${description}
╰─⬣`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption
    }, { quoted: m });

    const download = json.result.download;

    if (!download?.status || !download.url) {
      return m.reply(
        `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *No se pudo convertir el video a MP4.*
│ ≡◦ Intenta con otro título o más tarde.
╰─⬣`
      );
    }

    await conn.sendMessage(m.chat, {
      video: { url: download.url },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    m.reply(
      `╭─⬣「 *The-MikuBot-MD* 」⬣
│ ≡◦ ⚠️ *Error inesperado.*
│ ≡◦ Revisa tu conexión o intenta más tarde.
╰─⬣`
    );
  }
};

handler.command = ['play2',ytmp4'];
handler.help = ['play2 <video>'];
handler.tags = ['descargas'];
export default handler;