import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Protección contra procesamiento de mensajes duplicados
  global._processedMessages ??= new Set();
  if (global._processedMessages.has(m.key.id)) return;
  global._processedMessages.add(m.key.id);

  const thumbnailCard = 'https://qu.ax/bMKZO.jpg';
  const mainImage = 'https://qu.ax/AEkvz.jpg';
  const API_URL = 'https://api.vreden.my.id/api/mediafiredl';

  // Validación del enlace
  if (!text || !text.includes('mediafire.com')) {
    return await conn.sendMessage(m.chat, {
      text: `📥 *Proporciona un enlace válido de MediaFire para descargar.*\nEjemplo:\n${usedPrefix + command} https://www.mediafire.com/file/abc123/example.zip/file`,
      footer: '🔗 MediaFire Downloader',
      contextInfo: {
        externalAdReply: {
          title: 'Descarga directa desde MediaFire',
          body: 'Convierte enlaces en descargas instantáneas',
          thumbnailUrl: thumbnailCard,
          sourceUrl: 'https://mediafire.com'
        }
      }
    }, { quoted: m });
  }

  try {
    // 1. Obtener información del archivo desde la API
    const api = `${API_URL}?url=${encodeURIComponent(text)}`;
    const res = await fetch(api);
    
    // Verificar si la respuesta de la API es exitosa
    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const file = json.result?.[0];

    // Verificar si se obtuvo un enlace de descarga válido
    if (!file?.status || !file.link) {
      return m.reply('❌ No se pudo obtener el archivo desde MediaFire.');
    }

    const fileName = decodeURIComponent(file.nama);
    const caption = `
📄 *Nombre:* ${fileName}
📁 *Tipo:* ${file.mime}
📏 *Tamaño:* ${file.size}
🖥️ *Servidor:* ${file.server}
`.trim();

    // 2. Enviar mensaje de descripción visual (Imagen)
    await conn.sendMessage(m.chat, {
      image: { url: mainImage },
      caption,
      footer: '📦 Información del archivo vía Vreden API',
      contextInfo: {
        externalAdReply: {
          title: fileName,
          body: `${file.size} • ${file.mime}`,
          thumbnailUrl: thumbnailCard,
          sourceUrl: file.link
        }
      }
    }, { quoted: m });

    // 3. Enviar el archivo como documento
    await conn.sendMessage(m.chat, {
      document: {
        url: file.link,
        fileName: fileName,
        mimetype: file.mime // Usamos el mimetype correcto proporcionado por la API
      },
      caption: '📥 Archivo descargado desde MediaFire'
    }, { quoted: m });

  } catch (error) {
    console.error("Error al procesar el enlace de MediaFire:", error);
    m.react('⚠️');
    m.reply(`❌ Error al procesar el enlace.\n📛 Detalles: ${error.message}\n\n*Asegúrate de que el enlace sea correcto y la API esté disponible.*`);
  }
};

handler.command = ['mf', 'mediafire'];
export default handler;
