'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const AUDIO_DEST = path.join(os.homedir(), '.pushingtag', 'tag.mp3');

function set(audioPath) {
  const resolved = path.resolve(audioPath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  if (path.extname(resolved).toLowerCase() !== '.mp3') {
    throw new Error('Only .mp3 files are supported.');
  }

  fs.copyFileSync(resolved, AUDIO_DEST);
  console.log(`Producer tag set: ${AUDIO_DEST}`);
}

module.exports = set;
