const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, fetchLatestBaileysVersion, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent, proto, Browsers } = require('@whiskeysockets/baileys');
const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs'); 
const path = require('path');
const fetch = require('node-fetch');
const FileType = require('file-type');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
const { toAudio, toPTT, toVideo } = require("./lib/conv");
const moment = require('moment-timezone');

const ownerNumber = ['94728132970'];

//------------------ Session ---------------------//

if (!fs.existsSync(__dirname + '/lib/creds.json')) {
    if (!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!');
    const sessdata = config.SESSION_ID;
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
        if (err) throw err;
        fs.writeFile(__dirname + '/lib/creds.json', data, () => {
            console.log("✅ FRONEXT MD| Session downloaded");
        });
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

//------------------ Database ---------------------//

async function connectToWA() {
    const connectDB = require('./lib/mongodb');
    connectDB();
    
    const { readEnv } = require('./lib/database');
    const config = await readEnv();
    const prefix = config.PREFIX;
    console.log("✅ FRONEXT MD | Connecting");

//------------------ setting input ---------------------//
   
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/lib/');
    var { version } = await fetchLatestBaileysVersion();
    
    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });

    let work;
    switch (config.MODE) {
        case 'public':
            work = 'Public';
            break;
        case 'private':
            work = 'Private';
            break;
        case 'groups':
            work = 'Only Group';
            break;
        case 'inbox':
            work = 'Only Inbox';
            break;
        default:
            work = 'Unkown';
    }

    let autoStatus = config.AUTO_READ_STATUS === 'true' ? 'true' : 'false';
    let autoVoice = config.AUTO_VOICE === 'true' ? 'true' : 'false';
    let autoreact = config.AUTO_REACT === 'true' ? 'true' : 'false';
    let AI_CHAT_BOT = config.AI_CHAT_BOT === 'true' ? 'true' : 'false';
    let OWNER_REACT = config.OWNER_REACT === 'true' ? 'true' : 'false';
    let autoBioEnabled = config.autoBioEnabled === 'true' ? 'true' : 'false';
    let AutoTyping = config.AutoTyping === 'true' ? 'true' : 'false';
    let AUTO_READ_CMD = config.AUTO_READ_CMD === 'true' ? 'true' : 'false';
    let AUTO_BLock_212 = config.AUTO_BLock_212 === 'true' ? 'true' : 'false';
    let AUTO_KICK_212 = config.AUTO_KICK_212 === 'true' ? 'true' : 'false';
    let WELCOME = config.WELCOME === 'true' ? 'true' : 'false';

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('✅ FRONEXT MD | Installing Commands');
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('✅ FRONEXT MD | Command installed successfully');
            console.log('✅ FRONEXT MD | Bot connected to WhatsApp');
            let up = `*𝐅𝐑𝐎𝐍𝐄𝐗𝐓 𝐌𝐃 𝐌𝐔𝐋𝐓𝐈 𝐃𝐄𝐕𝐈𝐃𝐄 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐎𝐓 ❤️*

*╭─「 ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴍꜱɢ 」*
*│OWNER*: ᴄʏʙᴇʀ ꜰʀᴏʟʏ
*│NUMBER*: +${ownerNumber}
*│PREFIX*: ${config.PREFIX}
*╰───────────◈◈►*

*╭──────────◈◈►*
*│🎗️ SETTING LIST*
*│   ───────*
*│ 1*   *Work Tipe* : *${work}*
*│ 2*   *Auto Voice* : *${autoVoice}*
*│ 3*   *Auto Status* : *${autoStatus}*
*│ 4*   *Auto React* : *${autoreact}*
*│ 5*   *Owner React* : *${OWNER_REACT}*
*│ 6*   *Auto Bio* : *${autoBioEnabled}*
*│ 7*   *Auto Typing* : *${AutoTyping}*
*│ 8*   *Auto Read Command* : *${AUTO_READ_CMD}*
*│ 9*   *Auto Block 212* : *${AUTO_BLock_212}*
*│ 10*  *Auto Kick 212* : *${AUTO_KICK_212}*
*│ 11*  *Welcome* : *${WELCOME}*
*╰───────────◈◈►*

> *ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ ʙʏ 𝒇𝒓𝒐𝒏𝒆𝒙𝒕 𝒎𝒅 *
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ - ᴄʏʙᴇʀ ꜰʀᴏʟʏ*`;
            
            conn.sendMessage(ownerNumber + "@s.whatsapp.net", {
                image: { url: `https://i.ibb.co/8gMhyC7J/8488.jpg` },
                caption: up
            });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;
        
//-----------------------------------------------//

    const jid = mek.key.remoteJid;
    let messageContent;

    if (mek.message.conversation) {
        messageContent = mek.message.conversation;
    } else if (mek.message.extendedTextMessage) {
        messageContent = mek.message.extendedTextMessage.text;
    } else if (mek.message.reactionMessage) {
        messageContent = mek.message.reactionMessage.text;
    } else {
        messageContent = 'Unknown message type';
    }

    console.log("JID:", jid + "Message:", messageContent);

        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;

//------------------ Auto statas reed ---------------------//
 
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
            await conn.readMessages([mek.key]);
        }

//------------------ Auto bio ---------------------//

if (config.autoBioEnabled === 'true'){
    await
conn.updateProfileStatus(`vishwa-md ᴍᴅ ᴀᴄᴛɪᴠᴇ sᴜᴄᴄᴇssғᴜʟʟʏ ⚡ ${moment.tz('Asia/Colombo').format('HH:mm:ss')}`)

}

