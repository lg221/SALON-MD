const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config");

cmd(
  {
    pattern: "channel",
    alias: ["my"],
    desc: "Send YouTube MP3 to a specific JID",
    category: "download",
    react: "🎧",
    filename: __filename,
  },
  async (robin, mek, m, { q, reply }) => {
    try {
      if (!q) return reply("*ඔයාලා ගීත නමක් හෝ YouTube ලින්ක් එකක් දෙන්න...!*");

      const search = await yts(q);
      if (!search.videos.length) return reply("*ගීතය හමුනොවුණා... ❌*");

      const data = search.videos[0];
      const ytUrl = data.url;

      const api = `https://yt-five-tau.vercel.app/download?q=${ytUrl}&format=mp3`;
      const { data: apiRes } = await axios.get(api);

      if (!apiRes?.status || !apiRes.result?.download) {
        return reply("❌ ගීතය බාගත කළ නොහැක. වෙනත් එකක් උත්සහ කරන්න!");
      }

      const result = apiRes.result;

      const caption = `*~⋆｡˚☁︎｡⋆｡__________________________⋆｡☁︎˚｡⋆~*

\`❍. Song ➙\`

\`❍.Time ➙\`          \`❍.Uploaded ➙\`


> ```❝♬.𝗥𝗘𝗔𝗖𝗧 𝗣𝗟𝗘𝗔𝗦𝗘 𝗚𝗨𝗬𝗦😽💗🍃❞``
`
> *||____*🔹.◦◦◦ \`[💜\\💛\\🩷\\🤍\\💚]\` 
_*BEST WHATSAPP CHANNEL IN SRI LANKA*_`;

      // Send thumbnail and caption to configured JID
      await robin.sendMessage(
        config.DINUWH,
        {
          image: { url: result.thumbnail },
          caption: caption,
        },
        { quoted: mek }
      );

      // Send audio to the same JID
      await robin.sendMessage(
        config.DINUWH,
        {
          audio: { url: result.download },
          mimetype: "audio/mpeg",
          ptt: true,
        },
        { quoted: mek }
      );

      // Confirmation message to command sender
      await robin.sendMessage(
        mek.key.remoteJid,
        {
          text: `✅ *"${result.title}"* නම් ගීතය *${config.DINUWH}* වෙත සාර්ථකව යවනු ලැබීය.`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("*ඇතැම් දෝෂයකි! පසුව නැවත උත්සහ කරන්න.*");
    }
  }
);
