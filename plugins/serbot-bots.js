import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path' 
import ws from 'ws';

let handler = async (m, { conn, command, usedPrefix, args, text, isOwner}) => {
const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command)  
const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command)  
const isCommand3 = /^(bots|listjadibots|subbots)$/i.test(command)   

async function reportError(e) {
await m.reply(`âœ¦ OcurriÃ³ un error inesperado`)
console.log(e)
}

function inicializarTiempoSubbot(subbot) {
if (!subbot.startTime) {
subbot.startTime = Date.now();
}
if (!subbot.connectionStartTime) {
subbot.connectionStartTime = Date.now();
}
return subbot;
}

switch (true) {       
case isCommand1:
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let uniqid = `${who.split`@`[0]}`
const jadi = global.opts["jadibot"] || "jadibots"
const path = `./${jadi}/${uniqid}`

if (!await fs.existsSync(path)) {
await conn.sendMessage(m.chat, { text: `*No tiene una sesion activa, cree una utilizando:*\n${usedPrefix + command}\n\n*Si tiene una *(ID)* puede usar para saltarse el paso anterior usando:*\n*${usedPrefix + command}* \`\`\`(ID)\`\`\`` }, { quoted: m })
return
}
if (global.conn.user.jid !== conn.user.jid) return conn.sendMessage(m.chat, {text: `tilice este comando con el bot principal*.\n\n*https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0*`}, { quoted: m }) 
else {
await conn.sendMessage(m.chat, { text: ` La sesion JadiBot fue eliminada*` }, { quoted: m })}
try {
fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true })
await conn.sendMessage(m.chat, { text : ` La sesion fue cerrada.*` } , { quoted: m })
} catch (e) {
reportError(e)
}  
break

case isCommand2:
if (global.conn.user.jid == conn.user.jid) conn.reply(m.chat, ` Si no tiene una sesion de JadiBot envia mensaje al bot principal para convertirse en SUB`, m)
else {
await conn.reply(m.chat, `ðŸŒ¼ ${global.botname || 'Bot'} Desactivado.`, m)
conn.ws.close()}  
break

case isCommand3:
const users = [...new Set([...global.conns.filter((conn) => {
if (!conn.user || !conn.ws || !conn.ws.socket) return false;
if (conn.ws.socket.readyState === ws.CLOSED) return false;

inicializarTiempoSubbot(conn);
return true;
}).map((conn) => conn)])];

function calcularTiempoTranscurrido(startTime) {
if (!startTime || isNaN(startTime)) {
return { dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0 };
}

const ahora = Date.now();
const tiempoTranscurrido = Math.max(0, ahora - startTime);
const segundosTotales = Math.floor(tiempoTranscurrido / 1000);

const dias = Math.floor(segundosTotales / 86400);
const horas = Math.floor((segundosTotales % 86400) / 3600);
const minutos = Math.floor((segundosTotales % 3600) / 60);
const segundos = segundosTotales % 60;

return { dias, horas, minutos, segundos, total: tiempoTranscurrido };
}

function formatearTiempo(tiempo) {
const { dias, horas, minutos, segundos } = tiempo;
let partes = [];

if (dias > 0) partes.push(`${dias}d`);
if (horas > 0) partes.push(`${horas}h`);
if (minutos > 0) partes.push(`${minutos}m`);
if (segundos > 0 || partes.length === 0) partes.push(`${segundos}s`);

return partes.join(' ');
}

function obtenerTiempoConexion(subbot) {
let startTime = null;

if (subbot.connectionStartTime && !isNaN(subbot.connectionStartTime)) {
startTime = subbot.connectionStartTime;
} else if (subbot.startTime && !isNaN(subbot.startTime)) {
startTime = subbot.startTime;
} else if (subbot.uptime && !isNaN(subbot.uptime)) {
startTime = subbot.uptime;
} else {
startTime = Date.now() - 60000;
}

const tiempo = calcularTiempoTranscurrido(startTime);
return {
formateado: formatearTiempo(tiempo),
timestamp: startTime,
transcurrido: tiempo.total
};
}

function obtenerEstadoConexion(subbot) {
if (!subbot.ws || !subbot.ws.socket) return 'ðŸ”´ Desconectado';

switch (subbot.ws.socket.readyState) {
case ws.CONNECTING: return 'ðŸŸ¡ Conectando';
case ws.OPEN: return 'ðŸŸ¢ Activo';
case ws.CLOSING: return 'ðŸŸ  Cerrando';
case ws.CLOSED: return 'ðŸ”´ Cerrado';
default: return 'âšª Desconocido';
}
}

const ahora = new Date();
const horaActual = ahora.toLocaleTimeString('es-ES', { 
hour12: false, 
hour: '2-digit', 
minute: '2-digit', 
second: '2-digit' 
});

const message = users.map((v, index) => {
const numero = v.user.jid.replace(/[^0-9]/g, '');
const nombre = v.user.name || 'JadiBot';
const tiempoInfo = obtenerTiempoConexion(v);
const estado = obtenerEstadoConexion(v);

return `â€ *${index + 1}*
*ðŸ“± +${numero}*
*ðŸ‘¤ Usuario:* ${nombre}
*â° Conectado:* ${tiempoInfo.formateado}
*ðŸ”— Estado:* ${estado}
*ðŸ“… Desde:* ${new Date(tiempoInfo.timestamp).toLocaleString('es-ES')}`;
}).join('\n\n> ________________\n\n');

const replyMessage = message.length === 0 ? `*âœ¦ No hay JadiBots conectados*` : message;
const totalUsers = users.length;

let tiempoTotalMs = 0;
let subbotsMasAntiguo = null;
let tiempoMasLargo = 0;

users.forEach(v => {
const tiempoInfo = obtenerTiempoConexion(v);
tiempoTotalMs += tiempoInfo.transcurrido;
if (tiempoInfo.transcurrido > tiempoMasLargo) {
tiempoMasLargo = tiempoInfo.transcurrido;
subbotsMasAntiguo = v.user.name || 'JadiBot';
}
});

const tiempoPromedio = users.length > 0 ? tiempoTotalMs / users.length : 0;
const tiempoPromedioFormateado = formatearTiempo(calcularTiempoTranscurrido(Date.now() - tiempoPromedio));
const tiempoMasLargoFormateado = formatearTiempo(calcularTiempoTranscurrido(Date.now() - tiempoMasLargo));

const responseMessage = `ðŸŒ¼ *Lista de JadiBots Conectados*

\`\`\`Para convertirse en JadiBot use: .code\`\`\`

*Estadisticas en tiempo real:*
*Total activos:* ${totalUsers}

${replyMessage.trim()}

*ðŸ’¡ El tiempo se actualiza automÃ¡ticamente en cada consulta*`.trim();

await conn.sendMessage(m.chat, {text: responseMessage, mentions: conn.parseMention(responseMessage)}, {quoted: m})
break   
}}

handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarbot', 'bots', 'listjadibots', 'subbots']
export default handler
