const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { Buffer } = require('buffer'); 
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const fileType = require("file-type")
const l = console.log
//=============================



cmd({
    pattern: "sinhala",
    desc: "Search and show top Sinhala subtitles for films.",
    react: "🎬",
    category: "movie",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || q.trim() === "") {
            return reply("*⚠️කරුණාකර නමක් ලබා දෙන්න⚠️,(E.g .sinhalasub spider man)*");
        }

        const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(q)}`;
        
        // Function to handle retries for axios requests
        const fetchData = async (url, retries = 5) => {
            try {
                const { data } = await axios.get(url);
                return data;
            } catch (error) {
                if (retries === 0) {
                    throw error;
                }
                console.log(`Retrying... (${retries} retries left)`);
                return await fetchData(url, retries - 1);
            }
        };

        // Fetch data using axios with retry logic
        const data = await fetchData(searchUrl);

        if (!data || !data.result || data.result.data.length === 0) {
            return reply("⚠️සොයාගත නොහැකි විය කරුණාකර අවුරුද්ද ඇතුලත් කරන්න⚠️, (E.g .sinhalasub love 2015)*");
        }

        const topFilms = data.result.data.slice(0, 20);
        const filmsList = topFilms.map((film, index) => `${index + 1}. 🎬 *${film.title} (${film.year})*`).join("\n\n");

        const msg = `🎥 *Fronext Movie Sinhala Sub Search,*\n\n🔍 *Search Results for:* *${q}*\n\n${filmsList}\n\n> Reply with a number to Select movie.`;

        const sentMsg = await conn.sendMessage(from, { text: msg }, { quoted: mek });

        const messageID = sentMsg?.key?.id;
        if (!messageID) return;

        // Step 3: Listen for user's selection
        conn.ev.on("messages.upsert", async (msgUpdate) => {
            const newMsg = msgUpdate.messages[0];
            if (!newMsg.message) return;

            const userText = newMsg.message.conversation || newMsg.message.extendedTextMessage?.text;
            const isReplyToBot = newMsg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

            if (isReplyToBot && /^[0-9]+$/.test(userText)) {
                const selectedIndex = parseInt(userText) - 1;
                if (selectedIndex < 0 || selectedIndex >= topFilms.length) {
                    return reply("*❌ නිවැරදි අංකයක් Reply කරන්න, (E.g 1-20)*");
                }

                const selectedFilm = topFilms[selectedIndex];
                const selectedMovieUrl = selectedFilm.link;
                
                // Fetch additional details from another API using the movie's URL
                let urll;
                try {
                    urll = await fetchData(`https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${selectedMovieUrl}`);
                } catch (e) {
                    return reply("*❌ දෝශයක් කරුනාකර නැවතත් උත්සහ කරන්න😞*");
                }
                
                if (!urll || !urll.result || !urll.result.data) {
                    return reply("*❌සමාවෙන්න,Film එකට අදාල Detail සොයාගත නොහැකි විය,කරුනාකර නැවතත් උත්සහ කරන්න😞*");
                }

                // Declare and assign the download links for video qualities
                const quality = urll.result.data.dl_links[0]?.link;
                const quality1 = urll.result.data.dl_links[1]?.link;
                const quality2 = urll.result.data.dl_links[2]?.link;

                // Check if the download links are available
                if (!quality || !quality1 || !quality2) {
                    return reply("සමාවෙන්න, මේ Film එකට අදාල Downlode Link සොයාගත නොහැකිය,Cine SUb Cmd(.cine) භාවිතාකර Film එක තිබේදැයි බලන්න😏");
                }

                // Replace "/u/" with "/api/file/" in the links
                let pp = quality.replace("/u/", "/api/file/");
                let pp1 = quality1.replace("/u/", "/api/file/");
                let pp2 = quality2.replace("/u/", "/api/file/");

                // Send movie details
                let msg = `🎥 𝐹𝑅𝑂𝑁𝐸𝑇 𝐹𝐼𝐿𝑀 𝑀𝐴𝑆𝑇𝐸𝑅 🎥

*☘️ Title:* *${urll.result.data.title || 'N/A'}*
*📆 Release:* *${urll.result.data.date || 'N/A'}*
*⭐️ IMDb Rating:* *${urll.result.data.imdbRate || 'N/A'}*
*🌎 Country:* *${urll.result.data.country || 'N/A'}*
*⏰ Runtime:* *${urll.result.data.runtime || 'N/A'}*

\n> ඩවුන්ලෝඩ් Option පේන්නැත්නම් ආයිත් Reply කරන්න.🫠

\n> *Powered by Fronext MD* 🎥✨

\n> *Powered by Pasindu Jayasundara* 🐉🍀
`;

                // Send download options
                let downloadOptions = `
