import fetch from 'node-fetch';

const DELIRIUS_API = 'https://delirius-apiofc.vercel.app/search/tenor?q=';

// Palabras que desactivan el caption ritual (por si decides usarlo más adelante)
const bannedWords = [
  'make america great again',
  'trump',
  'politics',
  'president',
  'flag',
  'gun',
  'violence',
  'racist',
  'maga',
  'nazi'
];

async function fetchTenorMedia(query) {
  try {
    const res = await fetch(DELIRIUS_API + encodeURIComponent(query));
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json.data) ? json.data.slice(0, 5) : null;
  } catch {
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) {
    return m.reply(`
╔═ೋ══❖══ೋ═╗
⚠️ *Uso incorrecto del comando*
🧠 Escribe: *.tenor <búsqueda>*
📌 Ejemplo: *.tenor nayeon*
╚═ೋ══❖══ೋ═╝
`.trim());
  }

  const query = text.trim();
  const media = await fetchTenorMedia(query);

  if (!media || media.length === 0) {
    return m.reply(`⚠️ No se encontraron resultados visuales para: *${query}*`);
  }

  for (const item of media) {
    await conn.sendFile(m.chat, item.mp4, 'tenor.mp4', '', m);
  }
};

handler.command = ['tenor'];
handler.help = ['tenor <tema>'];
handler.tags = ['buscadores'];
export default handler;
