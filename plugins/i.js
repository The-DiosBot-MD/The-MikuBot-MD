

import axios from 'axios';

const handler = async (m, { conn, args }) => {
    if (!args[0]) {
        await conn.reply(m.chat, '✨ Por favor proporciona una descripción para invocar la imagen.', m);
        return;
    }

    const prompt = args.join(' ');
    const ratio = '9:19'; // Puedes hacerlo dinámico si lo deseas

    const apiUrl = `https://api.dorratz.com/v3/ai-image?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;

    try {
        conn.reply(m.chat, '*🧧 Invocando los trazos del universo con proporción sagrada...*', m);

        const response = await axios.get(apiUrl);
        const imageUrl = response.data?.data?.image_link;

        if (imageUrl) {
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