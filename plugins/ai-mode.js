import fetch from 'node-fetch'

var handler = async (m, { text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, ` Ingrese una petición para que Mode IA lo responda.`, m, rcanal)
  try {
    await m.react('🌟')
    conn.sendPresenceUpdate('composing', m.chat)

    let response = await fetch(`https://mode-ia.onrender.com/mode-ia?prompt=${encodeURIComponent(text)}`)
    let data = await response.json()

    if (!data.response) throw 'Sin respuesta válida'
    await m.reply(data.response.trim())
  } catch (e) {
    await m.react('⚡️')
    await conn.reply(m.chat, ` Mode IA no puede responder a esa pregunta.`, m, rcanal)
  }
}

handler.command = ['modeia', 'mode']
handler.help = ['modeia']
handler.tags = ['ai']
handler.group = true

export default handler