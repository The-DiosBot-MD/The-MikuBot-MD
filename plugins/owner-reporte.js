let handler = async (m, { conn, text }) => {
    if (!text) throw '⚠️ *_Ingrese el error que desea reportar._*'
    if (text.length < 10) throw '⚠️ *_Especifique bien el error, mínimo 10 caracteres._*'
    if (text.length > 1000) throw '⚠️ *_Máximo 1000 caracteres para enviar el error._*'

    const cliente = `Wa.me/${m.sender.split`@`[0]}`
    const cita = m.quoted?.text ? `\n📝 *Cita:* ${m.quoted.text.slice(0, 300)}...` : ''
    const mensaje = `╭───────────────────
│⊷〘 *R E P O R T E* 🤍 〙⊷
├───────────────────
│⁖🧡꙰  *Cliente:*
│✏️ ${cliente}
│
│⁖💚꙰  *Mensaje:*
│📩 ${text}${cita}
╰───────────────────`

    
    const destinatarios = [
        '595976126756@s.whatsapp.net',      // Dueño
        '5355699866@s.whatsapp.net',        // Mods
        '120363421252082747@g.us'           // grupo de soporte 
    ]

    
    for (let jid of destinatarios) {
        await conn.reply(jid, mensaje, m)
    }

   
    m.reply('🧸 Gracias por confiar en *Miku-Bot*. Tu reporte fue enviado al Staff. Será atendido lo antes posible.')
}

handler.help = ['reportar']
handler.tags = ['info']
handler.command = ['reporte','report','reportar','bug','error']

export default handler