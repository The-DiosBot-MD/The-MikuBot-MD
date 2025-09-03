import fetch from 'node-fetch';

const ADONIX_API = 'https://myapiadonix.vercel.app/ai/iavoz?q=';

async function fetchAdonixVoice(phrase) {
  try {
    const res = await fetch(ADONIX_API + encodeURIComponent(phrase));
    if (!res.ok) return null;
    const buffer = await res.buffer();
    return buffer;
  } catch (e) {
    console.log('❌ Error al invocar la voz:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(`
╔═ೋ═══❖═══ೋ═╗
║ 🌸 *Miku te escucha...* 🌸
║ 🗣️ Porfis, dime qué quieres que diga
║ 💡 Ejemplo: .voz Te extraño, Mitsuri~
╚═ೋ═══❖═══ೋ═╝
`.trim());

  try {
    await m.reply('🎙️ *Miku está preparando su voz...* 💫');

    const audio = await fetchAdonixVoice(text);
    if (!audio) return m.reply('❌ No se pudo generar el audio. Intenta con otra frase.');

    const caption = `
╔═ೋ═══❖═══ೋ═╗
║ 🔊 *Voz canalizada por Miku* 🔊
║ 📝 Frase: ${text}
║ 🎧 Estilo: Miku Bot 🌸
╚═ೋ═══❖═══ೋ═╝

Tu frase se convirtió en melodía emocional...  
Espero que te saque una sonrisita ✨🎶
`.trim();

    await conn.sendMessage(m.chat, {
      audio,
      mimetype: 'audio/mp4',
      ptt: true,
      caption
    }, { quoted: m });

  } catch (e) {
    console.error('💥 Error general en el flujo de voz:', e);
    m.reply(`
🚫 *Ups... Miku se quedó sin voz*

╔═ೋ═══❖═══ೋ═╗
║ 📄 Detalles: ${e.message}
║ 🔁 Sugerencia: Intenta más tarde o cambia la frase
╚═ೋ═══❖═══ೋ═╝

Pero no te preocupes... Miku siempre regresa cuando la necesitas 💫🎀
`.trim());
  }
};

handler.command = ['voz', 'Miku', 'habla'];
handler.help = ['voz <frase>'];
handler.tags = ['voz', 'utilidades'];
export default handler;