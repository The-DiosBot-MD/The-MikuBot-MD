// src/handlers/messenger.js
import { MessageUtils } from './messageUtils.js';

export class MessengerHandler {
    constructor() {
        this.messageUtils = new MessageUtils();
    }

    async handleMessage({ message: m, client: conn }) {
        const platform = 'messenger';
        let { prefix, command, args, userName, chat } = this.parseMessage(m);
        if (!prefix) return;

        switch (command) {
            case 'menu':
                const menu = `
╭═══୧ Messenger Bot ୨══●
┊ Versión: 1.0.1
┊╭─━─━─━─━─━─★
┊│ ∵ Info del usuario
┊│ ▢ Nombre: ${userName}
┊│ ▢ ID: ${m.sender.id}
┊╰─━─━─━─━─━─★
┊ 
┊ ❖ COMANDOS DE MESSENGER ❖
┊╭•─•─•─•✦•─•─•─•✦
┊│ ⟡ Grupos ⟡
┊│ /add
┊│ /remove
┊│ /info
┊╰•─•─•─•✦•─•─•─•✦
┊
┊╭•─•─•─•✦•─•─•─•✦
┊│ ⟡ Ayuda ⟡
┊│ /help
┊╰•─•─•─•✦•─•─•─•✦
╰═════════════●`.trim();

                await this.sendMessage(conn, chat, menu);
                break;

            case 'info':
                const info = `Información del chat:\nNombre: ${chat.name}\nID: ${chat.id}`;
                await this.sendMessage(conn, chat, info);
                break;

            case 'help':
                const help = `Puedes usar los siguientes comandos:\n/menu\n/info\n/help`;
                await this.sendMessage(conn, chat, help);
                break;

            // Agrega más comandos según sea necesario
        }
    }

    parseMessage(m) {
        const prefixes = ['/', '.', '!', '?'];
        const text = m.text || '';
        const userName = m.sender.name || 'Usuario';
        const chat = m.threadID;

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

    async sendMessage(conn, chat, content, options = {}) {
        try {
            await conn.sendMessage(chat, content);
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    }
}