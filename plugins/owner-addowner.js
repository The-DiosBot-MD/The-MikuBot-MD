const emojiAdd = '✅'; // Emoji para agregar owner
const emojiRemove = '❌'; // Emoji para eliminar owner
const emojiWarning = '⚠️'; // Emoji de advertencia

const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const who = m.mentionedJid?.[0] || m.quoted?.sender || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false);
  const why = `${emojiWarning} Por favor, menciona a un usuario para agregar o quitar como owner.`;

  // 🌸 Si el bot ejecuta el comando, lo ignora completamente
  if (m.sender === conn.user.jid) return;

  if (!who) return conn.reply(m.chat, why, m, { mentions: [m.sender] });

  switch (command) {
    case 'addowner':
      global.owner.push([who]);
      await conn.reply(m.chat, `${emojiAdd} Listo, el usuario ha sido agregado a la lista de owners.`, m);
      break;

    case 'delowner':
      const index = global.owner.findIndex(owner => owner[0] === who);
      if (index !== -1) {
        global.owner.splice(index, 1);
        await conn.reply(m.chat, `${emojiRemove} El número ha sido eliminado correctamente de la lista de owners.`, m);
      } else {
        await conn.reply(m.chat, `${emojiWarning} El número no está en la lista de owners.`, m);
      }
      break;
  }
};

handler.command = ['addowner', 'delowner'];

export default handler;