

import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, '✨ Por favor proporciona una descripción para invocar la imagen.', m);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://api.vreden.my.id/api/artificial/text2image?prompt=${encodeURIComponent(prompt)}`;

    try {
        conn.reply(m.chat, '*🎐 Invocando la imagen ...*', m);

        const response = await axios.get(apiUrl);
        const result = response.data?.result;

        if (result?.status && result?.download) {
            const imageUrl = result.download;

            await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `> Aquí está tu imagen` }, { quoted: m });
        } else {
            throw new Error('⚠️ La imagen no fue revelada.');
        }
    } catch (error) {
        console.error('🩸 Error al generar la imagen:', error);
        await conn.reply(m.chat, `🚫 Error: ${error.message}`, m);
    }
};

handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['ai'];

export default handler;