import axios from "axios";
import baileys from "@whiskeysockets/baileys";

async function sendAlbumMessage(conn, jid, medias, options) {
  options = { ...options };
  if (typeof jid !== "string") throw new TypeError(`jid must be una cadena, recibido: ${jid}`);

  for (const media of medias) {
    if (!media.type || (media.type !== "image" && media.type !== "video"))
      throw new TypeError(`medias[i].type debe ser "image" o "video", recibido: ${media.type}`);

    if (!media.data || (!media.data.url && !Buffer.isBuffer(media.data)))
      throw new TypeError(`medias[i].data debe tener url o buffer, recibido: ${media.data}`);
  }

  if (medias.length < 2) throw new RangeError("Se requieren al menos 2 medios para el álbum.");

  const caption = options.text || options.caption || "";
  const delay = !isNaN(options.delay) ? options.delay : 500;
  delete options.text;
  delete options.caption;
  delete options.delay;

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(media => media.type === "image").length,
        expectedVideoCount: medias.filter(media => media.type === "video").length,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message,
              },
            }
          : {}),
      },
    },
    {}
  );

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id });

  for (const i in medias) {
    const { type, data } = medias[i];
    const img = await baileys.generateWAMessage(
      album.key.remoteJid,
      { [type]: data, ...(i === "0" ? { caption } : {}) },
      { upload: conn.waUploadToServer }
    );
    img.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key },
    };
    await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id });
    await baileys.delay(delay);
  }

  return album;
}

let handler = async (m, { conn, args }) => {
  if (!args.length) {
    return m.reply("╭─⬣「 *Pinterest Ritual* 」⬣\n│ ≡◦ ✨ *Ejemplo:* .pinterest anime\n╰─⬣");
  }

  await conn.sendMessage(m.chat, {
    react: { text: "🔮", key: m.key },
  });

  try {
    const query = args.join(" ");
    const apiUrl = `https://api.vreden.my.id/api/pinterest?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    const urls = response.data.result;
    if (!Array.isArray(urls) || urls.length === 0) {
      return await conn.sendMessage(m.chat, { text: "⚠️ No se encontraron imágenes rituales." }, { quoted: m });
    }

    const limitedData = urls.slice(0, 10);
    const medias = limitedData.map(url => ({
      type: "image",
      data: { url },
    }));

    const albumCaption = `🌌 *Imágenes encontradas para:* ${query}`;
    await sendAlbumMessage(conn, m.chat, medias, { caption: albumCaption, quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key },
    });

  } catch (error) {
    console.error("Error durante la búsqueda en Pinterest:", error);
    await conn.sendMessage(m.chat, {
      text: "⚠️ Ocurrió un error al invocar el ritual visual.",
    }, { quoted: m });
  }
};

handler.help = ["pinterest"];
handler.tags = ["search"];
handler.command = ["pinterest", "pin"];

export default handler;
