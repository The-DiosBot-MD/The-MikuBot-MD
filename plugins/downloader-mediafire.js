import fetch from 'node-fetch';

const mediafireHandler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text ||!text.includes('mediafire.com')) {
    return conn.sendMessage(m.chat, {
      text: `❗️ Por favor proporciona un enlace válido de MediaFire.\nEjemplo:\n${usedPrefix}${command} https://www.mediafire.com/file/abc123/example.zip/file`
}, { quoted: m});
}

  try {
    const apiEndpoint = `https://api.vreden.my.id/api/mediafiredl?url=${encodeURIComponent(text)}`;
    const response = await fetch(apiEndpoint);
    const apiData = await response.json();

    const fileData = apiData?.result?.[0];
    if (!fileData?.link ||!fileData?.nama ||!fileData?.size) {
      return conn.sendMessage(m.chat, {
        text: '⚠️ No se pudo obtener la información del archivo desde MediaFire o la API no devolvió datos válidos.'
}, { quoted: m});
}

    const fileName = fileData.nama;
    const fileMime = fileData.mime || 'application/octet-stream';
    const fileLink = fileData.link;
    const fileSize = fileData.size;

    const infoMessage = `
---
🚀 *Descarga de MediaFire*
---
🗂 *Nombre del archivo:* ${fileName}
📦 *Tamaño:* ${fileSize}
📄 *Tipo:* ${fileMime}
🖥️ *Servidor:* ${fileData.server}
🔗 *Enlace directo:* ${fileLink}
`.trim();

    await conn.sendMessage(m.chat, { text: infoMessage}, { quoted: m});

    await conn.sendMessage(m.chat, {
      document: {
        url: fileLink,
        fileName: fileName,
        mimetype: fileMime
},
      caption: '✅ Archivo descargado desde MediaFire'
}, { quoted: m});

} catch (error) {
    console.error("Error en mediafireHandler:", error);
    await conn.sendMessage(m.chat, {
      text: `❌ Error al procesar la solicitud de MediaFire.\n🔍 Detalles: ${error.message}`
}, { quoted: m});
}
};

mediafireHandler.command = ['descargar', 'mf', 'mediafire'];
export default mediafireHandler;