//--------------------------------------------------//
 

        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const quoted = (type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null) ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const body = (type === 'conversation') ? mek.message.conversation :
                     (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text :
                     (type === 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption :
                     (type === 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : '';

        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const pushname = mek.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;
        const botNumber2 = await jidNormalizedUser(conn.user.id);
        const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => { }) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : [];
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : [];
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
        const isReact = m.message.reactionMessage ? true : false;

        const reply = (teks) => {
            conn.sendMessage(from, { text: teks }, { quoted: mek });
        };

        //---------------------------------------------------------//

        conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            let mime = '';
            let res = await axios.head(url);
            mime = res.headers['content-type'];
            if (mime.split("/")[1] === "gif") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options });
            }
            let type = mime.split("/")[0] + "Message";
            if (mime === "application/pdf") {
                return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "image") {
                return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "video") {
                return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options });
            }
            if (mime.split("/")[0] === "audio") {
                return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options });
            }
        };
// sendptt
       function jsobfvSfJ5e0_0xadcc(_0x35f616,_0x4f65e2){const _0x3c80de=jsobfvSfJ5e0_0x3c80();return jsobfvSfJ5e0_0xadcc=function(_0xadcc77,_0x28060c){_0xadcc77=_0xadcc77-0x137;let _0x19e9c7=_0x3c80de[_0xadcc77];if(jsobfvSfJ5e0_0xadcc['EOzjzz']===undefined){var _0x31c3d8=function(_0x43af5f){const _0x4e0929='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x2f8c03='',_0x1c78f6='';for(let _0x1689a7=0x0,_0x215060,_0xd1aa17,_0x581ec5=0x0;_0xd1aa17=_0x43af5f['charAt'](_0x581ec5++);~_0xd1aa17&&(_0x215060=_0x1689a7%0x4?_0x215060*0x40+_0xd1aa17:_0xd1aa17,_0x1689a7++%0x4)?_0x2f8c03+=String['fromCharCode'](0xff&_0x215060>>(-0x2*_0x1689a7&0x6)):0x0){_0xd1aa17=_0x4e0929['indexOf'](_0xd1aa17);}for(let _0x20aad6=0x0,_0x4a9853=_0x2f8c03['length'];_0x20aad6<_0x4a9853;_0x20aad6++){_0x1c78f6+='%'+('00'+_0x2f8c03['charCodeAt'](_0x20aad6)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1c78f6);};jsobfvSfJ5e0_0xadcc['dpPYiK']=_0x31c3d8,_0x35f616=arguments,jsobfvSfJ5e0_0xadcc['EOzjzz']=!![];}const _0x479b20=_0x3c80de[0x0],_0x539e90=_0xadcc77+_0x479b20,_0x464782=_0x35f616[_0x539e90];return!_0x464782?(_0x19e9c7=jsobfvSfJ5e0_0xadcc['dpPYiK'](_0x19e9c7),_0x35f616[_0x539e90]=_0x19e9c7):_0x19e9c7=_0x464782,_0x19e9c7;},jsobfvSfJ5e0_0xadcc(_0x35f616,_0x4f65e2);}function jsobfvSfJ5e0_0x43af(_0x35f616,_0x4f65e2){const _0x3c80de=jsobfvSfJ5e0_0x3c80();return jsobfvSfJ5e0_0x43af=function(_0xadcc77,_0x28060c){_0xadcc77=_0xadcc77-0x137;let _0x19e9c7=_0x3c80de[_0xadcc77];if(jsobfvSfJ5e0_0x43af['BIlVgp']===undefined){var _0x31c3d8=function(_0x4e0929){const _0x2f8c03='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x1c78f6='',_0x1689a7='';for(let _0x215060=0x0,_0xd1aa17,_0x581ec5,_0x20aad6=0x0;_0x581ec5=_0x4e0929['charAt'](_0x20aad6++);~_0x581ec5&&(_0xd1aa17=_0x215060%0x4?_0xd1aa17*0x40+_0x581ec5:_0x581ec5,_0x215060++%0x4)?_0x1c78f6+=String['fromCharCode'](0xff&_0xd1aa17>>(-0x2*_0x215060&0x6)):0x0){_0x581ec5=_0x2f8c03['indexOf'](_0x581ec5);}for(let _0x4a9853=0x0,_0x3527cc=_0x1c78f6['length'];_0x4a9853<_0x3527cc;_0x4a9853++){_0x1689a7+='%'+('00'+_0x1c78f6['charCodeAt'](_0x4a9853)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x1689a7);};const _0x43af5f=function(_0x44410a,_0x180b0b){let _0x3b6d72=[],_0x2e05a8=0x0,_0x348966,_0x325c4f='';_0x44410a=_0x31c3d8(_0x44410a);let _0x24c9e2;for(_0x24c9e2=0x0;_0x24c9e2<0x100;_0x24c9e2++){_0x3b6d72[_0x24c9e2]=_0x24c9e2;}for(_0x24c9e2=0x0;_0x24c9e2<0x100;_0x24c9e2++){_0x2e05a8=(_0x2e05a8+_0x3b6d72[_0x24c9e2]+_0x180b0b['charCodeAt'](_0x24c9e2%_0x180b0b['length']))%0x100,_0x348966=_0x3b6d72[_0x24c9e2],_0x3b6d72[_0x24c9e2]=_0x3b6d72[_0x2e05a8],_0x3b6d72[_0x2e05a8]=_0x348966;}_0x24c9e2=0x0,_0x2e05a8=0x0;for(let _0x5a2362=0x0;_0x5a2362<_0x44410a['length'];_0x5a2362++){_0x24c9e2=(_0x24c9e2+0x1)%0x100,_0x2e05a8=(_0x2e05a8+_0x3b6d72[_0x24c9e2])%0x100,_0x348966=_0x3b6d72[_0x24c9e2],_0x3b6d72[_0x24c9e2]=_0x3b6d72[_0x2e05a8],_0x3b6d72[_0x2e05a8]=_0x348966,_0x325c4f+=String['fromCharCode'](_0x44410a['charCodeAt'](_0x5a2362)^_0x3b6d72[(_0x3b6d72[_0x24c9e2]+_0x3b6d72[_0x2e05a8])%0x100]);}return _0x325c4f;};jsobfvSfJ5e0_0x43af['wXFirl']=_0x43af5f,_0x35f616=arguments,jsobfvSfJ5e0_0x43af['BIlVgp']=!![];}const _0x479b20=_0x3c80de[0x0],_0x539e90=_0xadcc77+_0x479b20,_0x464782=_0x35f616[_0x539e90];return!_0x464782?(jsobfvSfJ5e0_0x43af['BaiXRH']===undefined&&(jsobfvSfJ5e0_0x43af['BaiXRH']=!![]),_0x19e9c7=jsobfvSfJ5e0_0x43af['wXFirl'](_0x19e9c7,_0x28060c),_0x35f616[_0x539e90]=_0x19e9c7):_0x19e9c7=_0x464782,_0x19e9c7;},jsobfvSfJ5e0_0x43af(_0x35f616,_0x4f65e2);}const jsobfvSfJ5e0_0x24168f=jsobfvSfJ5e0_0xadcc;function jsobfvSfJ5e0_0x3c80(){const _0x5da6b7=['WP/cVmkecG','ANnVyMyUy29T','u8kYW5ec','xrhdHG','nJC3odC1sKvRD2r0','C3rPy2TLCG','kSkaW7fNW5rRgJ/cTZm','ndC4mtfMCwfQvgm','zg9JDw1LBNq','mGCwyG','ANnVBG','zMLSzw5HBwu','W6Gwr8obstW4W6ZcPSkZote','mtK3mZnhuM5juvy','hSk9WRmk','WR8Ydmk5WPFdKvzs','W5fxu2PkW5a','W4BdTt3dOCk8','vCkxWPbrfW','WRClW717W4S','y0nWBNa','W6NdS8kvua','C2vUzezPBgu','W4ZdICk3kvS','rCkXWPK1dG','qSklWRalygOr','D2zHr1K','kmkxqGfK','WQHfaSkf','fSkWWRGxxG','kSo7mfLdWRXwxmohW51s','h8kAa8kTW7tcJwZcOW','WRmTvmoLW5qhWRFcMCoOlatdPG','W7VcJvRcISkSWOOhaGOC','lMjPBG','DSoga3eT','a8kQW7zRW4W','B1H2yNK','ChjVBwLZzxm','BhLUD2C','x0ddOq','CMvHzezPBgvtEq','t0fVtuO','FCkfzspcLCkBAmoaoCoh','vmk7WQVcRG','A3rTvw4','C3bSAxq','W6nOdmkW','W4rmo8kQWPa','yxbWBgLJyxrPBW','yMfZzty0','u8kQWRNcRSkTW5u','C2vUze1LC3nHzW','zxHPC3rZu3LUyW','tNLvsxO','AgfBWPjLWQ3cImoUfCkLcey','B09YuMC','lrpcQdVcVq','W7LLoCkz','A01KBw0','rGBcJahdTbS','zSoBW6FdHwVdSa','z2v0rMLSzq','mJG5mJqWBNnAtNvO','uCo2yrJdT8of','WPhcTmkzg2xcNCoM','pJuGW4ep','W7tcMmodWOvIrSoR','vqddNWy','BwLTzxr5Cgu','Bw4AW4erW7RcImo2','ndjutxrrDwW','wMfhv1a','g8kDWQG2Dq','zgf0yq','shvIzfu','dmoJW44cWROcWQze','mJmWmJeZmhHQB0Pjza','F8kJCWS','qCk9WPdcV8kc','gbWfxSoO','WRdcMLJcU8kN','zxH0','tezcs08','CxvVDgvK','DxjS'];jsobfvSfJ5e0_0x3c80=function(){return _0x5da6b7;};return jsobfvSfJ5e0_0x3c80();}(function(_0x14ae6f,_0x8b3ad){const jsobfvSfJ5e0_0x2ee5e5={_0x1fac81:'0x15a',_0x4fa5f3:'ktmo',_0x1474ab:0x13d,_0x48552e:'x]g^',_0x86c81b:'QEOP',_0x467ac0:'%rFt',_0xb99ffa:0x184,_0x3b4c1b:'x]g^',_0x1701f5:0x144},_0x338883=jsobfvSfJ5e0_0x43af,_0x3a6cbb=jsobfvSfJ5e0_0xadcc,_0x3e6b8a=_0x14ae6f();while(!![]){try{const _0x54d737=parseInt(_0x3a6cbb(jsobfvSfJ5e0_0x2ee5e5._0x1fac81))/0x1+-parseInt(_0x338883('0x159',jsobfvSfJ5e0_0x2ee5e5._0x4fa5f3))/0x2+parseInt(_0x3a6cbb(0x154))/0x3*(-parseInt(_0x338883(jsobfvSfJ5e0_0x2ee5e5._0x1474ab,jsobfvSfJ5e0_0x2ee5e5._0x48552e))/0x4)+-parseInt(_0x3a6cbb(0x151))/0x5*(-parseInt(_0x338883(0x166,jsobfvSfJ5e0_0x2ee5e5._0x86c81b))/0x6)+parseInt(_0x338883('0x15c',jsobfvSfJ5e0_0x2ee5e5._0x467ac0))/0x7*(parseInt(_0x3a6cbb('0x18c'))/0x8)+-parseInt(_0x338883(jsobfvSfJ5e0_0x2ee5e5._0xb99ffa,jsobfvSfJ5e0_0x2ee5e5._0x3b4c1b))/0x9+parseInt(_0x3a6cbb(jsobfvSfJ5e0_0x2ee5e5._0x1701f5))/0xa;if(_0x54d737===_0x8b3ad)break;else _0x3e6b8a['push'](_0x3e6b8a['shift']());}catch(_0xd84ed3){_0x3e6b8a['push'](_0x3e6b8a['shift']());}}}(jsobfvSfJ5e0_0x3c80,0x29f74),!(function(){const jsobfvSfJ5e0_0x1449aa={_0x1b6225:0x16a,_0x294d66:0x170,_0x400112:'090o'},_0x2a39c9=jsobfvSfJ5e0_0xadcc,_0x3fe4db=jsobfvSfJ5e0_0x43af,_0xaf09={};_0xaf09[_0x3fe4db(jsobfvSfJ5e0_0x1449aa._0x1b6225,'QEOP')]=_0x2a39c9('0x14e');const _0x5be709=_0xaf09;try{_jsobfvia=_0x5be709[_0x3fe4db(jsobfvSfJ5e0_0x1449aa._0x294d66,jsobfvSfJ5e0_0x1449aa._0x400112)];}catch(_0x3e6468){}}()),conn[jsobfvSfJ5e0_0x24168f('0x18b')]=async(_0x4c9583,_0x3eff66)=>{const jsobfvSfJ5e0_0x357d91={_0x3fbf7e:0x17f,_0x36bbda:'0x17e',_0x1a486b:'0x187',_0x3dc765:'%rFt',_0x26d38e:'0x17c',_0x170d18:'bDIJ',_0x5da4c1:0x15d,_0x4b3d74:'0x189',_0x4bfb6a:'wgom',_0x1f7482:0x183,_0x26af2b:0x14a,_0xd90e6f:'0x149',_0x5cb8ad:'BrZ5',_0x153c02:'0x174',_0x28d2f5:0x140,_0x274b75:'QEOP',_0x1bf14f:'0x185',_0x5aee63:'0x141'},_0x1cca5d=jsobfvSfJ5e0_0x43af,_0x395d32=jsobfvSfJ5e0_0x24168f,_0x48c1ad={'nONPq':_0x395d32(jsobfvSfJ5e0_0x357d91._0x3fbf7e),'ABjDn':function(_0x584800,_0x30699a){return _0x584800(_0x30699a);},'NyUIz':'Result\x20is\x20'+'not\x20a\x20buff'+'er','LFBKO':_0x395d32(jsobfvSfJ5e0_0x357d91._0x36bbda)+'n/octet-st'+_0x1cca5d(jsobfvSfJ5e0_0x357d91._0x1a486b,jsobfvSfJ5e0_0x357d91._0x3dc765),'jSJTH':_0x395d32(0x16f),'lynwg':function(_0x31d92d,_0x261ccb){return _0x31d92d&&_0x261ccb;},'oOrRg':function(_0x8ada1a,_0x19f8be){return _0x8ada1a+_0x19f8be;},'khrwj':function(_0x22485c,_0x3e5c47){return _0x22485c*_0x3e5c47;}};let _0x1f0223,_0x67f5de,_0x18981c=Buffer['isBuffer'](_0x4c9583)?_0x4c9583:/^data:.*?\/.*?;base64,/i['test'](_0x4c9583)?Buffer[_0x1cca5d(jsobfvSfJ5e0_0x357d91._0x26d38e,jsobfvSfJ5e0_0x357d91._0x170d18)](_0x4c9583[_0x395d32(0x17b)]`,`[0x1],_0x48c1ad['nONPq']):/^https?:\/\//['test'](_0x4c9583)?await(_0x1f0223=await _0x48c1ad['ABjDn'](fetch,_0x4c9583))[_0x1cca5d(jsobfvSfJ5e0_0x357d91._0x5da4c1,'fQ@X')]():fs[_0x395d32(0x182)](_0x4c9583)?(_0x67f5de=_0x4c9583,fs[_0x395d32(0x176)+'nc'](_0x4c9583)):typeof _0x4c9583===_0x1cca5d(jsobfvSfJ5e0_0x357d91._0x4b3d74,'jajj')?_0x4c9583:Buffer[_0x1cca5d('0x160',jsobfvSfJ5e0_0x357d91._0x4bfb6a)](0x0);if(!Buffer[_0x1cca5d(0x16c,'DmWW')](_0x18981c))throw new TypeError(_0x48c1ad[_0x395d32(jsobfvSfJ5e0_0x357d91._0x1f7482)]);const _0x2b48fc={};_0x2b48fc[_0x1cca5d(0x14f,'bE&!')]=_0x48c1ad[_0x395d32(jsobfvSfJ5e0_0x357d91._0x26af2b)],_0x2b48fc[_0x395d32(jsobfvSfJ5e0_0x357d91._0xd90e6f)]=_0x48c1ad['jSJTH'];let _0x2cac29=await FileType[_0x1cca5d('0x153',jsobfvSfJ5e0_0x357d91._0x5cb8ad)](_0x18981c)||_0x2b48fc;if(_0x48c1ad[_0x395d32(jsobfvSfJ5e0_0x357d91._0x153c02)](_0x18981c,_0x3eff66)&&!_0x67f5de)_0x67f5de=path[_0x1cca5d(0x15b,'QEOP')](__dirname,_0x48c1ad[_0x1cca5d(jsobfvSfJ5e0_0x357d91._0x28d2f5,jsobfvSfJ5e0_0x357d91._0x274b75)](_0x48c1ad[_0x395d32(jsobfvSfJ5e0_0x357d91._0x1bf14f)](_0x1cca5d(0x18a,'Z]6e'),_0x48c1ad[_0x1cca5d(0x15e,'Vr7S')](new Date(),0x1))+'.',_0x2cac29[_0x1cca5d(0x150,'^SKx')])),await fs[_0x395d32(0x173)]['writeFile'](_0x67f5de,_0x18981c);const _0x13aabc={'res':_0x1f0223,'filename':_0x67f5de,..._0x2cac29};return _0x13aabc[_0x395d32(jsobfvSfJ5e0_0x357d91._0x5aee63)]=_0x18981c,_0x13aabc;},conn[jsobfvSfJ5e0_0x24168f('0x163')]=async(_0x10661f,_0x44f602,_0x3aed5a='',_0x5f3e9e='',_0xa951b1,_0x5e3ef3=![],_0x4013ff={})=>{const jsobfvSfJ5e0_0x3895d1={_0x29bdf1:0x13f,_0x5772c3:'0x186',_0x472085:'0x177',_0x4ee544:0x161,_0x5d14d4:0x172,_0x166c4c:0x167,_0x20897d:'0x152',_0x3ad6cf:'0x165',_0xe14563:'GNNT',_0x55a5c3:'0x148',_0xae2f31:'KL(K',_0x399446:'0x139',_0x106e3c:'bDIJ',_0x30cbbf:'0x13a',_0x568c95:'0x188',_0x1fa84d:0x180,_0x29e815:0x137,_0x7e4588:'0x168',_0x89333b:'HBmz',_0x1e037f:'tGFM',_0x38fadc:'0x14b',_0x162cab:0x169,_0x238ca6:0x14d,_0x5cc076:'zq(@',_0x2ef492:'0x17a',_0x2d775e:'0x179',_0x1b2f6d:'GWz4',_0x43c40d:'0x13b',_0x336115:0x145,_0x19395e:0x146,_0xa6982d:0x14c,_0x82c31b:'0x138',_0x3595b8:0x175,_0x1008f1:0x13c},_0x165def=jsobfvSfJ5e0_0x43af,_0x1ba4e8=jsobfvSfJ5e0_0x24168f,_0x1df0fb={};_0x1df0fb[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x29bdf1)]='jsobf.com',_0x1df0fb[_0x165def(jsobfvSfJ5e0_0x3895d1._0x5772c3,'qqUa')]=function(_0x3543a5,_0x1b4f73){return _0x3543a5!==_0x1b4f73;},_0x1df0fb[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x472085)]=function(_0x31ec34,_0x29b222){return _0x31ec34<=_0x29b222;},_0x1df0fb[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x4ee544)]=function(_0x22efc0,_0x21bc5f){return _0x22efc0===_0x21bc5f;},_0x1df0fb['HubdU']=_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x5d14d4),_0x1df0fb[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x166c4c)]=_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x20897d),_0x1df0fb[_0x165def('0x171','BrZ5')]=_0x165def(jsobfvSfJ5e0_0x3895d1._0x3ad6cf,jsobfvSfJ5e0_0x3895d1._0xe14563),_0x1df0fb[_0x165def(jsobfvSfJ5e0_0x3895d1._0x55a5c3,jsobfvSfJ5e0_0x3895d1._0xae2f31)]=_0x165def('0x164',']#5n'),_0x1df0fb[_0x165def(jsobfvSfJ5e0_0x3895d1._0x399446,'x]g^')]=_0x165def('0x178','r1zy')+_0x165def('0x16e','KL(K')+'us',_0x1df0fb[_0x165def('0x17d',jsobfvSfJ5e0_0x3895d1._0x106e3c)]=_0x1ba4e8(0x155);const _0x54ffee=_0x1df0fb;let _0x5e1507=await conn[_0x165def(jsobfvSfJ5e0_0x3895d1._0x30cbbf,'uU@M')](_0x44f602,!![]),{res:_0x15ffcf,data:_0x3770dc,filename:_0x3fe53e}=_0x5e1507;if(_0x15ffcf&&_0x54ffee[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x568c95)](_0x15ffcf[_0x165def(jsobfvSfJ5e0_0x3895d1._0x1fa84d,'GWz4')],0xc8)||_0x54ffee[_0x1ba4e8(0x177)](_0x3770dc[_0x165def(jsobfvSfJ5e0_0x3895d1._0x29e815,'lT6r')],0x10000)){if(_0x54ffee[_0x165def(jsobfvSfJ5e0_0x3895d1._0x7e4588,jsobfvSfJ5e0_0x3895d1._0x89333b)](_0x54ffee[_0x1ba4e8(0x142)],_0x54ffee[_0x1ba4e8(0x142)]))try{throw{'json':JSON[_0x165def('0x15f',jsobfvSfJ5e0_0x3895d1._0x1e037f)](_0x3770dc['toString']())};}catch(_0x217a18){if(_0x217a18[_0x1ba4e8(0x157)])throw _0x217a18['json'];}else _0x180b0b=_0x54ffee[_0x1ba4e8(0x13f)];}const _0x2a8e85={};_0x2a8e85['filename']=_0x3aed5a;let _0x4654ab=_0x2a8e85;if(_0xa951b1)_0x4654ab[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x38fadc)]=_0xa951b1;if(!_0x5e1507){if(_0x4013ff['asDocument'])_0x4013ff['asDocument']=!![];}let _0x49ac78='',_0x551bc6=_0x5e1507[_0x165def('0x156','3zwu')];if(/webp/[_0x165def(0x162,'v8$6')](_0x5e1507['mime']))_0x49ac78=_0x54ffee[_0x1ba4e8(0x167)];else{if(/image/[_0x165def(jsobfvSfJ5e0_0x3895d1._0x162cab,'ktmo')](_0x5e1507[_0x165def(jsobfvSfJ5e0_0x3895d1._0x238ca6,jsobfvSfJ5e0_0x3895d1._0x5cc076)]))_0x49ac78=_0x54ffee['OXhaZ'];else{if(/video/['test'](_0x5e1507['mime']))_0x49ac78=_0x54ffee[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x2ef492)];else{if(/audio/[_0x165def(jsobfvSfJ5e0_0x3895d1._0x2d775e,jsobfvSfJ5e0_0x3895d1._0x1b2f6d)](_0x5e1507[_0x165def(jsobfvSfJ5e0_0x3895d1._0x43c40d,'^SKx')]))convert=await(_0x5e3ef3?toPTT:toAudio)(_0x3770dc,_0x5e1507[_0x1ba4e8('0x149')]),_0x3770dc=convert[_0x165def(jsobfvSfJ5e0_0x3895d1._0x336115,'7Szg')],_0x3fe53e=convert[_0x1ba4e8(0x158)],_0x49ac78='audio',_0x551bc6=_0x54ffee[_0x165def(jsobfvSfJ5e0_0x3895d1._0x19395e,'GWz4')];else _0x49ac78=_0x54ffee[_0x165def('0x147','FFsk')];}}}const _0x42863c={};_0x42863c[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0xa6982d)]=_0x3fe53e;const _0x48c754={..._0x4013ff};_0x48c754[_0x165def(jsobfvSfJ5e0_0x3895d1._0x82c31b,'zq(@')]=_0x5f3e9e,_0x48c754[_0x165def(jsobfvSfJ5e0_0x3895d1._0x3595b8,']LGi')]=_0x5e3ef3,_0x48c754[_0x49ac78]=_0x42863c,_0x48c754[_0x1ba4e8(jsobfvSfJ5e0_0x3895d1._0x1008f1)]=_0x551bc6;const _0x507f90={..._0x4654ab,..._0x4013ff};return await conn[_0x1ba4e8(0x181)+'e'](_0x10661f,_0x48c754,_0x507f90);});!function(){try{_jsobfhashCdJtlM="86f224ef09e2b8496e96693b3d2217bc";}catch(t){}}();//------------------ Auto react ---------------------//

        /*
        if (config.AUTO_REACT === 'true') { 
    if (isReact) return;
    const emojis = ["🩷", "🔥", "✨", "🔮", "♠️", "🪄", "🔗", "🫧", "🪷", "🦠", "🌺", "🐬", "🦋", "🍁", "🌿", "🍦", "🌏", "✈️", "❄️"];
    
    emojis.forEach(emoji => {
      m.react(emoji);
    });
        }
       

        // Auto React 
if (!isReact && senderNumber !== botNumber) {
    if (config.AUTO_REACT === 'true') {
        const reactions = ['😊', '👍', '😂', '💯', '🔥', '🙏', '🎉', '👏', '😎', '🤖', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '🙂', '😑', '🤣', '😍', '😘', '😗', '😙', '😚', '😛', '😝', '😞', '😟', '😠', '😡', '😢', '😭', '😓', '😳', '😴', '😌', '😆', '😂', '🤔', '😒', '😓', '😶', '🙄', '🐶', '🐱', '🐔', '🐷', '🐴', '🐲', '🐸', '🐳', '🐋', '🐒', '🐑', '🐕', '🐩', '🍔', '🍕', '🥤', '🍣', '🍲', '🍴', '🍽', '🍹', '🍸', '🎂', '📱', '📺', '📻', '🎤', '📚', '💻', '📸', '📷', '❤️', '💔', '❣️', '☀️', '🌙', '🌃', '🏠', '🚪', "🇺🇸", "🇬🇧", "🇨🇦", "🇦🇺", "🇯🇵", "🇫🇷", "🇪🇸", '👍', '👎', '👏', '👫', '👭', '👬', '👮', '🤝', '🙏', '👑', '🌻', '🌺', '🌸', '🌹', '🌴', "🏞️", '🌊', '🚗', '🚌', "🛣️", "🛫️", "🛬️", '🚣', '🛥', '🚂', '🚁', '🚀', "🏃‍♂️", "🏋️‍♀️", "🏊‍♂️", "🏄‍♂️", '🎾', '🏀', '🏈', '🎯', '🏆', '??', '⬆️', '⬇️', '⇒', '⇐', '↩️', '↪️', 'ℹ️', '‼️', '⁉️', '‽️', '©️', '®️', '™️', '🔴', '🔵', '🟢', '🔹', '🔺', '💯', '👑', '🤣', "🤷‍♂️", "🤷‍♀️", "🙅‍♂️", "🙅‍♀️", "🙆‍♂️", "🙆‍♀️", "🤦‍♂️", "🤦‍♀️", '🏻', '💆‍♂️', "💆‍♀️", "🕴‍♂️", "🕴‍♀️", "💇‍♂️", "💇‍♀️", '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '�', '🏯', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🌳', '🌲', '🌾', '🌿', '🍃', '🍂', '🍃', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌱', '🌿', '🍃', '🍂', '🌻', '💐', '🌹', '🌺', '🌸', '🌴', '🏵', '🎀', '🏆', '🏈', '🏉', '🎯', '🏀', '🏊', '🏋', '🏌', '🎲', '📚', '📖', '📜', '📝', '💭', '💬', '🗣', '💫', '🌟', '🌠', '🎉', '🎊', '👏', '💥', '🔥', '💥', '🌪', '💨', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', '🌪', '🌫', '🌬', '🌩', '🌨', '🌧', '🌦', '🌥', '🌡', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🏠', '🏡', '🏢', '🏣', '🏥', '🏦', '🏧', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏮', '🏯', '🚣', '🛥', '🚂', '🚁', '🚀', '🛸', '🛹', '🚴', '🚲', '🛺', '🚮', '🚯', '🚱', '🚫', '🚽', "🕳️", '💣', '🔫', "🕷️", "🕸️", '💀', '👻', '🕺', '💃', "🕴️", '👶', '👵', '👴', '👱', '👨', '👩', '👧', '👦', '👪', '👫', '👭', '👬', '👮', "🕴️", '💼', '📊', '📈', '📉', '📊', '📝', '📚', '📰', '📱', '💻', '📻', '📺', '🎬', "📽️", '📸', '📷', "🕯️", '💡', '🔦', '🔧', '🔨', '🔩', '🔪', '🔫', '👑', '👸', '🤴', '👹', '🤺', '🤻', '👺', '🤼', '🤽', '🤾', '🤿', '🦁', '🐴', '🦊', '🐺', '🐼', '🐾', '🐿', '🦄', '🦅', '🦆', '🦇', '🦈', '🐳', '🐋', '🐟', '🐠', '🐡', '🐙', '🐚', '🐜', '🐝', '🐞', "🕷️", '🦋', '🐛', '🐌', '🐚', '🌿', '🌸', '💐', '🌹', '🌺', '🌻', '🌴', '🏵', '🏰', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', "🐕‍🦺", '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', "🐈‍⬛", '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', "🐿️", '🦫', '🦔', '🦇', '🐻', "🐻‍❄️", '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', "🕊️", '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', "😶‍🌫️", '😏', '😒', '🙄', '😬', "😮‍💨", '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', "😵‍💫", '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', "❤️‍🔥", "❤️‍🩹", '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', "🕳️", '💣', '💬', "👁️‍🗨️", "🗨️", "🗯️", '💭', '💤', '👋', '🤚', "🖐️", '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', "👁️", '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", '👩', "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", '🧓', '👴', '👵', '🙍', "🙍‍♂️", "🙍‍♀️", '🙎', "🙎‍♂️", "🙎‍♀️", '🙅', "🙅‍♂️", "🙅‍♀️", '🙆', "🙆‍♂️", "🙆‍♀️", '💁', "💁‍♂️", "💁‍♀️", '🙋', "🙋‍♂️", "🙋‍♀️", '🧏', "🧏‍♂️", "🧏‍♀️", '🙇', "🙇‍♂️", "🙇‍♀️", '🤦', "🤦‍♂️", "🤦‍♀️", '🤷', "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", '👨‍🏫', "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", '👮', "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", '💂', "💂‍♂️", "💂‍♀️", '🥷', '👷', "👷‍♂️", "👷‍♀️", '🤴', '👸', '👳', "👳‍♂️", "👳‍♀️", '👲', '🧕', '🤵', "🤵‍♂️", "🤵‍♀️", '👰', "👰‍♂️", "👰‍♀️", '🤰', '🤱', "👩‍🍼", "👨‍🍼", "🧑‍🍼", '👼', '🎅', '🤶', "🧑‍🎄", '🦸', "🦸‍♂️", "🦸‍♀️", '🦹', "🦹‍♂️", "🦹‍♀️", '🧙', "🧙‍♂️", "🧙‍♀️", '🧚', "🧚‍♂️", "🧚‍♀️", '🧛', "🧛‍♂️", "🧛‍♀️", '🧜', "🧜‍♂️", "🧜‍♀️", '🧝', "🧝‍♂️", "🧝‍♀️", '🧞', "🧞‍♂️", "🧞‍♀️", '🧟', "🧟‍♂️", "🧟‍♀️", '💆', "💆‍♂️", "💆‍♀️", '💇', "💇‍♂️", "💇‍♀️", '🚶', "🚶‍♂️", "🚶‍♀️", '🧍', "🧍‍♂️", "🧍‍♀️", '🧎', "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", '🏃', "🏃‍♂️", "🏃‍♀️", '💃', '🕺', "🕴️", '👯', "👯‍♂️", "👯‍♀️", '🧖', "🧖‍♂️", "🧖‍♀️", '🧗', "🧗‍♂️", "🧗‍♀️", '🤺', '🏇', '⛷️', '🏂', "🏌️", "🏌️‍♂️", "🏌️‍♀️", '🏄', "🏄‍♂️", "🏄‍♀️", '🚣', "🚣‍♂️", "🚣‍♀️", '🏊', "🏊‍♂️", "🏊‍♀️", '⛹️', "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", '🚴', "🚴‍♂️", '🚴‍♀️', '🚵', "🚵‍♂️", "🚵‍♀️", '🤸', "🤸‍♂️", "🤸‍♀️", '🤼', "🤼‍♂️", "🤼‍♀️", '🤽', "🤽‍♂️", "🤽‍♀️", '🤾', "🤾‍♂️", "🤾‍♀️", '🤹', "🤹‍♂️", "🤹‍♀️", '🧘', "🧘‍♂️", "🧘‍♀️", '🛀', '🛌', "🧑‍🤝‍🧑", '👭', '👫', '👬', '💏', "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", '💑', "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", '👪', "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", '👨‍👨‍👧', "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", '👤', '👥', '🫂', '👣', '🦰', '🦱', '🦳', '🦲', '🐵'];

        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)]; // 
        m.react(randomReaction);
    }
}
*/

//------------------ Owner react ---------------------//

        if (config.OWNER_REACT === "true") {
            if (senderNumber.includes(94774062300)) {
                if (isReact) return;
                m.react("🐉");
            }
        }
        

//------------------ Work tipe ---------------------//


        if (!isOwner && config.MODE === "private") return;
        if (!isOwner && isGroup && config.MODE === "inbox") return;
        if (!isOwner && !isGroup && config.MODE === "groups") return;

//------------------ Auto read cmd ---------------------//

if (isCmd && config.AUTO_READ_CMD === "true") {
    await conn.readMessages([mek.key]) 
}

//------------------ Auto tipping ---------------------//

if (isCmd && config.AUTO_TIPPING === "true") {
    await conn.sendPresenceUpdate('composing', from)
}

//------------------------------------------------------//

        const events = require('./command');
        const cmdName = isCmd ? body.slice(1).trim().split(" ")[0].toLowerCase() : false;

        if (isCmd) {
            const cmd = events.commands.find((cmd) => cmd.pattern === (cmdName)) || events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
            if (cmd) {
                if (cmd.react) conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
                try {
                    cmd.function(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply });
                } catch (e) {
                    console.error("[PLUGIN ERROR] " + e);
                }
            }
        }
             
        events.commands.map(async(command) => {
            if (body && command.on === "body") {
            command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
            } else if (mek.q && command.on === "text") {
            command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
            } else if (
            (command.on === "image" || command.on === "photo") &&
            mek.type === "imageMessage"
            ) {
            command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
            } else if (
            command.on === "sticker" &&
            mek.type === "stickerMessage"
            ) {
            command.function(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply})
            }});

    });
    
    conn.decodeJid = (jid) => {
        if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {};
            return decode.user && decode.server && decode.user + '@' + decode.server || jid;
        } else return jid;
    };

