import fetch from 'node-fetch';

// Mensajes ritualizados
const mssg = {
    noLink: (platform) => `🥕 *Por favor, proporciona un enlace de ${platform}*.`,
    invalidLink: (platform) => `❗️ El enlace proporcionado no es válido de ${platform}. Verifica su estructura.`,
    error: '❗️ Ocurrió un error al procesar la descarga 🧐.',
    fileNotFound: '❗️ No se pudo encontrar el archivo. Asegúrate de que el enlace sea correcto.',
    fileTooLarge: '❗️ El archivo supera los 650 MB. No se puede procesar.',
    busy: '⏳ El servidor está procesando otra solicitud. Espera un momento.',
};

// Estado del servidor
let isProcessing = false;

// Función para enviar respuestas
const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

// Validación del enlace
const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?mediafire\.com\/file\/[^/]+\/[^/]+\/file$/i;
    return regex.test(url);
};

// Extraer nombre del archivo
const extractFileNameFromLink = (url) => {
    const match = url.match(/\/file\/[^/]+\/(.+?)\/file$/i);
    return match ? decodeURIComponent(match[1].replace(/%20/g, ' ')) : 'archivo_descargado';
};

// Determinar MIME
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

// Handler principal
let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) return reply(mssg.noLink('Mediafire'), conn, m);
    if (isProcessing) return reply(mssg.busy, conn, m);
    if (!isValidUrl(text)) return reply(mssg.invalidLink('Mediafire'), conn, m);

    try {
        isProcessing = true;
        const fileName = extractFileNameFromLink(text);
        const apiUrl = `https://api.sylphy.xyz/download/mediafire?url=${encodeURIComponent(text)}&apikey=sylphy-7df2`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status && json.data && json.data.dl_url) {
            const { dl_url, filesize, mimetype } = json.data;
            const sizeMB = parseFloat(filesize.replace(/[^0-9.]/g, ''));

            if (sizeMB > 650) return reply(mssg.fileTooLarge, conn, m);

            await conn.sendMessage(m.chat, {
                document: { url: dl_url },
                mimetype: mimetype || getMimeType(fileName),
                fileName: fileName,
            }, { quoted: m });

        } else {
            reply(mssg.fileNotFound, conn, m);
        }

    } catch (err) {
        console.error('Error con la API de Sylphy:', err.message);
        reply(mssg.error, conn, m);

    } finally {
        isProcessing = false;
    }
};

handler.command = /^(mediafire|mfire)$/i;

export default handler;