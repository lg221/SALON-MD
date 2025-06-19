const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || 'M6E3WTra#6FrX5bsnu7XVJwUcT7NouPV79msk5C2hV14jzuXugxs',
    MONGODB: process.env.MONGODB || 'mongodb+srv://udavin56:1234@cluster0.urhma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    AUTO_VOICE:"true",
    JID: process.env.JID || "120363417168743361@newsletter",
    FOOTER: 'ලස්සන සිංදු 💗🇱🇰',
};
