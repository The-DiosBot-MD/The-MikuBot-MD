import { MessageUtils } from '../handlers/messageUtils.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.datagbPath = path.join(__dirname, 'datagb');

// Crear directorio datagb si no existe
if (!fs.existsSync(global.datagbPath)) {
    fs.mkdirSync(global.datagbPath, { recursive: true });
}

// Manejador de base de datos
class DatabaseManager {
    constructor() {
        this.cache = {
            users: new Map(),
            settings: {}
        };
    }

    // Generar ID único para usuarios
    generateUniqueId() {
        const files = fs.readdirSync(global.datagbPath)
            .filter(file => file.startsWith('user.') && file.endsWith('.json'));
        const highestId = files.length > 0
            ? Math.max(...files.map(file => parseInt(file.replace('user.', '').replace('.json', ''), 10)))
            : 0;
        return `user.${String(highestId + 1).padStart(6, '0')}`;
    }

    // Registrar nuevo usuario
    registerUser(userData) {
        const uniqueId = this.generateUniqueId();
        userData.id = uniqueId;
        userData.registrationDate = new Date().toISOString();
        
        const filePath = path.join(global.datagbPath, `${uniqueId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
        
        this.cache.users.set(uniqueId, userData);
        return uniqueId;
    }

    // Obtener usuario por ID
    getUser(userId) {
        if (this.cache.users.has(userId)) {
            return this.cache.users.get(userId);
        }

        const filePath = path.join(global.datagbPath, `${userId}.json`);
        if (fs.existsSync(filePath)) {
            const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            this.cache.users.set(userId, userData);
            return userData;
        }
        return null;
    }

    // Buscar usuario por campo específico (como idTelegram o idDiscord)
    getUserByField(fieldName, fieldValue) {
        // Primero buscar en caché
        for (const [_, userData] of this.cache.users.entries()) {
            if (userData[fieldName] === fieldValue) {
                return userData;
            }
        }

        // Si no está en caché, buscar en archivos
        const files = fs.readdirSync(global.datagbPath)
            .filter(file => file.startsWith('user.') && file.endsWith('.json'));
        
        for (const file of files) {
            const filePath = path.join(global.datagbPath, file);
            try {
                const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (userData[fieldName] === fieldValue) {
                    this.cache.users.set(userData.id, userData);
                    return userData;
                }
            } catch (error) {
                console.error(`Error al leer archivo ${file}:`, error);
            }
        }
        
        return null;
    }

    // Actualizar datos de usuario
    updateUser(userId, updateData) {
        const filePath = path.join(global.datagbPath, `${userId}.json`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Usuario no encontrado: ${userId}`);
        }

        const userData = this.getUser(userId);
        const updatedData = { ...userData, ...updateData, lastUpdated: new Date().toISOString() };
        
        fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
        this.cache.users.set(userId, updatedData);
        return updatedData;
    }

    // Obtener todos los usuarios
    getAllUsers() {
        const files = fs.readdirSync(global.datagbPath)
            .filter(file => file.startsWith('user.') && file.endsWith('.json'));
        
        return files.map(file => {
            const userId = file.replace('.json', '');
            return this.getUser(userId);
        });
    }

    // Guardar configuraciones globales
    saveSettings(settings) {
        const settingsPath = path.join(global.datagbPath, 'settings.json');
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        this.cache.settings = settings;
    }

    // Cargar configuraciones globales
    loadSettings() {
        const settingsPath = path.join(global.datagbPath, 'settings.json');
        if (fs.existsSync(settingsPath)) {
            this.cache.settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        }
        return this.cache.settings;
    }
}

// Crear instancia global de la base de datos
global.db = new DatabaseManager();
global.DATABASE = global.db; // Para compatibilidad

// Clase para manejar mensajes de Telegram
export class TelegramHandler {
    constructor() {
        this.messageUtils = new MessageUtils();
        // Usar la base de datos global ya inicializada
        this.db = global.db;
    }

