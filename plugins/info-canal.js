let handler = async (m, { conn, text }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, '🌷 Ejemplo de uso:\n\ninspect https://whatsapp.com/channel/0029VbBBXTr5fM5flFaxsO06', m);
    }

    if (!text.includes('https://whatsapp.com/channel/')) {
      return conn.reply(m.chat, '🌱 Ingresa un enlace válido de canal de WhatsApp.', m);
    }

    // Verifica si el método existe
    if (typeof conn.newsletterMetadata !== 'function') {
      return conn.reply(m.chat, '❌ Este bot no tiene acceso al método newsletterMetadata. Asegúrate de usar una versión compatible.', m);
    }

    // Ritual de inspección
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

  const info = await conn.newsletterMetadata("invite", channelId);
  if (!info || typeof info !== 'object') {
    throw new Error("La respuesta del servidor no contiene información válida del canal.");
  }

  const fecha = new Date(info.creation_time * 1000);
  const fechaFormato = fecha.toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' });

  let txt = `
◜ Channel - Info ◞

≡ 🌴 Nombre: ${info.name}
≡ 🌿 ID: ${info.id}
≡ 🌾 Estado: ${info.state}
≡ 📅 Creado: ${fechaFormato}

≡ 🗃️ Enlace:
- https://whatsapp.com/channel/${info.invite}

≡ 🍄 Seguidores: ${info.subscribers}
≡ 🎍 Verificación: ${info.verified ? "✅ Sí" : "❌ No"}

≡ 🌷 Descripción: 
${info.description || "Sin descripción"}
  `.trim();

  return {
    id: info.id,
    inf: txt
  };
}