import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*ACCIÓN MAL USADA* *Ejemplo:*\n${usedPrefix + command} hola remix dalex`;

    try {
        m.react('⌛️');

        const track = await spotifySearch(text);
        if (!track) throw 'No se encontró la canción en Spotify.';

        const apikey = 'Rayo';
        const apiUrl = `https://gokublack.xyz/download/Spotify?url=${encodeURIComponent(track.url)}&apikey=${apikey}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.data) throw "No se pudo obtener la canción desde GokuBlack.";

        const song = data.data;
        const info = `🪼 *Titulo:*\n${song.titulo}\n\n🪩 *Artista:*\n${song.artista}\n\n⏳ *Tipo:*\n${song.tipo}\n\n🕒 *Fecha:*\n${song.fecha}\n\n🔗 *Enlace:*\n${song.url}`;

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

handler.command = ['spotify', 'music'];
export default handler;

async function spotifySearch(query) {
    const token = await getSpotifyToken();
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const track = response.data.tracks.items[0];
    if (!track) return null;
    return {
        name: track.name,
        artista: track.artists.map(a => a.name).join(', '),
        url: track.external_urls.spotify
    };
}

async function getSpotifyToken() {
    const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3';
    const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009';
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
        headers: {
            Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
}