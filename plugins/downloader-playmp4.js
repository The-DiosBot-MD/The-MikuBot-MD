import fetch from 'node-fetch';

const thumbnailUrl = 'https://qu.ax/Asbfq.jpg';

const contextInfo = {
  externalAdReply: {
    title: "📺 YouTube Video",
    body: "Transmisión directa desde el universo visual...",
    mediaType: 1,
    previewType: 0,
    mediaUrl: "https://youtube.com",
    sourceUrl: "https://youtube.com",
    thumbnailUrl
  }
};

const handler = async (m, { conn, args, command, usedPrefix }) => {
  const input = args.join(" ").trim();
  if (!input) {
    await conn.sendMessage(m.chat, { react: { text: '🌀', key: m.key } });
    return conn.sendMessage(m.chat, {
      text: `🔍 Ingresa el nombre del video.\n📌 Ejemplo: ${usedPrefix + command} DJ Malam Pagi`,
      contextInfo
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });

  try {
    const res = await fetch(`https://api.vreden.my.id/api/v1/download/play/video?query=${encodeURIComponent(input)}`);
    if (!res.ok) throw new Error(`Código HTTP ${res.status}`);

    const json = await res.json();
    if (!json.status || !json.result?.download?.url) {
      throw new Error('No se pudo obtener el video. Verifica el nombre o intenta con otro término.');
    }

    const { metadata, download } = json.result;

    await conn.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  ⚡ The Miku Bot  ⚡
║  🎶 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬 𝐏𝐥𝐚𝐲 🎶
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${metadata.title}
║ ⏱️ Duración: ${metadata.duration.timestamp}
║ 👀 Vistas: ${metadata.views.toLocaleString()}
║ 🧑‍🎤 Autor: ${metadata.author.name}
║ 📺 Calidad: ${download.quality}
║ 🔗 Link: ${metadata.url}
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: metadata.thumbnail },
      caption: msgInfo,
      contextInfo
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '📥', key: m.key } });

    const videoRes = await fetch(download.url);
    if (!videoRes.ok) throw new Error(`Código HTTP ${videoRes.status}`);
    const buffer = await videoRes.buffer();

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: download.filename || 'video.mp4',
      caption: `🎬 ${metadata.title}`,
      contextInfo
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error("💥 Error en Miku Video Downloader:", e);
    await conn.sendMessage(m.chat, { react: { text: '💥', key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `🎭 La transmisión se desvaneció entre bambalinas...\n\n🛠️ ${e.message}`,
      contextInfo
    }, { quoted: m });
  }
};

handler.command = ['play2', 'mp4', 'ytmp4', 'playmp4'];
handler.tags = ['descargas'];
handler.help = ['play2 <nombre o enlace de YouTube>'];
handler.coin = 300;

export default handler;