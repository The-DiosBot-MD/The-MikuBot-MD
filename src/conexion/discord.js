import pkg from 'discord.js';
const { EmbedBuilder } = pkg;
import { MessageUtils } from './messageUtils.js';
import { DatabaseManager } from './databaseManager.js'; // Asegúrate de importar DatabaseManager

export class DiscordHandler {
    constructor() {
        this.messageUtils = new MessageUtils();
        this.db = global.db; // Usar la instancia global de DatabaseManager
    }

    async handleMessage({ message: m, client: conn }) {
        const platform = 'discord';
        let { prefix, command, args, userName, chat } = this.parseMessage(m);
        if (!prefix) return;

        switch (command) {
            case 'menu':
        const menu = new EmbedBuilder()
          .setTitle('Discord Bot')
           .setDescription('Versión: 1.0.1')
            .addFields([
           { 
            name: 'Info del usuario', 
           value: `Nombre: ${userName}\nID: ${m.author.id}`, 
            inline: true 
                        },
                        {
           name: 'Comandos de Discord',
           value: `
                   **Grupos**
                   - !ban
                   - !unban
                   - !mute
                   - !unmute

                   **Información**
                   - !info
                   - !help
                   - !perfil
                            `,
          inline: false
                        }
                    ])
                    .setColor('Blue')
                    .setFooter({ text: 'Desarrollado por [Tu Nombre]' });

                await this.sendMessage(conn, chat, menu);
                break;

            case 'info':
                const info = new EmbedBuilder()
                    .setTitle('Información del servidor')
                    .setDescription(`Nombre del servidor: ${m.guild.name}\nID del servidor: ${m.guild.id}`)
                    .setColor('Green')
                    .setFooter({ text: 'Desarrollado por [Tu Nombre]' });

                await this.sendMessage(conn, chat, info);
                break;

            case 'help':
                const help = new EmbedBuilder()
                    .setTitle('Ayuda')
                    .setDescription('Puedes usar los siguientes comandos:')
                    .addFields([
                        {
                            name: 'Comandos disponibles',
                            value: `
                                - !menu
                                - !info
                                - !help
                                - !perfil
                            `,
                            inline: false
                        }
                    ])
                    .setColor('Yellow')
                    .setFooter({ text: 'Desarrollado por [Tu Nombre]' });

                await this.sendMessage(conn, chat, help);
                break;

            case 'perfil': {
                // Buscar usuario por ID de Discord
                const userData = this.db.getUserByField('idDiscord', m.author.id);

                if (!userData) {
                    return await this.sendMessage(conn, chat, 'No estás registrado. Usa el comando /register en Telegram para registrarte.');
                }

                // Mostrar perfil del usuario en un Embed
                const profileEmbed = new EmbedBuilder()
                    .setTitle('Perfil del Usuario')
                    .addFields([
                        { name: 'Nombre', value: userData.nombre, inline: true },
                        { name: 'Edad', value: userData.edad.toString(), inline: true },
                        { name: 'Sexo', value: userData.sexo, inline: true },
                        { name: 'Correo', value: userData.correo, inline: false },
                        { name: 'ID de Telegram', value: userData.idTelegram, inline: true },
                        { name: 'ID de Discord', value: userData.idDiscord, inline: true },
                        { name: 'WhatsApp', value: userData.numeroWhatsApp, inline: true },
                        { name: 'Fecha de Registro', value: new Date(userData.registrationDate).toLocaleString(), inline: false },
                        { name: 'ID Único', value: userData.id, inline: false }
                    ])
                    .setColor('Purple')
                    .setFooter({ text: 'Desarrollado por [Tu Nombre]' });

                await this.sendMessage(conn, chat, profileEmbed);
                break;
            }

            // Agrega más comandos según sea necesario
        }
    }

    parseMessage(m) {
        const prefixes = ['!', '?', '.'];
        const text = m.content || '';
        const userName = m.author.username || 'Usuario';
        const chat = m.channel.id;

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
            if (content instanceof EmbedBuilder) {
                await conn.channels.cache.get(chat).send({ embeds: [content] });
            } else {
                await conn.channels.cache.get(chat).send(content);
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    }
}