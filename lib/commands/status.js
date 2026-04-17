'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const config = require('../config');

const AUDIO_PATH = path.join(os.homedir(), '.pushingtag', 'tag.mp3');

function status() {
  const cfg = config.read();

  let hooksPath = 'not set';
  try {
    hooksPath = execFileSync('git', ['config', '--global', 'core.hooksPath'], { encoding: 'utf8' }).trim();
  } catch {
    hooksPath = 'not set';
  }

  const audioExists = fs.existsSync(AUDIO_PATH);

  console.log(`Enabled: ${cfg.enabled}`);
  console.log(`Hook path: ${hooksPath}`);
  console.log(`Audio: ${audioExists ? `set (${AUDIO_PATH})` : 'not set'}`);
}

module.exports = status;
