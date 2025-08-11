import fetch from 'node-fetch';

const mssg = {
    noLink: (platform) => `🥕 *Por favor, proporciona un enlace de ${platform}*.`,
    invalidLink: (platform) => `❗️ El enlace proporcionado no es válido de ${platform}. Por favor verifica el enlace.`,
    error: '❌ *El archivo no ha respondido al llamado del servidor imperial.*\n🧿 *Puede que esté oculto tras un velo de errores o haya sido desterrado del reino digital.*\n🔄 *Intenta con otro enlace o invoca de nuevo en unos minutos.*',
    fileTooLarge: (name) => `⚠️ *${name}* excede el límite de 650 MB y no puede ser invocado.`,
    busy: '⏳ *El servidor está procesando otra solicitud. Por favor, espera a que termine.*',
};

let isProcessing = false;

const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

const isFolderUrl = (url) => /mediafire\.com\/folder\/.+/i.test(url);

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'mediafire') {
        if (!text) {
            return reply(`❗️ *Por favor, ingresa un enlace de Mediafire*\n\nEjemplo: ${usedPrefix + command} https://www.mediafire.com/folder/xxxxxx/Nombre`, conn, m);
        }

        if (isProcessing) {
            return reply(mssg.busy, conn, m);
        }

        if (!isFolderUrl(text)) {
            return reply(mssg.invalidLink('Mediafire (carpeta)'), conn, m);
        }

        try {
            isProcessing = true;
            const apiUrl = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl);
            const json = await res.json();

            if (!json.status || !json.data || json.data.length === 0) {
                throw new Error('La API no devolvió archivos válidos.');
            }

            for (const file of json.data) {
                const sizeMB = parseInt(file.size) / (1024 * 1024);
                if (sizeMB > 650) {
                    await reply(mssg.fileTooLarge(file.filename), conn, m);
                    continue;
                }

                await conn.sendMessage(m.chat, {
                    document: { url: file.link },
                    mimetype: file.mime,
                    fileName: file.filename,
                }, { quoted: m });

                await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre envíos
            }

        } catch (err) {
            console.error('Error con la API de Delirius:', err.message);
            return reply(mssg.error, conn, m);
        } finally {
            isProcessing = false;
        }
    }
};

handler.command = /^(mediafire|mfire)$/i;

export default handler;