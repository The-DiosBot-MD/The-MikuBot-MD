let handler = async (m, { conn, participants }) => {

  if (!m.isGroup) return m.reply('✳️ Este comando solo funciona en grupos.')
  if (!conn.isBotAdmin) return m.reply('✳️ Necesito ser administrador para expulsar usuarios.')

  let kickables = participants
    .filter(p => p.id !== conn.user.jid && p.id !== m.sender && !p.admin)
    .map(p => p.id)

  if (kickables.length === 0) return m.reply('✳️ No hay miembros que pueda expulsar.')

  for (let user of kickables) {
    await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
  }

  m.reply(`✅ Se han expulsado ${kickables.length} miembros del grupo.`)
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = ['kickall', 'expulsartodos']
handler.group = true
handler.botAdmin = true

export default handler