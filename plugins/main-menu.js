
import { xpRange} from '../lib/levelling.js';

const clockString = ms => {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const imagen = "https://i.ibb.co/LYZrgRs/The-Miku-Bot-MD.jpg";

const menuHeader = `
╭━━━「 🌸 The-MikuBot-MD 」━━━╮
┃ ¡Hola, %name!
┃ Nivel: %level | XP: %exp/%max
┃ Límite: %limit | Modo: %mode
┃ Uptime: %uptime | Usuarios: %total
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`;

const sectionDivider = `╰───────────────╯`;

const menuFooter = `
╭────────────┈
│ 💡 Usa cada comando con su prefijo.
│ ✨ El bot perfecto para animarte.
│ 🛠 Desarrollado por @Miku-Staff
╰────────────┈
`;

let handler = async (m, { conn, usedPrefix: _p}) => {
  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
},
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}
},
    participant: "0@s.whatsapp.net"
};

  try {
    const user = global.db.data.users[m.sender] || { level: 1, exp: 0, limit: 5};
    const { exp, level, limit} = user;
    const { min, xp} = xpRange(level, global.multiplier || 1);
    const totalreg = Object.keys(global.db?.data?.users || {}).length;
    const mode = global.opts?.self? 'Privado 🔒': 'Público 🌐';
    const uptime = clockString(process.uptime() * 1000);
    const name = await conn.getName(m.sender) || "Usuario";

    let categorizedCommands = {
      "🎭 Anime": new Set(),
      "ℹ️ Info": new Set(),
      "🔎 Search": new Set(),
      "🎮 Game": new Set(),
      "🤖 SubBots": new Set(),
      "🌀 RPG": new Set(),
      "📝 Registro": new Set(),
      "🎨 Sticker": new Set(),
      "🖼️ Imagen": new Set(),
      "🖌️ Logo": new Set(),
      "⚙️ Configuración": new Set(),
      "💎 Premium": new Set(),
      "📥 Descargas": new Set(),
      "🛠️ Herramientas": new Set(),
      "🎉 Diversión": new Set(),
      "🔞 NSFW": new Set(),
      "📀 Base de Datos": new Set(),
      "🔊 Audios": new Set(),
      "🗝️ Avanzado": new Set(),
      "🔥 Free Fire": new Set(),
      "Otros": new Set()
};

    for (const plugin of Object.values(global.plugins)) {
      if (plugin?.help &&!plugin.disabled) {
        const cmds = Array.isArray(plugin.help)? plugin.help: [plugin.help];
        const tagKey = Object.keys(categorizedCommands).find(key => {
          const clean = key.replace(/[^a-z]/gi, '').toLowerCase();
          return plugin.tags?.includes(clean);
}) || "Otros";
        cmds.forEach(cmd => categorizedCommands[tagKey].add(cmd));
}
}

    const menuBody = Object.entries(categorizedCommands)
.filter(([_, cmds]) => cmds.size> 0)
.map(([title, cmds]) => {
        const entries = [...cmds].map(cmd => {
          const plugin = Object.values(global.plugins).find(p => Array.isArray(p.help)? p.help.includes(cmd): p.help === cmd);
          const premium = plugin?.premium? '💎': '';
          const limited = plugin?.limit? '🌀': '';
          return `│ 🌸 _${_p}${cmd}_ ${premium}${limited}`.trim();
}).join('\n');
        return `╭─「 ${title} 」\n${entries}\n${sectionDivider}`;
}).join('\n\n');

    const finalHeader = menuHeader
.replace('%name', name)
.replace('%level', level)
.replace('%exp', exp - min)
.replace('%max', xp)
.replace('%limit', limit)
.replace('%mode', mode)
.replace('%uptime', uptime)
.replace('%total', totalreg);
const fullMenu = `${finalHeader}\n\n${menuBody}\n\n${menuFooter}`.trim();

    await conn.sendMessage(m.chat, {
      image: { url: imagen},
      caption: fullMenu,
      mentions: [m.sender]
}, { quoted: fkontak});

} catch (e) {
    console.error(e);
    conn.reply(m.chat, '⚠️ Error al generar el menú. Intenta de nuevo.', m);
}
};

handler.command = ['menu', 'help', 'menú'];
export default handler;
