'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.pushingtag');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

function read() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return { enabled: true };
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return { enabled: true };
  }
}

function write(data) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write, CONFIG_DIR, CONFIG_PATH };
