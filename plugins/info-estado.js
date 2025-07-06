let handler = async (m, { conn, isROwner }) => {
    let _muptime;
    if (process.send) {
        process.send('uptime');
        _muptime = await new Promise(resolve => {
            process.once('message', resolve);
            setTimeout(resolve, 1000); 
        }) * 1000;
    }

    let muptime = clockString(_muptime);
    const totalUsers = Object.keys(global.db.data.users).length;
    const totalChats = Object.keys(global.db.data.chats).length;

    const activeChats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    const privateChats = activeChats.filter(([id]) => !id.endsWith('@g.us'));
    const groupChats = activeChats.filter(([id]) => id.endsWith('@g.us'));

    const usedMemory = process.memoryUsage();
    
    const imageUrl = 'https://i.ibb.co/LYZrgRs/The-Miku-Bot-MD.jpg'; 

    let statusMessage = `
╔═〘 *ESTADO DEL BOT* 〛═
║
║  *💻 Plataforma:* ${process.platform}
║  *🟢 Node.js Versión:* ${process.version}
║  *⏰ Actividad:* ${muptime}
║
║  *👥 Usuarios Registrados:* ${totalUsers}
║  *💬 Chats Totales:* ${activeChats.length}
║  *✉️ Chats Privados:* ${privateChats.length}
║  *🏘️ Grupos Unidos:* ${groupChats.length}
║  *📊 Grupos Registrados:* ${totalChats}
║
║  *🧠 Uso de Memoria:*
║    ${(usedMemory.heapUsed / 1024 / 1024).toFixed(2)} MB (Usada)
║    ${(usedMemory.heapTotal / 1024 / 1024).toFixed(2)} MB (Total Heap)
║
╚═════════════════
    `;
    
    await conn.sendFile(m.chat, imageUrl, 'status.jpg', statusMessage, m);
};

handler.help = ['estado', 'info', 'botstatus'];
handler.tags = ['info'];
handler.command = /^(estado|info|botstatus|status)$/i;
handler.register = true; 

export default handler;

function clockString(ms) {
    if (ms === null || isNaN(ms)) {
        return 'N/A'; 
    }
    let d = Math.floor(ms / (3600000 * 24));
    let h = Math.floor((ms % (3600000 * 24)) / 3600000);
    let m = Math.floor((ms % 3600000) / 60000);
    let s = Math.floor((ms % 60000) / 1000);
    
    let parts = [];
    if (d > 0) parts.push(d + 'd');
    if (h > 0) parts.push(h + 'h');
    if (m > 0) parts.push(m + 'm');
    if (s > 0) parts.push(s + 's');

    return parts.length > 0 ? parts.join(' ') : '0s';
}