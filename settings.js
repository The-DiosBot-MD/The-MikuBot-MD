import { config } from './src/config/config.js'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Ruta para almacenar las credenciales de WhatsApp
//export const folderWa = join(__dirname, 'auth_whatsapp')
global.folderWa = 'session'



