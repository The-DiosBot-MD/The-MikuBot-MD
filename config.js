import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//---------[ Añada los numeros a ser Propietario/a ]---------

global.owner = [['595976126756', 'OWNER', true], ['595994836199'], ['595981941030']]
global.mods = []
global.prems = []

//BETA: Si quiere evitar escribir el número que será bot en la consola, agregué desde aquí entonces:
//Sólo aplica para opción 2 (ser bot con código de texto de 8 digitos)
global.botNumberCode = "" //Ejemplo: +595976126756
global.confirmCode = "" 

// Cambiar a false para usar el Bot desde el mismo numero del Bot.
global.isBaileysFail = false

//---------[ APIS GLOBAL ]---------

global.openai_key = 'sk-...OzYy' /* Consigue tu ApiKey en este enlace: https://platform.openai.com/account/api-keys */
global.openai_org_id = 'HITjoN7H8pCwoncEB9e3fSyW' /* Consigue tu ID de organizacion en este enlace: https://platform.openai.com/account/org-settings */
global.Key360 = ['964f-0c75-7afc']//key de violetics
global.keysZens = ['LuOlangNgentot', 'c2459db922', '37CC845916', '6fb0eff124', 'hdiiofficial', 'fiktod', 'BF39D349845E', '675e34de8a', '0b917b905e6f']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = "GataDiosV2"
global.itsrose = ['4b146102c4d500809da9d1ff']
global.baileys = '@whiskeysockets/baileys'
global.apis = 'https://deliriussapi-oficial.vercel.app'

global.APIs = {xteam: 'https://api.xteam.xyz', 
dzx: 'https://api.dhamzxploit.my.id',
lol: 'https://api.lolhuman.xyz',
violetics: 'https://violetics.pw',
neoxr: 'https://api.neoxr.my.id',
zenzapis: 'https://api.zahwazein.xyz',
akuari: 'https://api.akuari.my.id',
akuari2: 'https://apimu.my.id',	
fgmods: 'https://api-fgmods.ddns.net',
botcahx: 'https://api.botcahx.biz.id',
ibeng: 'https://api.ibeng.tech/docs',	
rose: 'https://api.itsrose.site',
popcat : 'https://api.popcat.xyz',
xcoders : 'https://api-xcoders.site' },
global.APIKeys = {'https://api.xteam.xyz': `${keysxteam}`,
'https://api.lolhuman.xyz': `${lolkeysapi}`,
'https://api.neoxr.my.id': `${keysneoxr}`,	
'https://violetics.pw': 'beta',
'https://api.zahwazein.xyz': `${keysxxx}`,
'https://api-fgmods.ddns.net': 'fg-dylux',
'https://api.botcahx.biz.id': 'Admin',
'https://api.ibeng.tech/docs': 'tamvan',
'https://api.itsrose.site': 'Rs-Zeltoria',
'https://api-xcoders.site': 'Frieren' }

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment	

//------------------------[ Stickers ]-----------------------------

global.packname = '𝐓𝐡𝐞-𝐌𝐢𝐤𝐮𝐁𝐨𝐭-𝐌𝐃🥀'
global.author = '𝐀𝐝𝐫𝐢𝐚𝐧𝐎𝐟𝐢𝐜𝐢𝐚𝐥'

//------------[ Versión | Nombre | cuentas ]------------

global.wm = '𝐓𝐡𝐞-𝐌𝐢𝐤𝐮𝐁𝐨𝐭-𝐌𝐃🥀' 
global.botname = '𝐓𝐡𝐞-𝐌𝐢𝐤𝐮𝐁𝐨𝐭-𝐌𝐃🥀'
global.vs = '1.9.9'
global.yt = 'https://www.youtube.com/@The-MikuBot-MD'
global.tiktok = 'tiktok.com/@Adrian Alegre Sanchez'
global.md = 'https://github.com/The-DiosBot-MD/The-MikuBot-MD'
global.fb = 'https://www.facebook.com/Adrian Alegre Sanchez'
global.face = 'https://www.facebook.com/groups/8729899904789/'

global.nna = 'https://chat.whatsapp.com/IhHPrATwf5RE5DxlxIjhaT' //Update
global.nna2 = 'https://chat.whatsapp.com/C92isvspFcXCtqv2PqCfHI'
global.nn = 'https://chat.whatsapp.com/C92isvspFcXCtqv2PqCfHI' //Grupo 1
global.nnn = 'https://chat.whatsapp.com/C92isvspFcXCtqv2PqCfHI' //Grupo 2
global.nnnt = 'https://chat.whatsapp.com/LuD3YzdOjH16LUwPPCVmL6' //Grupo del Colaboracion
global.nnnt2 = 'https://chat.whatsapp.com/LuD3YzdOjH16LUwPPCVmL6' // Grupo COL 2
global.nnntt = 'https://chat.whatsapp.com/LuD3YzdOjH16LUwPPCVmL6' //Grupo COL 3
global.nnnttt = 'https://chat.whatsapp.com/Hg4Akz1Autl7AiPaY9vyod' //Grupo 1
global.nnntttt = 'https://chat.whatsapp.com/Hg4Akz1Autl7AiPaY9vyod' //Grupo ayuda sobre el bot
global.bot = 'No disponible de momento...'
global.asistencia = `${fb}`
global.redes = [nna, yt, nn, md, tiktok, fb, nnn, face]

