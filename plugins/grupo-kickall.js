let handler = async (m, { conn, participants }) => {

  // Validación: solo admins pueden usarlo
  if (!m.isGroup) return m.reply('✳️ Este comando solo funciona en grupos.')
  if (!m.isAdmin) return m.reply('✳️ Solo los administradores pueden usar este comando.')
  if (!conn.isBotAdmin) return m.reply('✳️ Necesito ser administrador para expulsar usuarios.')

  // Filtrar miembros a expulsar (excluye al bot y al autor del mensaje)
  let kickables = participants
    .filter(p => p.id !== conn.user.jid && p.id !== m.sender && !p.admin)
    .map(p => p.id)

  if (kickables.length === 0) return m.reply('✳️ No hay miembros que pueda expulsar.')

  // Expulsión en bloque
  for (let user of kickables) {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
  }

  m.reply(`✅ Se han expulsado ${kickables.length} miembros del grupo.`)
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = ['kickall', 'expulsartodos']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler