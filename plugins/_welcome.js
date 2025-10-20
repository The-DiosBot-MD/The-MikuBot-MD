
import { WAMessageStubType} from "@whiskeysockets/baileys";
import fetch from "node-fetch";

export async function before(m, { conn, participants, groupMetadata}) {
  try {
    if (!m.messageStubType ||!m.isGroup) return;

    const imageLink = 'https://qu.ax/MVgVl.jpg';
    const user = `@${m.messageStubParameters[0].split('@')[0]}`;
    const groupName = groupMetadata.subject;
    const groupDesc = groupMetadata.desc || '🌸 Grupo sin descripción';
    const chat = global.db?.data?.chats?.[m.chat];

    if (!chat ||!chat.bienvenida) return;

    const responseMap = {
      [WAMessageStubType.GROUP_PARTICIPANT_ADD]: {
        text: `🌸 𝑾𝒆𝒍𝒄𝒐𝒎𝒆, ${user}!\n💫 𝑬𝒔𝒕𝒂𝒔 𝒆𝒏 *${groupName}*\n📝 ${groupDesc}\n📌 𝑫𝒊𝒗𝒊𝒆́𝒓𝒕𝒆 𝒚 𝒄𝒖𝒊𝒅𝒂 𝒍𝒂𝒔 𝒓𝒆𝒈𝒍𝒂𝒔`,
        mentions: [m.messageStubParameters[0]]
},
      [WAMessageStubType.GROUP_PARTICIPANT_LEAVE]: {
        text: `🍃 *${user} ha salido del grupo.*\n🌟 ¡Te esperamos de vuelta en *${groupName}*!`,
        mentions: [m.messageStubParameters[0]]
},
      [WAMessageStubType.GROUP_PARTICIPANT_REMOVE]: {
        text: `❌ *${user} fue eliminado de* ${groupName}.\n📮 Recuerda: ¡el respeto es lo primero!`,
        mentions: [m.messageStubParameters[0]]
}
};

    const response = responseMap[m.messageStubType];
    if (response) {
      await conn.sendMessage(m.chat, {
        image: { url: imageLink},
        caption: response.text,
        mentions: response.mentions
});
}
} catch (err) {
    console.error("🌸 Error en mensaje grupal de bienvenida/despedida:", err);
}
}