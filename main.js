import './settings.js'
import pkg from '@whiskeysockets/baileys' // Para WhatsApp 
const { makeWASocket, makeInMemoryStore, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = pkg
import { Boom } from '@hapi/boom'
import pino from 'pino'
import NodeCache from 'node-cache'
import TelegramBot from 'node-telegram-bot-api' // Para Telegram
import Client, { GatewayIntentBits  } from 'discord.js' // Para Discord 
import { IgApiClient } from 'instagram-private-api' // Para Instagram
import MessengerClient from 'messaging-api-messenger' // Para Messenger
import ThreadsAPI from 'threads-api' // Para Threads
import { messageHandler } from './src/handlers/messageHandler.js' // Asegúrate de que esta línea sea correcta
import chalk from 'chalk'

// WhatsApp Connection
export const connectToWhatsApp = async () => {
try {
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const { state, saveCreds } = await useMultiFileAuthState(folderWa)
const { version } = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache()

const sock = makeWASocket({
version,
logger: pino({ level: 'silent' }),
printQRInTerminal: true,
auth: state,
msgRetryCounterCache
})
store.bind(sock.ev)

sock.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update
if (connection === 'close') {
if (lastDisconnect?.error && lastDisconnect.error instanceof Boom) {
const shouldReconnect = lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
if (shouldReconnect) {
await connectToWhatsApp()
}} else {
console.log(chalk.bold.red(`Conexión a WhatsApp cerrada. Razón: ${lastDisconnect?.error || 'Desconocida'}`))
}} else if (connection === 'open') {
console.log(chalk.hex('#25d366').bold('¡Bot de WhatsApp conectado!'))
}})
sock.ev.on('messages.upsert', async ({ messages }) => {
const m = messages[0]
if (!m.key.fromMe) {
await messageHandler.handleMessage('whatsapp', { message: m, client: sock })
}})

sock.ev.on('creds.update', saveCreds)
return sock
} catch (error) {
console.error('Error en la conexión de WhatsApp:', error)
}}

// Telegram Connection 
export const connectToTelegram = (token) => {
try {
const bot = new TelegramBot(token, { polling: true })

bot.on('message', async (msg) => {
await messageHandler.handleMessage('telegram', { message: msg, client: bot })
})
return bot
} catch (error) {
console.error('Error en Telegram:', error)
throw error
}}
 
// Discord Connection 
export const connectToDiscord = async (token) => {
try {
const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.MessageContent,
GatewayIntentBits.DirectMessages
]})
client.on('messageCreate', async (message) => {
if (!message.author.bot) {
await messageHandler.handleMessage('discord', { message, client: client })
}})
await client.login(token);
return client
} catch (error) {
console.error('Error en Discord:', error);
throw error
}}

// Instagram Connection 
export const connectToInstagram = async ({ username, password }) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    // Simula el flujo de pre-login
    await ig.simulate.preLoginFlow();

    // Intentar iniciar sesión
    await ig.account.login(username, password);

    // Verificar si hay un desafío
    if (ig.state.checkpoint) {
      console.log('Instagram requiere un desafío para completar el inicio de sesión.');

      // Aquí puedes capturar el código de desafío manualmente o automáticamente
      const challengeCode = await getChallengeCode();  // Necesitas obtener el código de alguna manera
      await ig.account.submitChallengeCode(challengeCode);
      console.log('Desafío resuelto');
    }

    // Simula el flujo post-login
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log('Inicio de sesión exitoso en Instagram');
    return ig;
  } catch (error) {
    console.error('Error al iniciar sesión en Instagram:', error);
    throw error;
  }
};
const getChallengeCode = async () => {
  // Aquí implementas el código para obtener el código del desafío, ya sea manualmente o automáticamente.
  // Este es un ejemplo donde el código de desafío se ingresa manualmente.
  const code = '123456'  // Este es un valor de ejemplo, debes obtenerlo de la cuenta.
  return code
};
/*export const connectToInstagram = async ({ username, password }) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    // Simula el flujo de pre-login
    await ig.simulate.preLoginFlow();

    // Inicia sesión
    await ig.account.login(username, password);

    // Simula el flujo post-login
    process.nextTick(async () => await ig.simulate.postLoginFlow());

    console.log('Inicio de sesión exitoso en Instagram');
    return ig;
  } catch (error) {
    console.error('Error al iniciar sesión en Instagram:', error);
    throw error;
  }
};*/

// Messenger Connection 
export const connectToMessenger = async (token) => {
try {
const client = new MessengerClient({
accessToken: token
})

client.on('message', async (event) => {
if (!event.message.is_echo) {
await messageHandler.handleMessage('messenger', { message: event,  client: client })
}})
return client;
} catch (error) {
console.error('Error en Messenger:', error)
throw error
}}

// Threads Connection 
export const connectToThreads = async ({ username, password }) => {
try{
const threads = new ThreadsAPI({ username: username, password: password })

setInterval(async () => {
const notifications=await threads.getNotifications()
for(const notification of notifications){
if(notification.type==='reply'||notification.type==='mention'){
await messageHandler.handleMessage('threads', { message: notification, client: threads })
}}
},30000)
return threads

}catch(error){
console.error('Error en Threads:',error)
throw error
}}

