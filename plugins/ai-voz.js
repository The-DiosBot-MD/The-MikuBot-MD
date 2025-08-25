import fetch from 'node-fetch';

const ADONIX_API = 'https://myapiadonix.vercel.app/api/adonixvoz?q=';

let handler = async (m, { text, conn }) => {
  if (!text) return m.reply(`
╭─❍🌸 *Miku dice...* 🌸❍─╮
│ Porfis, dime qué quieres que diga 💬
│ Ejemplo: *.voz Te quiero mucho, Miku~*
╰───────────────╯
`.trim());

  try {
    const audioUrl = `${ADONIX_API}${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      fileName: 'mikuvoz.mp4',
      ptt: true
    }, { quoted: m });

    await m.reply(`
╭─❍💖 *Miku te escuchó* 💖❍─╮
│ Aquí está tu mensaje en mi voz 🎶
│ Espero que te saque una sonrisita 🌈
╰───────────────╯
`.trim());

  } catch (e) {
    console.error('💥 Error en el flujo de voz:', e);
    m.reply(`
╭─❍💔 *Miku se tropezó* 💔❍─╮
│ No pude generar el audio... sniff 😢
│ ¿Intentamos de nuevo con otro texto?
╰───────────────╯
`.trim());
  }
};

handler.command = ['voz', 'Miku', 'habla'];
handler.help = ['voz <texto>'];
handler.tags = ['voz', 'utilidades'];
export default handler;