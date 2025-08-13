let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  
  if (!isBotAdmin) 
    return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
  if (!isAdmin) 
    return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

  if (!m.quoted) 
    return conn.reply(m.chat, '⭐ Responde al mensaje del usuario que quieres mutear.', m);

  // 1) Extraer el JID citado de forma infalible
  const quotedKey = m.quoted.key || {};
  let targetJid;

  if (quotedKey.fromMe) {
    // Si el bot es quien envió el mensaje
    targetJid = conn.user.jid;
  } else if (quotedKey.participant) {
    // En grupos, el remitente original está en participant
    targetJid = quotedKey.participant;
  } else if (m.quoted.sender) {
    // En otros entornos puede venir aquí
    targetJid = m.quoted.sender;
  } else {
    // Fallback
    targetJid = quotedKey.remoteJid || '';
  }

  // 2) Depuración en consola (elimina o comenta tras probar)
  console.log('[DEBUG] botJid =', conn.user.jid);
  console.log('[DEBUG] quoted.fromMe =', quotedKey.fromMe);
  console.log('[DEBUG] quoted.participant =', quotedKey.participant);
  console.log('[DEBUG] quoted.sender =', m.quoted.sender);
  console.log('[DEBUG] resolved targetJid =', targetJid);

  // 3) Bloquear intento de autocastigo
  if (targetJid === conn.user.jid) {
    return conn.reply(
      m.chat,
      '🛑 *Hey pendejo*, ¿cómo me voy a mutear a mí misma?',
      m
    );
  }

  // 4) Proceder con mute/unmute
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