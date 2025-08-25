import fetch from "node-fetch";

let handler = async (m, { conn, args }) => {
  try {
    let query = args.join(" ");
    if (!query) throw "⚠️ Ingresa el título o link de YouTube";

    let res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(query)}`);
    let json = await res.json();

    if (!json || !json.result || !json.result.metadata) throw "⚠️ No se pudo obtener información del video";

    let meta = json.result.metadata;
    let down = json.result.download || {};
    
    let caption = `
🎵 *${meta.title || "Sin título"}*
👤 Autor: ${meta.author?.name || "Desconocido"}
👁️ Vistas: ${meta.views || 0}
⏱️ Duración: ${meta.timestamp || "?"}
📅 Publicado: ${meta.ago || "?"}
🔗 YouTube: ${meta.url || ""}
    `.trim();

    if (down.status && down.url) {
      await conn.sendMessage(m.chat, {
        video: { url: down.url },
        caption
      }, { quoted: m });
    } else {
      await m.reply("⚠️ No encontré un link de descarga válido.");
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ Error al procesar el comando.");
  }
};

handler.help = ["play2 <texto|link>"];
handler.tags = ["downloader"];
handler.command = /^play2$/i;

export default handler;