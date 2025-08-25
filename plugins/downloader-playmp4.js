import fetch from 'node-fetch';

let handler = async (m, { args }) => {
  const text = args.join(" ") || "dj malam pagi slowed";

  let res = await fetch(`https://api.vreden.my.id/api/ytplaymp4?query=${encodeURIComponent(text)}`);
  let json = await res.json();

  console.log(json); // 👈 aquí vemos la respuesta real
  m.reply("📩 Revisá tu consola, ya imprimí lo que devuelve la API");
};

handler.command = /^testyt$/i;
export default handler;