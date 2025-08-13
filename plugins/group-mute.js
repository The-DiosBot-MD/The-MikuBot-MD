let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
  if (!isBotAdmin) 
    return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
  if (!isAdmin) 
    return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

  // 1) Asegurarnos de que haya mensaje citado
  if (!m.quoted) {
    return conn.reply(m.chat, '⭐ Responde al mensaje del usuario que quieres mutear.', m);
  }

  // 2) Protección definitiva: si el citado es un mensaje fromMe (del propio bot), se bloquea
  if (m.quoted.key?.fromMe) {
    return conn.reply(
      m.chat,
      '🛑 *Hey pendejo*, ¿cómo me voy a mutear a mí misma?',
      m
    );
  }

  // 3) Extraemos el JID del objetivo
  const user = m.quoted.sender;
  const target = user.split('@')[0];

  // 4) Ejecutamos la acción
  if (command === 'mute') {
    mutedUsers.add(user);
    conn.reply(
      m.chat,
      `✅ *Usuario muteado:* @${target}`,
      m,
      { mentions: [user] }
    );
  } else if (command === 'unmute') {
    mutedUsers.delete(user);
    conn.reply(
      m.chat,
      `✅ *Usuario desmuteado:* @${target}`,
      m,
      { mentions: [user] }
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