//------------------------[ Info | Datos ]---------------------------

global.wait = '𝑷𝒓𝒐𝒄𝒆𝒔𝒂𝒏𝒅𝒐 𝒂𝒈𝒖𝒂𝒓𝒅𝒆 𝒖𝒏 𝒎𝒐𝒎𝒆𝒏𝒕𝒐..\n\n> *❗𝑭𝒂𝒗𝒐𝒓 𝒏𝒐 𝒉𝒂𝒄𝒆𝒓 𝑺𝒑𝒂𝒎❗*'
global.waitt = '*⌛ _𝑪𝒂𝒓𝒈𝒂𝒏𝒅𝒐..._ ▬▬▭▭▭*'
global.waittt = '*⌛ _𝑪𝒂𝒓𝒈𝒂𝒏𝒅𝒐..._ ▬▬▬▬▭▭*'
global.waitttt = '*⌛ _𝑪𝒂𝒓𝒈𝒂𝒏𝒅𝒐..._ ▬▬▬▬▬▬▭*'
global.waittttt = '*⌛ _𝑪𝒂𝒓𝒈𝒂𝒏𝒅𝒐..._ ▬▬▬▬▬▬▬*'
global.rg = '『✔︎ 𝑹𝒆𝒔𝒖𝒍𝒕𝒂𝒅𝒐 ✔︎』\n\n'
global.resultado = rg
global.ag = '『༒︎ 𝑷𝒓𝒆𝒄𝒂𝒖𝒄𝒊𝒐𝒏 ༒︎』\n\n'
global.advertencia = ag
global.iig = '『␈ 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒄𝒊𝒐𝒏 ␈』\n\n'
global.informacion = iig
global.fg = '『☢︎︎ 𝑬𝒓𝒓𝒐𝒓 ☢︎︎』\n\n'
global.fallo = fg
global.mg = '『☹︎ 𝑼𝒔𝒐 𝒊𝒏𝒄𝒐𝒓𝒓𝒄𝒕𝒐 ☹︎』\n\n'
global.mal = mg
global.eeg = '『❣︎ 𝑹𝒆𝒑𝒐𝒓𝒕𝒂𝒓 ❣︎』\n\n'
global.envio = eeg
global.eg = '『✿︎ 𝑷𝒓𝒐𝒄𝒆𝒔𝒐 𝒆𝒙𝒊𝒕𝒐𝒔𝒐 ✿︎』\n\n'
global.exito = eg

//-------------------------[ IMAGEN ]------------------------------
//global.img = "https://qu.ax/Zgqq.jpg"
global.img1 = 'https://qu.ax/hNJk.jpg'
global.img2 = 'https://qu.ax/jzhN.jpg'

global.imagen = fs.readFileSync('./Menu2.jpg')
global.imagen1 = fs.readFileSync('./media/Menu1.jpg')
global.imagen2 = fs.readFileSync('./media/Menu2.jpg')
global.imagen3 = fs.readFileSync('./media/Menu3.jpg')
global.imagen4 = fs.readFileSync('./media/Menu4.jpg')
global.imagen5 = 'https://qu.ax/rULv.jpg'
global.imagen6 = 'https://qu.ax/CySs.jpg'
global.menu18 = 'https://qu.ax/MOgO.jpg'
global.vid1 = 'https://qu.ax/dcAc.mp4'
global.img = [imagen, imagen1, imagen2, imagen3, imagen4]
global.imageUrl = ["https://qu.ax/HJnWj.jpg", "https://qu.ax/ehPzQ.jpg", "https://qu.ax/ilfbC.jpg"]

//----------------------------[ NIVELES | RPG ]---------------------------------

global.multiplier = 850 // Cuanto más alto, más difícil subir de nivel
global.maxwarn = '4' // máxima advertencias

//━━━━━━━━━━━━━━━━━━━━ ฅ^•ﻌ•^ฅ

global.rwait = '⌛'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🔥' 

//━━━━━━━━━━━━━━━━━━━━ ฅ^•ﻌ•^ฅ

global.flaaa = [
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&script=water-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextColor=%23000&shadowGlowColor=%23000&backgroundColor=%23000&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&fontsize=90&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&doScale=true&scaleWidth=800&scaleHeight=500&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&text=',
'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&fillTextType=1&fillTextPattern=Warning!&fillColor1Color=%23f2aa4c&fillColor2Color=%23f2aa4c&fillColor3Color=%23f2aa4c&fillColor4Color=%23f2aa4c&fillColor5Color=%23f2aa4c&fillColor6Color=%23f2aa4c&fillColor7Color=%23f2aa4c&fillColor8Color=%23f2aa4c&fillColor9Color=%23f2aa4c&fillColor10Color=%23f2aa4c&fillOutlineColor=%23f2aa4c&fillOutline2Color=%23f2aa4c&backgroundColor=%23101820&text=']

//---------------[ IDs de canales ]----------------

global.ch = {
ch1: 'https://whatsapp.com/channel/0029VaGt7Uk6WaKkEDZUh43W', 
ch2: 'https://whatsapp.com/channel/0029VaGt7Uk6WaKkEDZUh43W',
ch3: 'https://whatsapp.com/channel/0029VaGt7Uk6WaKkEDZUh43W',
}

//----------------------------------------------------

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
