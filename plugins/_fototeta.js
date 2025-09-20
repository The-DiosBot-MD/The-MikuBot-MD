let handler = async (m, { conn }) => {
  await conn.reply(
    m.chat,
    `*Padre nuestro, que estás en los Cielos, santificado sea tu nombre, venga tu Reino, hágase tu voluntad así en la tierra como en el cielo. Y perdónanos nuestras deudas así como nosotros perdonamos a nuestros deudores, y no nos dejes caer en la tentación, mas líbranos del mal.*`,
    m
  )
}

handler.customPrefix = /^(fototeta)$/i  
handler.command = [] 

export default handler