//------------------ Status save ---------------------//

  /*  
if(body === "send" || body === "Send" || body === "Seve" || body === "Ewpm" || body === "ewpn" || body === "Dapan" || body === "dapan" || body === "oni" || body === "Oni" || body === "save" || body === "Save" || body === "ewanna" || body === "Ewanna" || body === "ewam" || body === "Ewam" || body === "sv" || body === "Sv"|| body === "දාන්න"|| body === "එවම්න"){
    // if(!m.quoted) return reply("*Please Mention status*")
    const data = JSON.stringify(mek.message, null, 2);
    const jsonData = JSON.parse(data);
    const isStatus = jsonData.extendedTextMessage.contextInfo.remoteJid;
    if(!isStatus) return

    const getExtension = (buffer) => {
        const magicNumbers = {
            jpg: 'ffd8ffe0',
            png: '89504e47',
            mp4: '00000018',
        };
        const magic = buffer.toString('hex', 0, 4);
        return Object.keys(magicNumbers).find(key => magicNumbers[key] === magic);
    };

    if(m.quoted.type === 'imageMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.imageMessage.caption;
        await conn.sendMessage(from, { image: fs.readFileSync("./" + ext), caption: caption });
    } else if(m.quoted.type === 'videoMessage') {
        var nameJpg = getRandom('');
        let buff = await m.quoted.download(nameJpg);
        let ext = getExtension(buff);
        await fs.promises.writeFile("./" + ext, buff);
        const caption = m.quoted.videoMessage.caption;
        let buttonMessage = {
            video: fs.readFileSync("./" + ext),
            mimetype: "video/mp4",
            fileName: `${m.id}.mp4`,
            caption: "*ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ ᴡᴀ ʙᴏᴛ ʙʏ Qᴜᴇᴇɴ ɴᴇᴛʜᴜ ᴍᴅ*> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ - ɴᴇᴛʜᴜ ᴍᴀx ʏᴛ*" ,
            headerType: 4
        };
        await conn.sendMessage(from, buttonMessage,{
            quoted: mek
        });
    }
}
*/
    
//------------------ Welcome ---------------------//

    if (config.WELCOME === "true") {
        conn.ev.on('group-participants.update', async (anu) => {
            const metadata = await conn.groupMetadata(anu.id);
            const participants = anu.participants;
            for (let num of participants) {
                let ppuser;
                try {
                    ppuser = await conn.profilePictureUrl(num, 'image');
                } catch {
                    ppuser = 'https://pomf2.lain.la/f/hxp64475.jpg';
                }
    
                if (anu.action == 'add') {
                    conn.sendMessage(anu.id, { text: `Hi @${num.split("@")[0]}, Welcome to ${metadata.subject}\nFeel Free To Introduce Your Self To The Group\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʏʙᴇʀ ꜰʀᴏʟʏ*`, contextInfo: { mentionedJid: [num] } });
                } else if (anu.action == 'remove') {
                    conn.sendMessage(anu.id, { text: `Goodbye @${num.split("@")[0]}!\nSee You Next Time\n\n*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄʏʙᴇʀ ꜰʀᴏʟʏ*`, contextInfo: { mentionedJid: [num] } });
                }
            }
        });
    }
}

//---------------------------------------------------//

connectToWA(); 

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
