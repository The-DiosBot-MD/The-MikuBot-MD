let handler = async (m, { usedPrefix, command, text, conn }) => {
    let mentionedJid = m.mentionedJid[0] || text;
    if (!mentionedJid) return conn.reply(m.chat, `⚠️ Menciona a alguien para asustarlo.\nEjemplo: ${usedPrefix + command} @usuario`, m);

    const progreso = [
        "*🕒 Iniciando acceso a la cuenta...*",
        "■□□□□□ 20% [Conectando a servidor...]",
        "■■□□□□ 30% [Accediendo a base de datos...]",
        "■■■□□□ 50% [Recuperando credenciales...]",
        "■■■■□□ 60% [Desencriptando mensajes...]",
        "■■■■■□ 80% [Extrayendo archivos...]",
        "■■■■■■ 100% [Listo para ejecución]",
        "⚠️ *ERROR 502* ⚠️\n`Fallo en la conexión con el servidor`",
        "☠️ *¡Vulnerabilidad encontrada en el sistema!* ☠️",
        "📡 *Interceptando mensajes en tiempo real...*",
        "🛑 *Sistema comprometido. Contactando administrador...*",
        "🚨 *Acceso root obtenido. Eliminando archivos...*",
        "💀 *Redireccionando tráfico de WhatsApp...*",
        "🛠 *Instalando malware en dispositivo...*",
        "✅ *Proceso finalizado.*",
    ];

  
    const { key } = await conn.sendMessage(m.chat, { text: progreso[0] }, { quoted: m });

    
    for (let i = 1; i < progreso.length; i++) {
        await delay(1500);
        await conn.sendMessage(m.chat, { text: progreso[i], edit: key });
    }

 
    await delay(2000);
    await conn.sendMessage(m.chat, { 
        text: `⚠️ *ATENCIÓN* ⚠️\n\n@${mentionedJid.replace(/@s.whatsapp.net/g, '')} tu cuenta de WhatsApp ha sido hackeada. Todos tus datos han sido enviados a un servidor remoto. No hay vuelta atrás...`, 
        mentions: [mentionedJid], 
        edit: key
    });
};

handler.help = ['asustar @usuario'];
handler.tags = ['diversion'];
handler.command = ['asustar', 'hackear'];
handler.rowner = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));