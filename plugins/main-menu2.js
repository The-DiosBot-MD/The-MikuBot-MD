
let handler = async (m, { conn}) => {
  let img = "https://qu.ax/WzgEA.jpg";
  let texto = `
🌸 *ＭＩＫＵ　ＢＯＴ - ＭＥＮＵ　ＤＥ　ＡＵＤＩＯＳ* 🌸

🎀 *Audios disponibles:* 🎀

🌷 _Tunometecabrasaramambiche_
🌷 _Me Anda Buscando Anonymous_
🌷 _Se Estan Riendiendo De Mi_
🌷 _Esto Va Ser Epico Papus_
🌷 _En Caso De Una Investigación_
🌷 _Elmo Sabe Donde Vives_
🌷 _Diagnosticado Con Gay_
🌷 _Esto Va Para Ti_
🌷 _Feliz Cumpleaños_
🌷 _Maldito Teni_
🌷 _Conoces a Miguel_
🌷 _Usted es Feo_
🌷 _Como Estan_
🌷 _Hermoso Negro_
🌷 _Usted Esta Detenido_
🌷 _Su Nivel De Pendejo_
🌷 _Quien Es Tu Botsito_
🌷 _No Me Hagas Usar Esto_
🌷 _Nadie Te Preguntó_
🌷 _Mierda De Bot_
🌷 _Ma Ma Masivo_
🌷 _La Oración_
🌷 _Jesucristo_
🌷 _Hora De Sexo_
🌷 _Gemidos_
🌷 _Gaspi Y La Minita_
🌷 _El Pepe_
🌷 _El Tóxico_
🌷 _Cambiate A Movistar_
🌷 _Buenas Noches_
🌷 _Buenos Días_
🌷 _Bien Pensado Woody_
🌷 _Ara Ara_
🌷 _Amongos_
🌷 _Audio Hentai_
🌷 _OMG_
🌷 _Onichan_
🌷 _Pikachu_
🌷 _Siuuu_
🌷 _Tarado_
🌷 _Teamo_
🌷 _Un Pato_
🌷 _WTF_
🌷 _Yamete_
🌷 _Yokese_
🌷 _Yoshi_
🌷 _ZZZZ_
🌷 _Bebesita_
🌷 _Calla Fan De BTS_
🌷 _Chiste_
🌷 _Contexto_
🌷 _Enojado_
🌷 _Estoy Triste_
🌷 _Feriado_
🌷 _Freefire_
🌷 _Hey_
🌷 _Me Olvide_
🌷 _Me Pica Los Cocos_
🌷 _Motivación_
🌷 _Nico Nico_
🌷 _Temazo_
🌷 _Una Pregunta_
🌷 _Vete A La VRG_
🌷 _:V_
`;

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Miku🌸"
},
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Miku;Bot;;;\nFN:Miku Bot 🌸\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Celular\nEND:VCARD`
}
},
    participant: "0@s.whatsapp.net"
};

  await conn.sendFile(m.chat, img, 'miku-menu-audios.jpg', texto, fkontak);
  global.db.data.users[m.sender].lastcofre = new Date * 1;
};
handler.help = ['menuaudios'];
handler.tags = ['main'];
handler.command = ['menu2', 'menuaudios'];
export default handler;