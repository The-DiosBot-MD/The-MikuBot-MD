import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
    // Parámetros que puede pasar el usuario
    let style = args[0] || "Amor a primera vista";
    let theme = args.slice(1).join(" ") || "Me enamoré de ella y ella no me quiso";
    let stanzas = 5; // Por defecto 5 estrofas, puedes cambiarlo

    try {
        let url = `https://sky-api-omega.vercel.app/ai/poem-generator?style=${encodeURIComponent(style)}&theme=${encodeURIComponent(theme)}&stanzas=${stanzas}`;
        let res = await fetch(url);
        let json = await res.json();

        if (!json.status) throw json;

        let poem = `✨ *Generador de Poemas* ✨\n\n` +
                   `🎭 *Estilo:* ${json.result.style}\n` +
                   `💔 *Tema:* ${json.result.theme}\n` +
                   `📜 *Estrofas:* ${json.result.stanzas}\n\n` +
                   `${json.result.poem}\n\n` +
                   `> 🔖 *Power by Miku-Team* `;

        await conn.sendMessage(m.chat, { text: poem }, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, { text: "❌ No pude generar el poema. Intenta de nuevo." }, { quoted: m });
    }
}

handler.help = ['poema <estilo> <tema>'];
handler.tags = ['diversion'];
handler.command = ['poema', 'poem', 'poemgen'];

export default handler;