// messageHandler.js

// Importamos los handlers de las plataformas
import { WhatsAppHandler } from '../conexion/whatsapp.js';
import { TelegramHandler } from '../conexion/telegram.js';
import { DiscordHandler } from '../conecion/discord.js';
//import { MessengerHandler } from '../conexion/messenger.js';
// import { ThreadsHandler } from './threads.js';

// Clase PlatformManager
class PlatformManager {
    constructor() {
        this.handlers = {
            whatsapp: new WhatsAppHandler(),
            telegram: new TelegramHandler(),
            discord: new DiscordHandler(),
            messenger: new MessengerHandler()
            // threads: new ThreadsHandler()
        };
    }

    async handleMessage(platform, context) {
        const handler = this.handlers[platform];
        if (!handler) {
            throw new Error(`Plataforma no soportada: ${platform}`);
        }
        
        await handler.handleMessage(context);
    }
}

// Instancia única de PlatformManager
const platformManager = new PlatformManager();

// Objeto messageHandler
const messageHandler = {
    handleMessage: async (platform, context) => {
        try {
            await platformManager.handleMessage(platform, context);
            console.log(`Mensaje manejado correctamente en ${platform}`);
        } catch (error) {
            console.error(`Error al manejar mensaje en ${platform}:`, error);
            // Aquí puedes agregar más lógica para manejar errores específicos
        }
    }
};

// Exportamos el objeto messageHandler y la instancia de PlatformManager
export { messageHandler, platformManager };
