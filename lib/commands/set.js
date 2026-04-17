'use strict';

const fs = require('fs');
const path = require('path');
const { AUDIO_PATH } = require('../audio');

/**
 * Copies an mp3 file to the pushingtag audio path.
 * Throws if the file does not exist or is not an mp3.
 *
 * @param {string} audioPath - Path to the source mp3 file.
 * @returns {void}
 *
 * @example
 * set('./my-tag.mp3'); // copies to ~/.pushingtag/tag.mp3
 */
function set(audioPath) {
  const resolved = path.resolve(audioPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  if (path.extname(resolved).toLowerCase() !== '.mp3') {
    throw new Error('Only .mp3 files are supported.');
  }

  fs.copyFileSync(resolved, AUDIO_PATH);
  console.log(`Producer tag set: ${AUDIO_PATH}`);
}

module.exports = set;
