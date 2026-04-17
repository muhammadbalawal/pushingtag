'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const sound = require('sound-play');

const AUDIO_PATH = path.join(os.homedir(), '.pushingtag', 'tag.mp3');

function play() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(AUDIO_PATH)) {
      return reject(new Error('No audio set. Run: pushingtag set <path-to-mp3>'));
    }
    sound.play(AUDIO_PATH).then(resolve).catch(reject);
  });
}

module.exports = { play, AUDIO_PATH };
