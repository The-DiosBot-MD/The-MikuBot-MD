import fetch from 'node-fetch';

const ADONIX_API = 'https://myapiadonix.casacam.net/ai/iavoz?q=';

// Función para llamar a la API y obtener el audio en buffer
async function fetchAdonixVoice(phrase) {
  try {
    const res = await fetch(ADONIX_API + encodeURIComponent(phrase));
    if (!res.ok) {
      console.log('❌ Error HTTP al invocar la API:', res.status);
      return null;
    }

    const data = await res.json(); // parseamos JSON
    if (!data.audio_base64) {
      console.log('❌ La API no devolvió audio');
      return null;
    }

    const buffer = Buffer.from(data.audio_base64, 'base64'); // convertimos Base64 a buffer
    return buffer;

  } catch (e) {
    console.log('❌ Error al invocar la voz:', e);
    return null;
  }
}

let handler = async (m, { text, conn, command }) => {
  if (!text) return m.reply(
    `╔═ೋ═══❖═══ೋ═╗
║ 🌸 *Miku te escucha...* 🌸
║ 🗣️ Porfis, dime qué quieres que diga
║ 💡 Ejemplo: .voz Te extraño, Mitsuri~
╚═ೋ═══❖═══ೋ═╝`
  );

  try {
    await m.reply('🎙️ Miku está preparando su voz... 💫');

    const audio = await fetchAdonixVoice(text);
    if (!audio) return m.reply('❌ No se pudo generar el audio. Intenta con otra frase.');

    const caption = `
╔═ೋ═══❖═══ೋ═╗
║ 🔊 Voz canalizada por Miku 🔊
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
🚫 Ups... Miku se quedó sin voz

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