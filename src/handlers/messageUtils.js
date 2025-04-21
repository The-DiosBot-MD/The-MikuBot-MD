export class MessageUtils {
// Función para obtener datos
getMessageDetails(platform, message) {
let m = {
userName: 'Desconocido',
text: '',
chat: ''
}
const msg = message
switch (platform) {
    
case 'whatsapp':
m.userName = msg.pushName || 'Desconocido'
m.text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
m.chat = msg.key.remoteJid || msg.key.participant || ''
break

case 'telegram':
m.userName = msg.from.first_name || 'Desconocido'
m.text = msg.text || ''
m.chat = msg.chat.id || ''
break
    
case 'discord':
m.userName = msg.author.username || 'Desconocido'
m.text = msg.content || ''
m.chat = msg.guild.id || ''
break
    
case 'instagram':
m.userName = msg.user.username || 'Desconocido'
m.text = msg.text || ''
m.chat = msg.thread.id || ''
break
    
case 'messenger':
m.userName = msg.sender.name || 'Desconocido'
m.text = msg.message.text || ''
m.chat = msg.sender.id || ''
break
    
case 'threads':
m.userName = msg.user.username || 'Desconocido'
m.text = msg.text || ''
m.chat = msg.thread.id || ''
break
default:
console.log('Plataforma desconocida')
break
}
return m
}}
