import fetch from 'node-fetch';

const SPOTIFY_SEARCH_API = 'https://api.vreden.my.id/api/spotifysearch?query=';
const SPOTIFY_DOWNLOAD_API = 'https://api.vreden.my.id/api/spotify?url=';

async function fetchSpotifySearch(query) {
  try {
    const res = await fetch(SPOTIFY_SEARCH_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.[0] || null;
  } catch {
    return null;
  }
}

async function fetchSpotifyDownload(spotifyUrl) {
  try {
    const res = await fetch(SPOTIFY_DOWNLOAD_API + encodeURIComponent(spotifyUrl));
    if (!res.ok) return null;
    const json = await res.json();
    return json.result?.music ? json.result : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply('🎧 Ingresa el nombre de la canción. Ejemplo: .music DJ Opus');

  try {
    const track = await fetchSpotifySearch(text);
    if (!track) return m.reply('⚠️ No se encontraron resultados en Spotify.');

    const { title, artist, album, duration, popularity, releaseDate, spotifyLink, coverArt } = track;

    const msgInfo = `
╔═ೋ═══❖═══ೋ═╗
║  🎼 𝑻𝒉𝒆 𝑴𝒊𝒌𝒖 𝑩𝒐𝒕 🎼
║  🌌 𝐒𝐩𝐨𝐭𝐢𝐟𝐲 𝐌𝐮𝐬𝐢𝐜 𝐑𝐢𝐭𝐮𝐚𝐥 🌌
╠═ೋ═══❖═══ೋ═╣
║ 🎵 Título: ${title}
║ 🧑‍🎤 Artista: ${artist}
║ 💿 Álbum: ${album}
║ ⏱️ Duración: ${duration}
║ 📈 Popularidad: ${popularity}
║ 📅 Lanzamiento: ${releaseDate}
║ 🔗 Spotify: ${spotifyLink}
║ 🌐 Servidor: Vreden API
╚═ೋ═══❖═══ೋ═╝
`.trim();

    await conn.sendMessage(m.chat, { image: { url: coverArt }, caption: msgInfo }, { quoted: m });

    const download = await fetchSpotifyDownload(spotifyLink);
    if (!download || !download.music) return m.reply('❌ No se pudo obtener el enlace de descarga.');

    await conn.sendMessage(m.chat, {
      audio: { url: download.music },
      mimetype: 'audio/mpeg',
      fileName: `${download.title || 'track'}.mp3`
    }, { quoted: m });

  } catch (e) {
    console.error(e);
    m.reply('❌ Error al procesar tu solicitud.');
  }
};

handler.command = ['music'];
handler.help = ['music <canción>'];
handler.tags = ['downloader'];
export default handler;
      
