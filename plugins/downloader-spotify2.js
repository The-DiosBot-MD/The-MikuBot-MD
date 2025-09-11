import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*ACCIÓN MAL USADA* *Ejemplo:*\n${usedPrefix + command} https://open.spotify.com/track/2mdrVnxEnPR6iFijakkxQS`;

    try {
        m.react('🍆');

        const spotifyUrl = text.trim();
        if (!spotifyUrl.startsWith('https://open.spotify.com/')) throw '> URL inválida. Debe ser un enlace de Spotify válido';

        const apikey = 'Rayo';
        const apiUrl = `https://gokublack.xyz/download/Spotify?url=${encodeURIComponent(spotifyUrl)}&apikey=${apikey}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.data) throw "No se pudo obtener la canción con la api gokublack.xyz";

        const song = data.data;
        const info = `🪼 *Titulo:*\n${song.titulo}\n\n🪩 *Artista:*\n${song.artista}\n\n🔗 *Enlace:*\n${song.url}`;

        await conn.sendMessage(m.chat, { 
            text: info, 
            contextInfo: { 
                forwardingScore: 9999999, 
                isForwarded: true, 
                externalAdReply: {
                    showAdAttribution: true,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    title: song.titulo,
                    mediaType: 1,
                    thumbnailUrl: song.cover,
                    mediaUrl: song.url,
                    sourceUrl: song.url
                }
            }
        }, { quoted: m });

        await conn.sendMessage(m.chat, { 
            audio: { url: song.url }, 
            fileName: `${song.titulo}.mp3`, 
            mimetype: 'audio/mpeg' 
        }, { quoted: m });

        m.react('✅');

    } catch (e) {
        m.react('❌');
        m.reply(`❌ Ocurrió un error inesperado: ${e.message || e}`);
    }
};

handler.command = ['spotify', 'music1'];
export default handler;