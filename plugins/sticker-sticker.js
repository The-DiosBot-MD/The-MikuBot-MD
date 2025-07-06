
import { sticker} from '../lib/sticker.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import { webp2png} from '../lib/webp2mp4.js';

const emojiSticker = '🎨';
const emojiError = '❌';
const emojiLoading = '⌛';

let handler = async (m, { conn, args}) => {
  let stiker = false;

  try {
    let q = m.quoted? m.quoted: m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime) && (q.msg || q).seconds> 15) {
        return m.reply(`*${emojiError} ¡El video no puede durar más de 15 segundos!*`);
}

      let img = await q.download?.();
      if (!img) return conn.reply(m.chat, `📷 *Error al descargar el archivo. Intenta otra vez.*`, m);

      let out;
      try {
        let userId = m.sender;
        let pack = global.db.data.users[userId] || {};
        let texto1 = pack.text1 || '✨ Sticker Personalizado';
        let texto2 = pack.text2 || '📌 Miku bot';

        stiker = await sticker(img, false, texto1, texto2);
} finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img);
          else if (/image/g.test(mime)) out = await uploadImage(img);
          else if (/video/g.test(mime)) out = await uploadFile(img);
          if (typeof out!== 'string') out = await uploadImage(img);
          stiker = await sticker(false, out, '✨ Sticker Personalizado', '📌 Miku bot ');
}
}
} else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], '✨ Sticker Personalizado', '📌 The Miku bot');
} else {
        return m.reply(`*⚠️ URL incorrecto, verifica que sea una imagen válida (jpg/png/gif).*`);
}
} else {
      return m.reply(`
> ❗ *Atención* ❗

*Error: has usado mal el comando.s*

✅ Usa este comando respondiendo a una imagen o video con menos de 15 segundos
`);
}
} finally {
    if (stiker) {
      conn.sendFile(m.chat, stiker, 'sticker.webp', '', m,rcanal );
}
}
};

handler.help = ['s <img> / <url>'];
handler.tags = ['sticker'];
handler.command = ['s', 'sticker', 'stiker'];

export default handler;

const isUrl = (text) => {
  return /^https?:\/\/[^ ]+\.(jpg|jpeg|png|gif)$/i.test(text);
};