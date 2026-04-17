'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const player = require('play-sound')();

const AUDIO_PATH = path.join(os.homedir(), '.pushingtag', 'tag.mp3');

/**
 * Plays the producer tag audio file.
 * Rejects with a user-friendly message if no audio has been set yet.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await play(); // plays ~/.pushingtag/tag.mp3
 */
function play() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(AUDIO_PATH)) {
      return reject(new Error('No audio set. Run: pushingtag set <path-to-mp3>'));
    }
    player.play(AUDIO_PATH, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { play, AUDIO_PATH };
