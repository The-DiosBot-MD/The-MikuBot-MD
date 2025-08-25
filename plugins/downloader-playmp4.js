import fetch from 'node-fetch';

let handler = async (m, { conn, args, command, usedPrefix }) => {
  const text = args.join(" ");
  if (!text) {
    return m.reply(
      `❌ Ingresa el nombre del video.\n\n📌 Ejemplo:\n${usedPrefix + command} dj malam pagi slowed`
    );
  }

  await m.react('🔍');

  try {
    let res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.result || !json.result.download || !json.result.download.url) {
      return m.reply(`❌ No encontré resultados para: *${text}*`);
    }

    let meta = json.result.metadata;
    let down = json.result.download;

    // primero mandamos info con miniatura
    await conn.sendMessage(m.chat, {
      image: { url: meta.thumbnail },
      caption: `🎬 *${meta.title}*\n\n👤 Autor: ${meta.author.name}\n⏱️ Duración: ${meta.duration.timestamp}\n👁️ Vistas: ${meta.views}\n🌐 YouTube: ${meta.url}\n📹 Calidad: ${down.quality}`
    }, { quoted: m });

    // después mandamos el video
    await conn.sendMessage(m.chat, {
      video: { url: down.url },
      mimetype: 'video/mp4',
      fileName: down.filename,
      caption: `✅ Aquí tienes tu video`
    }, { quoted: m });

    await m.react('✅');

  } catch (e) {
    console.error(e);
    return m.reply(`⚠️ Hubo un error, intenta de nuevo más tarde.`);
  }
};

handler.help = ['play2 <texto>', 'ytmp4 <texto>'];
handler.tags = ['descargas'];
handler.command = ['play2', 'ytmp4'];

export default handler;