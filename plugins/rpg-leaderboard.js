import fetch from 'node-fetch'
import fs from 'fs'
let handler = async (m, { conn, args, participants, usedPrefix }) => {
let users = Object.entries(global.db.data.users).map(([key, value]) => { 
return {...value, jid: key}
  })
let sortedExp = users.map(toNumber('exp')).sort(sort('exp'))
let sortedLim = users.map(toNumber('limit')).sort(sort('limit'))
let sortedMoney = users.map(toNumber('money')).sort(sort('money'))
let usersExp = sortedExp.map(enumGetKey)
let usersLim = sortedLim.map(enumGetKey)
let usersMoney = sortedMoney.map(enumGetKey)
           
let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedExp.length)
let text = `\`🏆 𝚃𝙰𝙱𝙻𝙰 𝙳𝙴 𝙲𝙻𝙰𝚂𝙸𝙲𝙰𝙲𝙸𝙾𝙽\`
    
💠 *𝐓𝐎𝐏 ${len} 𝐗𝐏 🎯* 
𝐓𝐮: *${usersExp.indexOf(m.sender) + 1}* 𝐝𝐞 *${usersExp.length} 𝐮𝐬𝐮𝐚𝐫𝐢𝐨𝐬*

${sortedExp.slice(0, len).map(({ jid, exp }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${formatNumber(exp)}* (${exp})⚡`).join`\n`}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

💠 *𝐓𝐎𝐏 ${len} 𝐃𝐈𝐀𝐌𝐀𝐍𝐓𝐄 💎* 
𝐓𝐮 : *${usersLim.indexOf(m.sender) + 1}* 𝐝𝐞́ *${usersLim.length} 𝐮𝐬𝐮𝐚𝐫𝐢𝐨𝐬*

${sortedLim.slice(0, len).map(({ jid, limit }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${formatNumber(limit)}* (${limit}) 💎`).join`\n`}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

💠 *𝐓𝐎𝐏 ${len} 𝐋𝐎𝐋𝐈𝐂𝐎𝐈𝐍𝐒 🪙*
𝐓𝐮 : *${usersMoney.indexOf(m.sender) + 1}* 𝐝𝐞 *${usersMoney.length} 𝐮𝐬𝐮𝐚𝐫𝐢𝐨𝐬*

${sortedMoney.slice(0, len).map(({ jid, money }, i) => `${i + 1}. ${participants.some(p => jid === p.jid) ? `(${conn.getName(jid)}) wa.me/` : '@'}${jid.split`@`[0]} *${formatNumber(money)}* (${money}) 🪙`).join`\n`}
`.trim()
await m.reply(text, null, { mentions: conn.parseMention(text) })
}
handler.help = ['top']
handler.tags = ['econ']
handler.command = ['leaderboard', 'lb', 'top'] 
handler.register = true
handler.fail = null
handler.exp = 3500
export default handler

function sort(property, ascending = true) {
if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
if (property) return (a, i, b) => {
return {...b[i], [property]: a[property] === undefined ? _default : a[property]}
}
else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
return a.jid
}

function formatNumber(num) {
    return num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' :
           num >= 1e3 ? (num / 1e3).toFixed(1) + 'k' :
           num.toString();
}

/*import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
let users = Object.entries(global.db.data.users)
.map(([key, value]) => ({ ...value, jid: key }))
.filter(user => user.jid && user.jid.endsWith('@s.whatsapp.net') && (user.money > 0 || user.limit > 0 || user.exp > 0)); 
let sortedUsers = users.sort((a, b) => (b.money + b.limit + b.exp) - (a.money + a.limit + a.exp)); 
let page = parseInt(args[0]) || 1;
let itemsPerPage = 10;
let totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
page = Math.max(1, Math.min(page, totalPages));
let start = (page - 1) * itemsPerPage;
let end = start + itemsPerPage;
let topUsers = sortedUsers.slice(start, end);
let text = `\`🏆 𝚃𝙰𝙱𝙻𝙰 𝙳𝙴 𝙲𝙻𝙰𝚂𝙸𝙲𝙰𝙲𝙸𝙾𝙽\`\n\n`;
text += topUsers.map(({ jid, money, limit, exp }, i) => {
let tag = `@${jid.replace(/@s\.whatsapp\.net$/, '')}`;
return `*${start + i + 1} ›* ${tag}\n*💎 Diamante:* ${formatNumber(limit)} (${limit.toLocaleString()})\n*🪙 LoliCoins:* ${formatNumber(money)} (${money.toLocaleString()})\n*✨ Exp:* ${formatNumber(exp)} (${exp.toLocaleString()})\n`;
}).join('\n');
text += `\n*• Página:* ${page}/${totalPages}`;
await m.reply(text, null, { mentions: conn.parseMention(text) });
};
handler.help = ['leaderboard', 'lb'];
handler.tags = ['econ'];
handler.command = ['leaderboard', 'lb', 'top'];
handler.register = true;
handler.exp = 3500;

export default handler;

function formatNumber(num) {
    return num >= 1e6 ? (num / 1e6).toFixed(1) + 'M' :
           num >= 1e3 ? (num / 1e3).toFixed(1) + 'k' :
           num.toString();
}

*/