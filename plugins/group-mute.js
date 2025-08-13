
import baileys from '@whiskeysockets/baileys';
const { decodeJid } = baileys;

// 2) Tu lógica de mute/unmute con JID normalizado
let mutedUsers = new Set();

let handler = async (m, { conn, command, isAdmin, isBotAdmin }) => {
  if (!isBotAdmin) 
    return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
  if (!isAdmin) 
    return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

  if (!m.quoted) 
    return conn.reply(m.chat, '⭐ Responde al mensaje del usuario que quieres mutear.', m);

  // Normalizar JID del bot
  const rawBotJid = conn.user?.id || conn.user?.jid || conn.user;
  const botJid = decodeJid(rawBotJid);

  // Extraer y normalizar JID citado
  const ctx = m.message?.extendedTextMessage?.contextInfo || {};
  const participant = ctx.participant || m.quoted.sender;
  const targetJid = decodeJid(participant);

  // Bloquear autocastigo
  if (targetJid === botJid) {
    return conn.reply(
      m.chat,
      '🛑 *Hey pendejo*, ¿cómo me voy a mutear a mí misma? ¡Soy la voz imperial de este reino digital! 👑',
      m
    );
  }

  const username = targetJid.split('@')[0];
  if (command === 'mute') {
    mutedUsers.add(targetJid);
    conn.reply(m.chat, `✅ *Usuario muteado:* @${username}`, m, { mentions: [targetJid] });
  } else {
    mutedUsers.delete(targetJid);
    conn.reply(m.chat, `✅ *Usuario desmuteado:* @${username}`, m, { mentions: [targetJid] });
  }
};

handler.before = async (m, { conn }) => {
  if (mutedUsers.has(m.sender) && m.mtype !== 'stickerMessage') {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error(e);
    }
  }
};

handler.help = ['mute', 'unmute'];
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;