    async handleMessage({ message: m, client: conn }) {
        const platform = 'telegram';
        let { prefix, command, args, userName, chat } = this.parseMessage(m);
        if (!prefix) return;

        switch (command) {
            case 'menu':
                const menu = `
╭═══୧ Telegram Bot ୨══●
┊ Versión: 1.0.1
┊╭─━─━─━─━─━─★
┊│ ∵ Info del usuario
┊│ ▢ Nombre: ${userName}
┊│ ▢ ID: ${m.from.id}
┊╰─━─━─━─━─━─★
┊ 
┊ ❖ COMANDOS DE TELEGRAM ❖
┊╭•─•─•─•✦•─•─•─•✦
┊│ ⟡ Grupos ⟡
┊│ /ban
┊│ /unban
┊│ /pin
┊│ /unpin
┊│ /register nombre/edad/sexo/correo/idTelegram/idDiscord/numeroWhatsApp
┊│ /perfil
┊╰•─•─•─•✦•─•─•─•✦
╰═════════════●`.trim();
                await this.sendMessage(conn, chat, menu);
                break;

            case 'register': {
                if (args.length !== 1) {
                    return await this.sendMessage(conn, chat, 'Formato incorrecto. Usa: /register nombre/edad/sexo/correo/idTelegram/idDiscord/numeroWhatsApp');
                }

                const [nombre, edad, sexo, correo, idTelegram, idDiscord, numeroWhatsApp] = args[0].split('/');

                // Validaciones básicas
                if (!nombre || nombre.length > 30) return await this.sendMessage(conn, chat, 'El nombre es obligatorio y debe tener menos de 30 caracteres.');
                if (!/^\d+$/.test(edad) || edad < 5 || edad > 100) return await this.sendMessage(conn, chat, 'La edad debe ser un número entre 5 y 100.');
                if (!['masculino', 'femenino', 'otro'].includes(sexo.toLowerCase())) return await this.sendMessage(conn, chat, 'El sexo debe ser masculino, femenino u otro.');
                if (!/^\S+@\S+\.\S+$/.test(correo)) return await this.sendMessage(conn, chat, 'El correo no es válido.');
                if (!/^\d+$/.test(idTelegram)) return await this.sendMessage(conn, chat, 'El ID de Telegram debe ser un número válido.');
                if (!/^\d+$/.test(idDiscord)) return await this.sendMessage(conn, chat, 'El ID de Discord debe ser un número válido.');
                if (!/^\d+$/.test(numeroWhatsApp)) return await this.sendMessage(conn, chat, 'El número de WhatsApp debe contener solo dígitos.');

                // Verificar si el usuario ya está registrado (por ID de Telegram o Discord)
                const existingUserTelegram = this.db.getUserByField('idTelegram', idTelegram);
                const existingUserDiscord = this.db.getUserByField('idDiscord', idDiscord);
                
                if (existingUserTelegram || existingUserDiscord) {
                    return await this.sendMessage(conn, chat, 'Ya estás registrado en el sistema con este ID de Telegram o Discord.');
                }

                // Preparar datos del usuario
                const userData = {
                    nombre,
                    edad: parseInt(edad),
                    sexo,
                    correo,
                    idTelegram,
                    idDiscord,
                    numeroWhatsApp,
                    plataformaRegistro: 'telegram'
                };

                // Registrar usuario usando DatabaseManager
                const uniqueId = this.db.registerUser(userData);

                // Confirmación del registro
                await this.sendMessage(conn, chat, `Registro exitoso. Tu ID único es ${uniqueId}. Usa el comando /perfil para ver tu información.`);
                break;
            }

            case 'perfil': {
                // Buscar usuario por ID de Telegram
                const userData = this.db.getUserByField('idTelegram', m.from.id.toString());

                if (!userData) {
                    return await this.sendMessage(conn, chat, 'No estás registrado. Usa el comando /register para registrarte.');
                }

                // Mostrar perfil del usuario
                const profileMessage = `
𝐏𝐄𝐑𝐅𝐈𝐋 - 𝐔𝐒𝐔𝐀𝐑𝐈𝐎

┆𐂡 Nombre: ${userData.nombre}
┆☄ Edad: ${userData.edad}
┆⍣ Sexo: ${userData.sexo}
┆✉ Correo: ${userData.correo}
┆📱 Telegram ID: ${userData.idTelegram}
┆🎮 Discord ID: ${userData.idDiscord}
┆📞 WhatsApp: ${userData.numeroWhatsApp}
┆⛮ Fecha de Registro: ${new Date(userData.registrationDate).toLocaleString()}
┆⎆ ID Único: ${userData.id}
`;

                await this.sendMessage(conn, chat, profileMessage);
                break;
            }

            default:
                await this.sendMessage(conn, chat, `Comando desconocido: ${command}`);
        }
    }

    parseMessage(m) {
        const prefixes = ['/', '!'];
        const text = m.text || '';
        const userName = m.from.username || 'Usuario';
        const chat = m.chat.id;

        const usedPrefix = prefixes.find(p => text.startsWith(p));
        if (!usedPrefix) return { prefix: null };

        const [command, ...args] = text.slice(usedPrefix.length).trim().split(/\s+/);
        return {
            prefix: usedPrefix,
            command: command.toLowerCase(),
            args,
            userName,
            chat
        };
    }

    async sendMessage(conn, chat, content) {
        try {
            await conn.sendMessage(chat, content);
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    }
}

// Exportar ambas clases para uso en otros módulos
export { DatabaseManager };