'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const HOOKS_DIR = path.join(os.homedir(), '.pushingtag', 'hooks');
const HOOK_DEST = path.join(HOOKS_DIR, 'post-push');
const HOOK_SRC = path.join(__dirname, '..', '..', 'hook', 'post-push');
const CONFIG_PATH = path.join(os.homedir(), '.pushingtag', 'config.json');

function setup() {
  fs.mkdirSync(HOOKS_DIR, { recursive: true });

  if (fs.existsSync(HOOK_DEST)) {
    console.log('Hook already exists — overwriting.');
  }

  fs.copyFileSync(HOOK_SRC, HOOK_DEST);
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
