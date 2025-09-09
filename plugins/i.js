// *`[🕯️ DALLE 🕯️]`* 

import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, '✨ Por favor proporciona una descripción para invocar la imagen.', m);
        return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://apis-starlights-team.koyeb.app/starlight/txt-to-image2?text=${encodeURIComponent(prompt)}`;

    try {
        conn.reply(m.chat, '*🧧 Invocando los trazos del universo...*', m);

        const response = await axios.get(apiUrl);

        
        if (response.data?.data?.image) {
            const imageUrl = response.data.data.image;

            await conn.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
        } else {
            throw new Error('⚠️ No se encontró la imagen en la respuesta ritual.');
        }
    } catch (error) {
        console.error('🩸 Error al generar la imagen:', error);
        await conn.reply(m.chat, `🚫 Error: ${error.message}`, m);
    }
};

handler.command = ['dalle'];
handler.help = ['dalle'];
handler.tags = ['tools'];

export default handler;