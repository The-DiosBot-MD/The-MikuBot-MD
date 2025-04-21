import './settings.js'  
import packageJson from './package.json' assert { type: 'json' }
import dotenv from 'dotenv'  
import chalk from 'chalk'  
import { connectToWhatsApp , connectToTelegram , connectToDiscord , connectToInstagram , connectToMessenger , connectToThreads } from './main.js'  
import cfonts from 'cfonts' 
import Database from './src/database/access_database.js'

// Inicializa la base de datos global
global.db = new Database()

// Cargar las variables de entorno  
dotenv.config()  

// Configuración de tokens y credenciales  
const TELEGRAM_TOKEN=process.env.TELEGRAM_BOT_TOKEN  
const DISCORD_TOKEN=process.env.DISCORD_BOT_TOKEN  
const MESSENGER_TOKEN=process.env.MESSENGER_BOT_TOKEN 
const INSTAGRAM_USERNAME=process.env.INSTAGRAM_USERNAME  
const INSTAGRAM_PASSWORD=process.env.INSTAGRAM_PASSWORD  
const THREADS_USERNAME=process.env.THREADS_USERNAME  
const THREADS_PASSWORD=process.env.THREADS_PASSWORD  

// Colores para diferenciar los mensajes entre conexiones  
const telegramColor=chalk.hex('#0088cc') 
const discordColor=chalk.hex('#af19fa') 
const whatsappColor=chalk.hex('#25d366')
const instagramColor=chalk.hex('#FFA500') 
const messengerColor=chalk.hex('#4169E1')  
const threadsColor=chalk.bold.dim 

const isValidToken=(token)=>{   
return token && token.length >0   
}  

const isValidCredentials=(username,password)=>{   
return username && password && username.length >0 && password.length >0   
}  

cfonts.say('Gata|Multi|Bot',{   
align:'center',   
colors:false ,   
background:'transparent' ,   
letterSpacing :1 ,   
lineHeight :1 ,   
space:true ,   
maxLength :'0' ,   
gradient:['blue','red'],   
independentGradient:false ,   
transitionGradient:false ,   
rawMode:true ,   
env:'node'    
})  
cfonts.say(packageJson.description, {
font: 'console',
align: 'center',
gradient: ['red', 'magenta'],
})

// Inicializar conexiones  
const initializeAllConnections=async()=>{    
try{    
console.log(chalk.bold('Iniciando conexiones...'))    

// Iniciar WhatsApp    
console.log(whatsappColor.bold('Iniciando bot de WhatsApp...'))    
await connectToWhatsApp()    

// Iniciar Telegram    
if(isValidToken(TELEGRAM_TOKEN)){    
console.log(telegramColor.bold('Iniciando bot de Telegram...'))    
const telegramBot=connectToTelegram(TELEGRAM_TOKEN)    
console.log(telegramColor.bold('¡Bot de Telegram conectado!'))    
}else{    
console.log(telegramColor.bold('El token de Telegram no es válido o está vacío. Omitiendo usar bot de Telegram...'))    
}    

// Iniciar Discord    
if(isValidToken(DISCORD_TOKEN)){    
console.log(discordColor.bold('Iniciando bot de Discord...'))    
const discordClient=await connectToDiscord(DISCORD_TOKEN)    
console.log(discordColor.bold('¡Bot de Discord conectado!'))    
}else{    
console.log(discordColor.bold('El token de Discord no es válido o está vacío. Omitiendo usar bot de Discord...'))    
}    

// Iniciar Instagram    
if(isValidCredentials(INSTAGRAM_USERNAME , INSTAGRAM_PASSWORD)){    
console.log(instagramColor.bold('Iniciando bot de Instagram...'))    
const instagramClient=await connectToInstagram({username : INSTAGRAM_USERNAME,password : INSTAGRAM_PASSWORD})    
console.log(instagramColor.bold('¡Bot de Instagram conectado!'))   
}else{    
console.log(instagramColor.bold('Usuario o contraseña de Instagram no válidas o vacías. Omitiendo usar bot de Instagram...'))   
}    

// Iniciar Messenger    
if(isValidToken(MESSENGER_TOKEN)){    
console.log(messengerColor.bold('Iniciando bot de Messenger...'))    
const messengerClient=await connectToMessenger(MESSENGER_TOKEN)    
console.log(messengerColor.bold('¡Bot de Messenger conectado!'))   
}else{    
console.log(messengerColor.bold('El token de Messenger no es válido o está vacío. Omitiendo usar bot de Messenger...'))    
}    

// Iniciar Threads    
if(isValidCredentials(THREADS_USERNAME , THREADS_PASSWORD)){    
console.log(threadsColor.bold('Iniciando bot de Threads...'))   
const threadsClient=await connectToThreads({username : THREADS_USERNAME,password : THREADS_PASSWORD})   
console.log(threadsColor('¡Bot de Threads conectado!'))   
}else{    
console.log(threadsColor('Usuario o contraseña de Threads no válidas o vacías. Omitiendo usar bot de Threads...'))    
}    

console.log(chalk.bold('Todas las conexiones se han ejecutado.'))  

}catch(error){     
console.error('Error al iniciar las conexiones:', error)    
}     
};  

initializeAllConnections();  

process.on('unhandledRejection',(error)=>{     
console.error('Error no manejado:', error)    
})

process.on('uncaughtException',(error)=>{     
console.error('Excepción no manejada:', error) 
}) 
