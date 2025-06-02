const { cmd, commands } = require('../command');
const yts = require('yt-search');
const ddownr = require('denethdev-ytmp3'); // Importing the denethdev-ytmp3 package for downloading
const f = "`"
const bold = "*"
const config = require('../config')


cmd({
  pattern: "vishwa",
  desc: "Download songs.",
  category: "download",
  react: '🎧',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    if (!q) return reply("*Please Provide A Song Name or Url 🙄*");
    
    // Search for the song using yt-search
    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("*No Song Found Matching Your Query 🧐*");
    }

    const songData = searchResults.videos[0];
    const songUrl = songData.url;
    

  const jid = "120363389486431984@newsletter";
  
    // Using denethdev-ytmp3 to fetch the download link
    const result = await ddownr.download(songUrl, 'mp3'); // Download in mp3 format
    const downloadLink = result.downloadUrl; // Get the download URL

    let songDetailsMessage = `
☘️ *Tɪᴛʟᴇ :* ${bold}${songData.title}${bold}   🙇‍♂️💗  

▫️🎭 *Wɪᴇᴡꜱ :* ${songData.views}   
▫️⏱️ *Dᴜʀᴀᴛɪᴏɴ :* ${songData.timestamp} 
▫️📅 *Rᴇʟᴇᴀꜱᴇ Dᴀᴛᴇ :* ${songData.ago}    
▫️❄️ *Channel:* ${songData.author.name}    
▫️🔗 *Lɪɴᴋ :* ${songData.url}

> 𝗨𝘀𝗲 𝗛𝗲𝗮𝗱𝗽𝗵𝗼𝗻𝗲𝘀 𝗚𝗲𝘁 𝗚𝗼𝗼𝗱 𝗘𝘅𝗽𝗲𝗿𝗶𝗲𝗻𝘀𝗲💆‍♂️💗

*_මේ වගේ ලස්සන සිංදු අහන්න චැනල් එක follow කරල තියාගන්න ලස්සන ලමයෝහ්...💗💆‍♂️_*

❝SL MUSIC HUB💆‍♂️🎧 ᥫ᭡ Song Uploading❞
 `;
    

    
    // Send the video thumbnail with song details
await messageHandler.sendMessage(jid, {
      image: { url: songData.thumbnail },
      caption: songDetailsMessage,
    }, { quoted: quotedMessage });

    

      
             await messageHandler.sendMessage(jid, {
              audio: { url: downloadLink },
              mimetype: "audio/mpeg",
                 ptt: true
            }, { quoted: quotedMessage });
            
        
    } catch (error) {
    console.error(error);
    reply("*An Error Occurred While Processing Your Request 😔*");
  }
})
