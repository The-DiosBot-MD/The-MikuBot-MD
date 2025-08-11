import fetch from 'node-fetch';

const mssg = {
    noLink: (platform) => `🥕 *Por favor, proporciona un enlace de ${platform}*.`,
    invalidLink: (platform) => `❗️ El enlace proporcionado no es válido de ${platform}. Por favor verifica el enlace.`,
    error: '❗️ Ocurrió un error al intentar procesar la descarga 🧐.',
    fileNotFound: '❗️ No se pudo encontrar el archivo en Mediafire. Asegúrate de que el enlace sea correcto.',
    fileTooLarge: '❗️ El archivo es demasiado grande (más de 650 MB). No se puede procesar.',
    busy: '❗️ El servidor está procesando otra solicitud. Por favor, espera a que termine.',
};

let isProcessing = false;

const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.*$/i;
    return regex.test(url);
};

const getMimeType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const mimeTypes = {
        'apk': 'application/vnd.android.package-archive',
        'zip': 'application/zip',
        'rar': 'application/vnd.rar',
        'mp4': 'video/mp4',
        'jpg': 'image/jpeg',
        'png': 'image/png',
        'pdf': 'application/pdf',
        'mp3': 'audio/mpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (command === 'mediafire') {
        if (!text) {
            return reply(`❗️ *Por favor, ingresa un enlace de Mediafire*\n\nEjemplo: ${usedPrefix + command} https://www.mediafire.com/file/abcd1234/file_name`, conn, m);
        }

        if (isProcessing) {
            return reply(mssg.busy, conn, m);
        }

        if (!isValidUrl(text)) {
            return reply(mssg.invalidLink('Mediafire'), conn, m);
        }

        try {
            isProcessing = true;
            console.log(`Procesando enlace con Vreden API: ${text}`);

            const apiUrl = `https://api.vreden.my.id/api/mediafiredl?url=${encodeURIComponent(text)}`;
            const apiResponse = await fetch(apiUrl);
            const json = await apiResponse.json();

            const result = json.result?.[0];

            if (!result || !result.status || !result.link || result.link === 'javascript:void(0)') {
                return reply(mssg.fileNotFound, conn, m);
            }

            const fileSizeMB = parseFloat(result.size.replace(/[^0-9.]/g, ''));
            if (fileSizeMB > 650) {
                return reply(mssg.fileTooLarge, conn, m);
            }

            const fileName = result.nama === 'javascript:void(0)' ? 'archivo_descargado.zip' : result.nama;
            const mimeType = result.mime === 'javascript:void(0)' ? getMimeType(fileName) : result.mime;

            await conn.sendMessage(m.chat, {
                document: { url: result.link },
                mimetype: mimeType,
                fileName: fileName,
            }, { quoted: m });

        } catch (error) {
            console.error('Error con la API de Vreden:', error.message);
            return reply(mssg.error, conn, m);
        } finally {
            isProcessing = false;
        }
    }
};

handler.command = /^(mediafire|mfire)$/i;

export default handler;