'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const HOOKS_DIR = path.join(os.homedir(), '.pushingtag', 'hooks');
const HOOK_DEST = path.join(HOOKS_DIR, 'pre-push');
const HOOK_SRC = path.join(__dirname, '..', '..', 'hook', 'pre-push');
const CONFIG_PATH = path.join(os.homedir(), '.pushingtag', 'config.json');

function setup() {
  fs.mkdirSync(HOOKS_DIR, { recursive: true });

  if (fs.existsSync(HOOK_DEST)) {
    console.log('Hook already exists — overwriting.');
  }

  let pushingtagBin;
  try {
    pushingtagBin = execFileSync('which', ['pushingtag']).toString().trim();
  } catch {
    pushingtagBin = 'pushingtag';
  }

  fs.writeFileSync(HOOK_DEST, `#!/bin/sh\n"${pushingtagBin}" play\n`);
  fs.chmodSync(HOOK_DEST, '755');

  execFileSync('git', ['config', '--global', 'core.hooksPath', HOOKS_DIR]);

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
  }

  if (process.platform === 'linux') {
    try {
      execFileSync('which', ['mpg123'], { stdio: 'ignore' });
    } catch {
      console.warn('Warning: mpg123 not found. Install it with: sudo apt install mpg123');
    }
  }

  console.log('pushingtag is set up. Run: pushingtag set <path-to-mp3>');
}

module.exports = setup;
