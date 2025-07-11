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
    const { result} = await response.json();

    const fileData = result?.[0];
    if (!fileData?.link ||!fileData?.nama) {
      return conn.sendMessage(m.chat, {
        text: '⚠️ No se pudo obtener el archivo desde MediaFire.'
}, { quoted: m});
}

    const fileName = decodeURIComponent(fileData.nama);
    const fileMime = fileData.mime || 'application/octet-stream';
    const fileLink = fileData.link;

    const infoMessage = `
🗂 *Nombre del archivo:* ${fileName}
📄 *Tipo:* ${fileMime}
📦 *Tamaño:* ${fileData.size}
🖥️ *Servidor:* ${fileData.server}
🔗 *Enlace:* ${fileLink}
    `.trim();

    await conn.sendMessage(m.chat, { text: infoMessage}, { quoted: m});

    await conn.sendMessage(m.chat, {
      document: {
        url: fileLink,
        fileName,
        mimetype: fileMime
},
      caption: '✅ Archivo descargado desde MediaFire'
}, { quoted: m});

} catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, {
      text: `❌ Error al conectar con la API.\n🔍 Detalles: ${error.message}`
}, { quoted: m});
}
};

mediafireHandler.command = ['descargar', 'mf', 'mediafire'];
export default mediafireHandler;