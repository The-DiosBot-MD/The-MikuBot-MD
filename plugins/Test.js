import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  const query = args.join(' ') || 'Anime';
  const apiUrl = `https://sky-api-ashy.vercel.app/search/images?q=${encodeURIComponent(query)}&limit=5`;

  try {
    await m.react('🌌'); // Inicio ritual

    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.images?.length) {
      await m.react('❌');
      return conn.reply(m.chat, `🫧 No se encontraron imágenes para *${query}*.`, m);
    }

    for (const img of json.result.images) {
      await conn.sendFile(m.chat, img.url, 'imagen.jpg', '', m); // Sin texto
    }

    await m.react('✅'); // Cierre ritual

  } catch (e) {
    console.error('Error en el plugin:', e);
    await m.react('⚠️');
    conn.reply(m.chat, `🚫 Error al buscar imágenes: ${e.message}`, m);
  }
};

handler.command = ['test', 'imganime'];
handler.help = ['test <término>'];
handler.tags = ['search'];

export default handler;