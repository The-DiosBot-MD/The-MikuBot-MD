let mutedUsers = new Set();

let handler = async (m, { conn, command, isAdmin, isBotAdmin }) => {
  // 1) Validaciones administrativas
  if (!isBotAdmin) 
    return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
  if (!isAdmin) 
    return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

  // 2) Asegurarnos de que citen un mensaje
  if (!m.quoted) 
    return conn.reply(m.chat, '⭐ Responde al mensaje del usuario que quieres mutear.', m);

  // 3) Extraer JID del bot y del citado
  const botJid = conn.user?.jid || conn.user?.id || '';
  const quotedKey = m.quoted.key || {};
  // En grupos, el remitente original está en participant; si no, en m.quoted.sender
  const targetJid = (quotedKey.participant || m.quoted.sender || '').toString();

  // 4) Debug opcional (comenta o elimina después de probar)
  console.log('🛡️ [DEBUG] botJid      =', botJid);
  console.log('🛡️ [DEBUG] quotedKey    =', quotedKey);
  console.log('🛡️ [DEBUG] targetJid    =', targetJid);

  // 5) Bloquear autocastigo: si intentan mutear al bot
  if (targetJid === botJid) {
    return conn.reply(
      m.chat,
      '🛑 *Hey pendejo*, ¿cómo me voy a mutear a mí misma? ¡Soy la voz imperial de este reino digital! 👑',
      m
    );
  }

  // 6) Proceder con mute/unmute
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