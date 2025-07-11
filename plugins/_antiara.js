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
📥 *Descarga disponible:*

📂 *Nombre:* ${fileName}
📄 *Tipo:* ${result.mime}
📦 *Tamaño:* ${result.size}
🖥️ *Servidor:* ${result.server}
🔗 *Enlace directo:* ${result.link}

✅ Puedes hacer clic en el enlace para ir directamente a MediaFire y descargar el archivo.
    `.trim();

    await conn.sendMessage(m.chat, { text: message}, { quoted: m});

} catch (err) {
    console.error(err);
    m.reply(`⚠️ Error al conectar con la API.\n🔍 ${err.message}`);
}
};

handler.command = ['mf'];
export default handler;
