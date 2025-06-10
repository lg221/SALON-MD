const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const config = require("../config");

cmd(
  {
    pattern: "tharusha",
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

      const caption = `◈=======================◈
╭─
┃ 🎵 *𝙏𝙞𝙩𝙡𝙚* : ${result.title}
┃
┃ ⏱️ *𝘿𝙪𝙧𝙖𝙩𝙞𝙤𝙣* : ${data.timestamp}
┃
┃ 📅 *𝙍𝙚𝙡𝙚𝙖𝙨𝙚* : ${data.ago}
┃
┃ 📊 *𝙑𝙞𝙚𝙬𝙨* : ${data.views}
┃
┃ 🔗 *𝙇𝙞𝙣𝙠* : ${data.url}
╰
⦁⦂⦁━┉━┉━┉━┉━┉━┉━┉━⦁⦂⦁

*🎧 Use headphones for best experience..!*`;

      // Send thumbnail and caption to configured JID
      await robin.sendMessage(
        config.THARUSHA,
        {
          image: { url: result.thumbnail },
          caption: caption,
        },
        { quoted: mek }
      );

      // Send audio to the same JID
      await robin.sendMessage(
        config.THARUSHA,
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
          text: `✅ *"${result.title}"* නම් ගීතය *${config.THARUSHA}* වෙත සාර්ථකව යවනු ලැබීය.`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("*ඇතැම් දෝෂයකි! පසුව නැවත උත්සහ කරන්න.*");
    }
  }
);
