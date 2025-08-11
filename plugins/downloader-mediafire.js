import fetch from 'node-fetch';

const reply = (texto, conn, m) => {
    conn.sendMessage(m.chat, { text: texto }, { quoted: m });
};

let handler = async (m, { conn, text, command }) => {
    if (command === 'mediafire') {
        if (!text || !text.includes('mediafire.com/folder/')) {
            return reply('🥕 *Por favor, proporciona un enlace válido de carpeta Mediafire.*', conn, m);
        }

        try {
            const apiUrl = `https://delirius-apiofc.vercel.app/download/mediafire?url=${encodeURIComponent(text)}`;
            const res = await fetch(apiUrl);
            const json = await res.json();

            if (!json.status || !json.data || json.data.length === 0) {
                return reply('❌ *No se encontraron archivos en la carpeta o la API falló.*', conn, m);
            }

            let mensaje = `📂 *Carpeta detectada:* ${json.folder}\n🎭 *Archivos encontrados:*\n\n`;

            for (const file of json.data) {
                const sizeMB = (parseInt(file.size) / (1024 * 1024)).toFixed(2);
                mensaje += `📦 *${file.filename}*\n🧬 Tipo: ${file.mime}\n🧮 Tamaño: ${sizeMB} MB\n🔗 Enlace: ${file.link}\n\n`;
            }

            reply(mensaje.trim(), conn, m);

        } catch (err) {
            console.error('Error con la API de Delirius:', err.message);
            reply('❗️ *Error técnico al invocar la API de Delirius.*', conn, m);
        }
    }
};

handler.command = /^(mediafire|mfire)$/i;

export default handler;