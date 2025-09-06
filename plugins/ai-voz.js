import axios from 'axios';
import gtts from 'node-gtts';
import { readFileSync, unlinkSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';


const botname = 'Miku';
const emoji = '🌸';
const rwait = '🎙️';
const done = '🥳';
const error = '💥';
const GEMINI_API_KEY = "AIzaSyBA_t7qCvPrsuokI_RV2myhaEf3wtJSqbc"; // ← reemplaza con tu clave real
const defaultLang = 'es';
const memoryPath = './miku_memory.json';


function loadMemory() {
  if (!existsSync(memoryPath)) return {};
  return JSON.parse(readFileSync(memoryPath));
}

function saveMemory(memory) {
  writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}


function buildPrompt(username) {
  return `Tu nombre es ${botname}. Eres dulce, emocional y respondes de forma muy amable. Llamas a ${username} con ternura. También respondes sin emojis, sin puntos, ni comas ni símbolos especiales.`;
}


function tts(text, lang = defaultLang) {
  return new Promise((resolve, reject) => {
    try {
      const ttsInstance = gtts(lang);
      const filePath = join(global.__dirname(import.meta.url), '../tmp', `${Date.now()}.wav`);
      ttsInstance.save(filePath, text, () => {
        resolve(readFileSync(filePath));
        unlinkSync(filePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}


async function mikuPrompt(fullPrompt) {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      { contents: [{ role: "user", parts: [{ text: fullPrompt }] }] },
      { headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Miku no pudo canalizar la frase...';
  } catch (err) {
    console.error('[Miku Gemini Error]', err.response?.data || err.message);
    throw err;
  }
}


async function analyzeImage(basePrompt, imageBuffer, query, mimeType) {
  try {
    const base64Image = imageBuffer.toString('base64');
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: `${basePrompt}. ${query}` },
              { inlineData: { mimeType, data: base64Image } }
            ]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json', 'X-goog-api-key': GEMINI_API_KEY } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Miku no pudo interpretar la imagen...';
  } catch (err) {
    console.error('[Miku Img Error]', err.response?.data || err.message);
    throw err;
  }
}


let handler = async (m, { conn, usedPrefix, command, text, args }) => {
  const username = conn.getName(m.sender);
  const basePrompt = buildPrompt(username);
  const memory = loadMemory();

  await m.react(rwait);

  
  const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype?.startsWith('image/');
  if (isQuotedImage) {
    try {
      const q = m.quoted;
      const img = await q.download?.();
      if (!img) throw new Error('No se pudo descargar la imagen');

      const mimeType = q.mimetype || 'image/png';
      const query = `${emoji} Describe la imagen con ternura y dime qué sientes al verla.`;
      const description = await analyzeImage(basePrompt, img, query, mimeType);

      const audioBuffer = await tts(description, defaultLang);
      await conn.sendFile(m.chat, audioBuffer, 'miku.opus', null, m, true);
      await m.react(done);

      memory[m.sender] = description;
      saveMemory(memory);
      return;
    } catch (err) {
      console.error('[Miku Img Error]', err);
      await m.react(error);
      await conn.reply(m.chat, '💥 Miku no pudo interpretar la imagen. Intenta con otra.', m);
      return;
    }
  }

 
  try {
    const userText = text || memory[m.sender] || 'Dime algo bonito.';
    const prompt = `${basePrompt}. Frase: ${userText}`;
    const response = await mikuPrompt(prompt);

    const audioBuffer = await tts(response, args[0]?.length === 2 ? args[0] : defaultLang);

    const caption = `
╔═ೋ═══❖═══ೋ═╗
║ 🔊 Voz canalizada por Miku 🔊
║ 📝 Frase: ${userText}
║ 🎧 Estilo: Miku Bot ${emoji}
╚═ೋ═══❖═══ೋ═╝

Tu frase se convirtió en melodía emocional...
Espero que te saque una sonrisita ✨🎶
    `.trim();

    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mp4',
      ptt: true,
      caption
    }, { quoted: m });

    memory[m.sender] = userText;
    saveMemory(memory);

    await m.react(done);
  } catch (err) {
    console.error('[Miku Error]', err);
    await m.react(error);
    await conn.reply(m.chat, `
🚫 Ups... Miku se quedó sin voz

╔═ೋ═══❖═══ೋ═╗
║ 📄 Detalles: ${err.message}
║ 🔁 Sugerencia: Intenta más tarde o cambia la frase
╚═ೋ═══❖═══ೋ═╝

Pero no te preocupes... Miku siempre regresa cuando la necesitas 💫🎀
    `.trim(), m);
  }
};

handler.help = ['voz <texto>', 'voz <imagen>'];
handler.tags = ['ai'];
handler.command = ['voz', 'miku', 'habla'];

export default handler;