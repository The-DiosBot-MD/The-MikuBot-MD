import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  const query = args.join(' ') || 'Anime';
  const apiUrl = `https://sky-api-omega.vercel.app/search/images?q=${encodeURIComponent(query)}&limit=5`;

  try {
    await m.react('🌀'); // Ritual de inicio

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.images?.length) {
      await m.react('❌');
      return conn.reply(m.chat, `🌫️ No se encontraron imágenes para *${query}*. Intenta con otro término.`, m);
    }

    for (const img of json.result.images) {
      const caption = `🖼️ *${img.title}*\n📷 ${img.photographer}\n🔗 Fuente: ${img.source}`;
      await conn.sendFile(m.chat, img.url, 'imagen.jpg', caption, m);
    }

    await m.react('✅'); // Ritual de cierre

  } catch (e) {
    console.error('Error en el plugin:', e);
    await m.react('⚠️');
    conn.reply(m.chat, `🚫 Ocurrió un error al buscar imágenes: ${e.message}`, m);
  }
};

handler.command = ['test', 'imganime'];
handler.help = ['test <término>'];
handler.tags = ['search'];

export default handler;