/* ⚠ POR FAVOR NO MODIFIQUES NADA DE AQUÍ ⚠ */


import {generateWAMessageFromContent} from "baileys";
import fs from 'fs';
const handler = async (m, {conn, usedPrefix, command}) => {
  const datas = global
  const idioma = datas.db.data.users[m.sender].language || global.defaultLenguaje
  const _translate = JSON.parse(fs.readFileSync(`./src/languages/${idioma}.json`))
  const tradutor = _translate.plugins.info_donar

  const name = await conn.getName(m.sender);
  const donar =`
*┏ ┅ ━━━━━━━━━━━━━━━━━ ┅ ━*
*┇          「 ${tradutor.texto1[0]} 」*
*┣ ┅ ━━━━━━━━━━━━━━━━━ ┅ ━*
*┃ ${tradutor.texto1[1]} ${name}*
*┃*
*┗ ┅ ━━━━━━━━━━━━━━━━━ ┅ ━*
`.trim();
  const aa = {quoted: m, userJid: conn.user.jid};
  const res = generateWAMessageFromContent(m.chat, {liveLocationMessage: {degreesLatitude: 0, degreesLongitude: 0, caption: donar, secuenceNumber: '0', contextInfo: {mentionedJid: conn.parseMention()}}}, aa);
  conn.relayMessage(m.chat, res.message, {});
};
handler.help = ['donasi'];
handler.tags = ['info'];
handler.command = /^dona(te|si)|donar|apoyar$/i;
export default handler;
