let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw '⚠️ *_Ingrese el error que desea reportar._*'
    if (text.length < 10) throw '⚠️ *_Especifique bien el error, mínimo 10 caracteres._*'
    if (text.length > 1000) throw '⚠️ *_Máximo 1000 caracteres para enviar el error._*'

    const teks = `╭───────────────────
│⊷〘 *R E P O R T E* 🤍 〙⊷
├───────────────────
│⁖🧡꙰  *Cliente:*
│✏️ Wa.me/${m.sender.split`@`[0]}
│
│⁖💚꙰  *Mensaje:*
│📩 ${text}
╰───────────────────`

    const citado = m.quoted?.text ? `\n📝 *Cita:* ${m.quoted.text.slice(0, 300)}...` : ''
    const mensajeFinal = teks + citado

    // Enviar al dueño
    await conn.reply(global.owner[0][0] + '@s.whatsapp.net', mensajeFinal, m, { mentions: conn.parseMention(mensajeFinal) })

    // Enviar al grupo de soporte 
    await conn.reply('120363421252082747@g.us', mensajeFinal, m, { mentions: conn.parseMention(mensajeFinal) })

    
    m.reply('🧸 Gracias por confiar en *Miku-Bot*. Tu reporte fue enviado al staff, será arreglado lo antes posible.')
}

handler.help = ['reportar']
handler.tags = ['info']
handler.command = ['reporte','report','reportar','bug','error']

export default handler