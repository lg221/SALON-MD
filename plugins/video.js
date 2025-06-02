const { cmd } = require('../command')
const fetch = require("node-fetch");
const ytsearch = require("yt-search");

cmd({ 
    pattern: "video", 
    alias: ["video2", "play"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "download", 
    use: '.video <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("⚠️ Please provide a YouTube URL or song name!");

        const yt = await ytsearch(q);
        if (yt.videos.length < 1) return reply("❌ No results found!");

        let yts = yt.videos[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;

        let response = await fetch(apiUrl);
        let data = await response.json();

        if (!data || data.status !== 200 || !data.result || !data.result.download_url) {
            return reply("⚠️ Failed to fetch the video. Please try again later.");
        }

        let ytmsg = `╭━━━〔 *🎭 FRONEXT MD 🃏* 〕━━━┈⊷
┃▸╭─────────────────
┃▸┃ 📽️ *VIDEO DOWNLOADER*
┃▸└─────────────────···
╰──────────────────────┈⊷
╭━━❐━⪼
┇📌 *Title:* ${yts.title}
┇⏱️ *Duration:* ${yts.timestamp}
┇👀 *Views:* ${yts.views}
┇👤 *Author:* ${yts.author.name}
┇🔗 *Link:* ${yts.url}
╰━━❑━⪼

*💫 Quality Video Downloader By FRONEXT MD*`;

        await conn.sendMessage(from, { image: { url: yts.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        await conn.sendMessage(from, { video: { url: data.result.download_url }, mimetype: "video/mp4" }, { quoted: mek });
        await conn.sendMessage(from, { 
            document: { url: data.result.download_url }, 
            mimetype: "video/mp4", 
            fileName: `${yts.title}.mp4`, 
            caption: `🎥 *${yts.title}*\n\n*🌟 Created By:* Cyber Froly\n*🤖 Bot:* FRONEXT MD`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});
