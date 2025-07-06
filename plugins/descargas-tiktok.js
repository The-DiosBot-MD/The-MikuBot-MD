import fetch from 'node-fetch';

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return conn.reply(m.chat, '❌ ¡Necesito un enlace de TikTok! Por favor, proporciona uno.', m);
    }

    try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (!result || result.code !== 0 || !result.data || !result.data.play) {
            return conn.reply(m.chat, '❌ No pude descargar el video. Asegúrate de que el enlace sea correcto y público.', m);
        }

        const videoUrl = result.data.play;
        const videoUrlNoWm = result.data.wmplay;

        const finalVideoUrl = videoUrlNoWm || videoUrl;

        const author = result.data.author?.nickname || 'Desconocido';
        const description = result.data.title || 'Sin descripción';
        const duration = result.data.duration ? formatDuration(result.data.duration) : 'N/A';
        const size = result.data.size ? `${(result.data.size / (1024 * 1024)).toFixed(2)} MB` : 'N/A';

        const caption = `
✅ *TikTok descargado:*

👤 *Autor:* ${author}
📝 *Descripción:* ${description}
⏳ *Duración:* ${duration}
📏 *Tamaño:* ${size}
`;

        await conn.sendMessage(m.chat, {
            video: { url: finalVideoUrl },
            caption: caption,
        }, { quoted: m });

    } catch (error) {
        console.error('Error al descargar TikTok:', error);
        conn.reply(m.chat, '❌ ¡Oops! Algo salió mal al intentar descargar el video.', m);
    }
};

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

handler.command = /^(tiktok|tt|)$/i;

export default handler;
