'use strict';

const config = require('../config');
const audio = require('../audio');

/**
 * Plays the producer tag if pushingtag is enabled.
 * Silently no-ops if disabled; logs the error message if audio fails.
 *
 * @returns {Promise<void>}
 *
 * @example
 * await play(); // plays tag.mp3 if enabled
 */
async function play() {
  const cfg = config.read();
  if (!cfg.enabled) return;

  try {
    await audio.play();
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = play;
