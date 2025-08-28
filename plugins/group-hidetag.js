import { generateWAMessageFromContent} from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants}) => {
  try {
    const users = participants.map(u => conn.decodeJid(u.id));
    const sello = '\n\n— 〘 🌸 𝙈𝙞𝙠𝙪 ✦ 𝘽𝙤𝙩  🌸 〙';

    const q = m.quoted? m.quoted: m;
    const c = m.quoted? await m.getQuotedObj(): m;
    const content = { [m.quoted? q.mtype: 'extendedTextMessage']: m.quoted? c.message[q.mtype]: { text: '' || c}};

    const msg = conn.cMod(
      m.chat,
      generateWAMessageFromContent(m.chat, content, {
        quoted: m,
        userJid: conn.user.id
}),
      (text || q.text || '') + sello,
      conn.user.jid,
      { mentions: users}
);

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});
} catch {
    const users = participants.map(u => conn.decodeJid(u.id));
    const q = m.quoted || m;
    const mime = (q.msg || q).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const sello = '\n\n— 𝑬𝒏𝒗𝒊𝒂𝒅𝒐 𝒑𝒐𝒓: *Miku Bot 🌸*';

    if (isMedia) {
      const mediax = await q.download?.();
      const options = { mentions: users, quoted: m};

      switch (q.mtype) {
        case 'imageMessage':
          await conn.sendMessage(m.chat, { image: mediax, caption: (text || '') + sello,...options});
          break;
        case 'videoMessage':
          await conn.sendMessage(m.chat, { video: mediax, caption: (text || '') + sello, mimetype: 'video/mp4',...options});
          break;
        case 'audioMessage':
          await conn.sendMessage(m.chat, { audio: mediax, mimetype: 'audio/mpeg', fileName: 'hidetag.mp3',...options});
          break;
        case 'stickerMessage':
          await conn.sendMessage(m.chat, { sticker: mediax,...options});
          break;
}
} else {
      const invisible = String.fromCharCode(8206).repeat(850);
      const fullText = invisible + (text || '') + sello;

      await conn.sendMessage(m.chat, {
        text: fullText,
        mentions: users
}, { quoted: m});
}
}
};

handler.help = ['hidetag'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
