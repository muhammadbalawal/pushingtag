'use strict';

const fs = require('fs');
const config = require('../config');
const { AUDIO_PATH } = require('../audio');
const { MARKER_START, getRcFiles } = require('../shell');

/**
 * Prints the current enabled state, shell wrapper install locations, and audio status.
 *
 * @returns {void}
 *
 * @example
 * status();
 * // Enabled: true
 * // Shell wrapper: /Users/you/.zshrc
 * // Audio: set (/Users/you/.pushingtag/tag.mp3)
 */
function status() {
  const cfg = config.read();

  const installedIn = getRcFiles().filter(rc => {
    try { return fs.readFileSync(rc, 'utf8').includes(MARKER_START); } catch { return false; }
  });

  const audioExists = fs.existsSync(AUDIO_PATH);

  console.log(`Enabled: ${cfg.enabled}`);
  console.log(`Shell wrapper: ${installedIn.length ? installedIn.join(', ') : 'not installed'}`);
  console.log(`Audio: ${audioExists ? `set (${AUDIO_PATH})` : 'not set'}`);
}

module.exports = status;
