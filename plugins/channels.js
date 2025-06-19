const config = require("../config");
const {
  cmd
} = require('../command');
const yts = require("yt-search");
const ddownr = require("denethdev-ytmp3");
cmd({
  'pattern': 'voice',
  'desc': "Download songs.",
  'category': "download",
  'react': '🎧',
  'filename': __filename
}, async (_0x5d43b6, _0x3cc49e, _0x1d1f8a, {
  from: _0x188841,
  reply: _0x44b212,
  q: _0x2d2b4c
}) => {
  try {
    if (!_0x2d2b4c) {
      return _0x44b212("*Please Provide A Song Name or Url 🙄*");
    }
    const _0xc1e867 = await yts(_0x2d2b4c);
    if (!_0xc1e867 || _0xc1e867.videos.length === 0x0) {
      return _0x44b212("*No Song Found Matching Your Query 🧐*");
    }
    const _0x3c9620 = _0xc1e867.videos[0x0];
    const _0x54b6a5 = _0x3c9620.url;
    const _0x149cfa = await ddownr.download(_0x54b6a5, "mp3");
    const _0x31976b = _0x149cfa.downloadUrl;
    let _0x25cf84 = " *☘️ 𝐓𝐈𝐓𝐋𝐄  -  " + _0x163fa7.title*  + "\n\n*▫️ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽 - " + _0x163fa7.timestamp* + "\n*▫️ 𝚄𝙿𝙻𝙾𝙰𝙳𝙴𝚁 -  " + _0x163fa7.author.name* + "\n*▫️ 𝚅𝙸𝙴𝚆𝚂 -  " + _0x163fa7.views* + "\n\n\n" + config.FOOTER;
    await _0x5d43b6.sendMessage(_0x188841, {
      'image': {
        'url': _0x3c9620.thumbnail
      },
      'caption': _0x25cf84
    }, {
      'quoted': _0x1d1f8a
    });
    await _0x5d43b6.sendMessage(_0x188841, {
      'audio': {
        'url': _0x31976b
      },
      'mimetype': "audio/mpeg",
      'ptt': true
    }, {
      'quoted': _0x1d1f8a
    });
  } catch (_0x14234f) {
    console.error(_0x14234f);
    _0x44b212("*An Error Occurred While Processing Your Request 😔*");
  }
});
cmd({
  'pattern': "sv",
  'desc': "Download songs.",
  'category': "download",
  'react': '🎧',
  'filename': __filename
}, async (_0x480897, _0x1cff7a, _0x4ce7c4, {
  from: _0x59fca6,
  reply: _0x112d96,
  q: _0x1fc7ff
}) => {
  try {
    if (!_0x1fc7ff) {
      return _0x112d96("*Please Provide A Song Name or Url 🙄*");
    }
    const _0x58515c = await yts(_0x1fc7ff);
    if (!_0x58515c || _0x58515c.videos.length === 0x0) {
      return _0x112d96("*No Song Found Matching Your Query 🧐*");
    }
    const _0x163fa7 = _0x58515c.videos[0x0];
    const _0x11ed5e = _0x163fa7.url;
    const _0x5cfd86 = await ddownr.download(_0x11ed5e, "mp3");
    const _0x192bee = _0x5cfd86.downloadUrl;
    let _0x22605e =  " *💚 𝐓𝐈𝐓𝐋𝐄 💚* -  " + *_0x163fa7.title* + "\n\n*▫️ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽* - " + *_0x163fa7.timestamp* + "\n*▫️ 𝚄𝙿𝙻𝙾𝙰𝙳𝙴𝚁* -  " + *_0x163fa7.author.name* + "\n*▫️ 𝚅𝙸𝙴𝚆𝚂* -  " + *_0x163fa7.views* + "\n\n\n" + config.FOOTER;
    await _0x480897.sendMessage(config.JID, {
      'image': {
        'url': _0x163fa7.thumbnail
      },
      'caption': _0x22605e
    }, {
      'quoted': _0x4ce7c4
    });
    await _0x480897.sendMessage(config.JID, {
      'audio': {
        'url': _0x192bee
      },
      'mimetype': "audio/mpeg",
      'ptt': true
    }, {
      'quoted': _0x4ce7c4
    });
  } catch (_0x5a6ae3) {
    console.error(_0x5a6ae3);
    _0x112d96("*An Error Occurred While Processing Your Request 😔*");
  }
});
