const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'JgZxBa5B#zdzB0Ul5p2ltQ47ACHKpG3a4o7vdCvImv2h_t9j712s',
    MONGODB: process.env.MONGODB || 'mongodb+srv://udavin56:1234@cluster0.urhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    AUTO_VOICE:"true",
    MODE: process.env.MODE || "private",
    JID: process.env.JID || "120363417168743361@newsletter",
    FOOTER: 'ලස්සන සිංදු 💗🇱🇰',

};
