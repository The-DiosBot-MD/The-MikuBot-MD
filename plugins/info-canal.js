let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, '🌷 Ejemplo de uso:\n\ninspect https://whatsapp.com/channel/0029VbBBXTr5fM5flFaxsO06', m);
    }

    if (!text.includes('https://whatsapp.com/channel/')) {
      return conn.reply(m.chat, '🌱 Ingresa un enlace válido de canal de WhatsApp.', m);
    }

    await m.react("🔍");
    await conn.reply(m.chat, "🌿 Consultando los espíritus del canal...", m);

    let i = await getInfo(conn, text);

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: i.inf,
        contextInfo: {
          mentionedJid: conn.parseMention(i.inf),
          externalAdReply: {
            title: 'Información del Canal',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnail: await (await fetch('https://i.imgur.com/0xZ0Z0Z.png')).buffer(), // Reemplaza con tu logo si tienes uno
            sourceUrl: `https://whatsapp.com/channel/${i.id}`
          }
        }
      }
    }, { quoted: m });

    await m.reply(`🆔 ID del canal: ${i.id}`);
    await m.react("☑️");

  } catch (error) {
    console.error(error);
    await m.react("⚠️");
    await conn.reply(m.chat, `❌ Error al obtener la información del canal:\n${error.message}`, m);
  }
};

handler.command = ["inspector", "infocanal", "id"];
handler.help = ["inspect"];
handler.tags = ["tools"];
export default handler;

async function getInfo(conn, url) {
  const match = url.match(/https:\/\/whatsapp\.com\/channel\/([0-9A-Za-z]+)/i);
  if (!match) throw new Error("El enlace proporcionado no es válido o no pertenece a un canal de WhatsApp.");

  const channelId = match[1];

  let info;
  try {
    // Fallback defensivo usando conn.query
    const node = await conn.query({
      tag: 'iq',
      attrs: {
        type: 'get',
        xmlns: 'w:newsletter',
        to: `${channelId}@newsletter`
      },
      content: [{ tag: 'newsletter', attrs: {} }]
    });

    const metadata = node?.content?.[0]?.attrs;
    if (!metadata || !metadata.name) {
      throw new Error("No se pudo obtener metadatos válidos del canal.");
    }

    const fecha = new Date(Number(metadata.creation_time || 0) * 1000);
    const fechaFormato = isNaN(fecha.getTime()) ? "Desconocida" : fecha.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });

    let txt = `
◜ Channel - Info ◞

≡ 🌴 Nombre: ${metadata.name}
≡ 🌿 ID: ${channelId}
≡ 🌾 Estado: ${metadata.state || "Desconocido"}
≡ 📅 Creado: ${fechaFormato}

≡ 🗃️ Enlace:
- https://whatsapp.com/channel/${channelId}

≡ 🍄 Seguidores: ${metadata.subscribers || "?"}
≡ 🎍 Verificación: ${metadata.verified === "true" ? "✅ Sí" : "❌ No"}

≡ 🌷 Descripción: 
${metadata.description || "Sin descripción"}
    `.trim();

    return {
      id: channelId,
      inf: txt
    };

  } catch (error) {
    throw new Error(`No se pudo obtener la información del canal: ${error.message}`);
  }
}
