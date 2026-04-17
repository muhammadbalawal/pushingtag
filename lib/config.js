'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.pushingtag');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

/**
 * Reads the config from disk, returning defaults if the file is missing or malformed.
 *
 * @returns {{ enabled: boolean }} The current config object.
 *
 * @example
 * const cfg = read(); // { enabled: true }
 */
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

/**
 * Writes the config to disk, creating the config directory if needed.
 *
 * @param {{ enabled: boolean }} data - The config object to persist.
 * @returns {void}
 *
 * @example
 * write({ enabled: false });
 */
function write(data) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
}

module.exports = { read, write, CONFIG_DIR, CONFIG_PATH };