╭━─━─━─≪✠≫─━─━─━╮  
│ 📌 *Reply with a Number*  
│  
│ 🔹 *Detail Card:*  🏷️ *1.1*  
│ 🔹 *All Images:*  🖼️ *1.2*  
│  
│ 🎥 *Movie Download Options:*  
│   🎬 *2.1* | 🏅 *480p*   | 📦 *Size:${urll.result.data.dl_links[2]?.size}*  
│   🎬 *2.2* | 🎖️ *720p*   | 📦 *Size:${urll.result.data.dl_links[1]?.size}* 
│   🎬 *2.3* | 🏆 *1080p* | 📦 *Size:${urll.result.data.dl_links[0]?.size}*  
│  
│ ✨ *Powered by FRONEXT MD* 🎥  
│ 💻 *Developed by Pasindu Jayasundara* 🐉🍀 
╰━─━─━─≪✠≫─━─━─━╯
`;


                // Send movie details with the image
                await conn.sendMessage(from, {
                    image: { url: botimg },
                    caption: msg,
                }, { quoted: mek });

                const sentMsg = await conn.sendMessage(from, { text: downloadOptions }, { quoted: mek });
                const messageID = sentMsg.key.id;

                // Step 5: Handle the user's download quality selection
                conn.ev.on('messages.upsert', async (messageUpdate) => {
                    const mek = messageUpdate.messages[0];
                    if (!mek.message) return;

                    const messageType = mek.message.conversation || mek.message.extendedTextMessage?.text;

                    // Check if the message is a reply to the download options message
                    const isReplyToSentMsg = mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo.stanzaId === messageID;
                    if (isReplyToSentMsg) {
                        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
                        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
                        console.log("⬆️ Movie Uploading ⬆️");
                        

                        // Handle the user's selection of video quality
                        if (messageType === '2.1') {
                            await conn.sendMessage(from, {
                                document: { url: pp2 },  // Link to the 480p video
                                mimetype: "video/mp4",    // MIME type for video
                                fileName: `🎬 fɾoɴeχt ᴍd 🎬${urll.result.data.title}`, // Added prefix to the file name
                                caption: `\n*🎬 Name:* ${urll.result.data.title}\n\n> *Powered by Fronext MD* 🎥✨`
                            }, { quoted: mek });
                        } else if (messageType === '2.2') {
                            await conn.sendMessage(from, {
                                document: { url: pp1 },  // Link to the 720p video
                                mimetype: "video/mp4",    // MIME type for video
                                fileName: `🎬 fɾoɴeχt ᴍd 🎬${urll.result.data.title}`, // Added prefix to the file name
                                caption: `\n*🎬 Name:* ${urll.result.data.title}\n\n> *Powered by Fronext MD* 🎥✨`
                            }, { quoted: mek });
                        } else if (messageType === '2.3') {
                            await conn.sendMessage(from, {
                                document: { url: pp },   // Link to the 1080p video
                                mimetype: "video/mp4",   // MIME type for video
                                fileName: `🎬 fɾoɴeχt ᴍd 🎬${urll.result.data.title}`, // Added prefix to the file name
                                caption: `\n*🎬 Name:* ${urll.result.data.title}\n\n> *Powered by Fronext MD* 🎥✨`
                            }, { quoted: mek });
                        } else if (messageType === '1.1') {
                            await conn.sendMessage(from, {
                                image: { url: urll.result.data.images[0] }, // Send image from URL
                                caption: `🎥 𝐹𝑅𝑂𝑁𝐸𝑇 𝐹𝐼𝐿𝑀 𝑀𝐴𝑆𝑇𝐸𝑅 🎥
                                
*☘️ Title:* *${urll.result.data.title || 'N/A'}* 
*📆 Release:* ${urll.result.data.date || 'N/A'}*
*⭐️ IMDb Rating:* *${urll.result.data.imdbRate || 'N/A'}*
*🌎 Country:* *${urll.result.data.country || 'N/A'}*
*⏰ Runtime:* *${urll.result.data.runtime || 'N/A'}*
*🎭 Genres:* *${urll.result.data.category.join(', ')}*
*👨🏻‍💼 DirecTor:* *${urll.result.data.director}*
                        
*🕵️‍♂️ Cast:* *${urll.result.data.cast.map(cast => cast.cast_name).join(', ')}*
                        
*💭 Description:*

${urll.result.data.description}
                                                       
\n> *Powered by Fronext MD* 🎥✨

\n> *Powered by Pasindu Jayasundara* 🐉🍀`
                            }, { quoted: mek });
                        
                        } else if (messageType === '1.2') {
                            // Send initial "Uploading image" message and store the message ID
                            let uploadingMsg = await conn.sendMessage(from, {
                                text: `📌 *Uploading images...* 🔹`,
                            }, { quoted: mek });
                        
                            // Loop through all images and send them
                            for (let imageUrl of urll.result.data.images) {
                                await conn.sendMessage(from, {
                                    image: { url: imageUrl },
                                    caption: `☘️ *𝗧ɪᴛ𝗟𝗘:* ${urll.result.data.title}\n\n> *Powered by Fronext MD* 🎥✨\n\n> *Powered by Pasindu Jayasundara* 🐉🍀`
                                });
                            }
                                                
                            // Send updated success message
                            await conn.sendMessage(from, {
                                text: `✅ *All images have been successfully uploaded!* 🎉`,
                            });
                        }
                        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
                        console.log("✅ Successfully All Detail uploaded🎉");

                    }
                });
            }
        });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message || e}`);
    }
});
