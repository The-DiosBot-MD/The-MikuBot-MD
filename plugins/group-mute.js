let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {

  // 1) Validaciones administrativas
  if (!isBotAdmin) 
    return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
  if (!isAdmin) 
    return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

  // 2) Extraer target: primero por mención, si no, por reply
  let targetJid;
  if (m.mentionedJid && m.mentionedJid.length) {
    targetJid = m.mentionedJid[0];
  } else if (m.quoted) {
    // en grupos: participant; en chats privados: m.quoted.sender
    const q = m.quoted.key || {};
    targetJid = q.participant || m.quoted.sender;
  }

  // 3) Si no hay target válido, pedimos que respondan o mencionen
  if (!targetJid) {
    return conn.reply(
      m.chat,
      '⭐ Responde al mensaje o menciona al usuario que quieres mutear / desmutear.',
      m
    );
  }

  // 4) Protección anti-autocastigo
  const botJid = conn.user.jid || conn.user.id || '';
  if (targetJid === botJid) {
    return conn.reply(
      m.chat,
      '🛑 *Hey pendejo*, ¿cómo me voy a mutear a mí misma? ¡Soy la voz imperial de este reino digital! 👑',
      m
    );
  }

  // 5) Ejecutar mute o unmute
  const username = targetJid.split('@')[0];
  if (command === 'mute') {
    mutedUsers.add(targetJid);
    return conn.reply(
      m.chat,
      `✅ *Usuario muteado:* @${username}`,
      m,
      { mentions: [targetJid] }
    );
  } else {
    mutedUsers.delete(targetJid);
    return conn.reply(
      m.chat,
      `✅ *Usuario desmuteado:* @${username}`,
      m,
      { mentions: [targetJid] }
    );
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