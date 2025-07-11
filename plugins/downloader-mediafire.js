import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command}) => {
  if (!text ||!text.includes('mediafire.com')) {
    return conn.reply(
      m.chat,
      `📎 *Debes proporcionar un enlace válido de MediaFire.*\nEjemplo:\n${usedPrefix + command} https://www.mediafire.com/file/abc123/example.zip/file`,
      m
);
}

  try {
    const apiUrl = `https://api.vreden.my.id/api/mediafiredl?url=${encodeURIComponent(text)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    const result = data.result?.[0];
    if (!result?.status ||!result.link) {
      return m.reply('❌ No se pudo obtener el archivo desde MediaFire.');
}

    const fileName = decodeURIComponent(result.nama);
    const message = `
📂 *Nombre:* ${fileName}
📄 *Tipo:* ${result.mime}
📦 *Tamaño:* ${result.size}
🖥️ *Servidor:* ${result.server}
🔗 *Enlace directo:* ${result.link}
    `.trim();

    // Envía información del archivo
    await conn.sendMessage(m.chat, { text: message}, { quoted: m});

    // Envía el archivo como documento si el enlace lo permite
    await conn.sendMessage(m.chat, {
      document: {
        url: result.link,
        fileName,
        mimetype: result.mime || 'application/octet-stream'
},
      caption: '✅ Archivo descargado desde MediaFire'
}, { quoted: m});

} catch (err) {
    console.error(err);
    m.reply(`⚠️ Error al conectar con la API.\n🔍 ${err.message}`);
}
};

handler.command = ['mf', 'mediafire'];
export default handler;