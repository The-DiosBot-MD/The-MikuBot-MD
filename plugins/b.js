import { sticker } from '../lib/sticker.js'

let handler = async(m, { conn, text, args, usedPrefix, command }) => {

if (!text) return m.reply(《★》Ingresa Un Texto Para Realizar Tu Sticker\n> *Ejemplo:* ${usedPrefix + command} ${botname});

try {
let username = conn.getName(m.sender);
let stiker = await sticker(null,https://star-void-api.vercel.app/api/brat?text=${text}, text, username)
conn.sendFile(m.chat, stiker, 'sticker.webp', '',m, true, { contextInfo: { 'forwardingScore': 200, 'isForwarded': false, externalAdReply:{ showAdAttribution: false, title: text, body: username, mediaType: 2, sourceUrl: redes, thumbnail: imagen1 }}}, { quoted: m })

} catch (e) {
m.reply(${e.message})
}}

handler.help = ['brat'];
handler.tag = ['sticker'];
handler.command = ['brat'];

export default handler;
