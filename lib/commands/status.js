'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config');

const AUDIO_PATH = path.join(os.homedir(), '.pushingtag', 'tag.mp3');
const MARKER_START = '# pushingtag-start';

function getRcFiles() {
  const home = os.homedir();
  return [
    path.join(home, '.zshrc'),
    path.join(home, '.bashrc'),
    path.join(home, '.bash_profile'),
  ];
}

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
