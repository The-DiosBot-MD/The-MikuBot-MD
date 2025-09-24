let handler = async (m, { conn, participants, isBotAdmin, isAdmin, command }) => {
  if (!m.isGroup) return m.reply('☣️ Este comando solo puede ejecutarse dentro de un nido infectado.')
  if (!isAdmin) return m.reply(command === 'expulsartodos'
    ? '☣️ Solo los portadores del sello oscuro pueden invocar la purga.'
    : `⛔ *Acceso denegado.*\n\nTu sangre aún no ha sido marcada por la Plaga.`)
  if (!isBotAdmin) return m.reply(command === 'expulsartodos'
    ? '☣️ La Plaga necesita control total para desatar su poder.'
    : `⛔ *Acción bloqueada.*\n\nLa Plaga no puede propagarse sin dominio administrativo.`)

  const grupo = await conn.groupMetadata(m.chat)
  const administradores = grupo.participants.filter(u => u.admin).map(u => u.id)
  const infectados = participants.map(u => u.id).filter(id => !administradores.includes(id) && id !== conn.user.jid && id !== m.sender)

  if (infectados.length === 0) {
    return m.reply(command === 'expulsartodos'
      ? '☣️ No hay cuerpos que puedan ser purgados. El nido está limpio... por ahora.'
      : `📜 *Todos los cuerpos han sido marcados o ya fueron erradicados.*\n🕯️ La Plaga aguarda en silencio.`)
  }

  if (command === 'expulsartodos') {
    for (let cuerpo of infectados) {
      await conn.groupParticipantsUpdate(m.chat, [cuerpo], 'remove')
    }
    return m.reply(`✅ La purga ha sido ejecutada.\n☣️ Se han eliminado ${infectados.length} portadores.`)
  }

  await m.reply(
    `🕷️ *Ritual de Erradicación Masiva - Iniciado*

🔮 *La Plaga se extiende...*
👁️ *Cuerpos identificados para purga:* ${infectados.length}
🛡️ *Los marcados por el sello oscuro serán preservados...*

⚰️ Expulsando a los no marcados...
📓 Sus nombres serán inscritos en el códice de los caídos.`
  )

  global.db.data.expulsados ??= {}
  global.db.data.expulsados[m.chat] ??= []

  for (let id of infectados) {
    try {
      await conn.groupParticipantsUpdate(m.chat, [id], 'remove')
      if (!global.db.data.expulsados[m.chat].includes(id)) {
        global.db.data.expulsados[m.chat].push(id)
      }
      await delay(1500)
    } catch (e) {
      console.error(`❌ No se pudo purgar a ${id}`, e)
    }
  }

  await m.reply(
    `✅ *Purga completada.*

☣️ *Cuerpos erradicados:* ${infectados.length}
📜 *Registro actualizado en el códice de la Plaga.*
🕯️ *El nido queda en silencio... por ahora.*`
  )
}

handler.help = ['kickall', 'expulsartodos']
handler.tags = ['group']
handler.command = ['kickall', 'expulsartodos']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}