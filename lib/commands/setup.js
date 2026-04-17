'use strict';

const fs = require('fs');
const { execFileSync } = require('child_process');
const { CONFIG_DIR, CONFIG_PATH } = require('../config');
const { MARKER_START, MARKER_END, getRcFiles } = require('../shell');

/**
 * Returns the shell function snippet to inject into an rc file.
 *
 * @param {string} pushingtagBin - Absolute path (or fallback name) of the pushingtag binary.
 * @returns {string} The shell function block wrapped in marker comments.
 *
 * @example
 * const snippet = buildShellFunction('/usr/local/bin/pushingtag');
 */
function buildShellFunction(pushingtagBin) {
  return `
${MARKER_START}
function git() {
  command git "$@"
  local code=$?
  if [ "$1" = "push" ] && [ $code -eq 0 ]; then
    "${pushingtagBin}" play &
  fi
  return $code
}
${MARKER_END}`;
}

/**
 * Installs the shell wrapper into rc files and writes a default config.
 * Skips rc files that already contain the wrapper or do not exist.
 *
 * @returns {void}
 *
 * @example
 * setup(); // writes to ~/.zshrc and creates ~/.pushingtag/config.json
 */
function setup() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
  }

  let pushingtagBin;
  try {
    pushingtagBin = execFileSync('which', ['pushingtag'], { encoding: 'utf8' }).trim();
  } catch {
    pushingtagBin = 'pushingtag';
  }

  const fn = buildShellFunction(pushingtagBin);
  const installed = [];

  for (const rc of getRcFiles()) {
    if (!fs.existsSync(rc)) continue;
    const contents = fs.readFileSync(rc, 'utf8');
    if (contents.includes(MARKER_START)) {
      console.log(`Already installed in ${rc} — skipping.`);
      continue;
    }
    fs.appendFileSync(rc, fn + '\n');
    console.log(`Installed shell wrapper in ${rc}.`);
    installed.push(rc);
  }

  if (installed.length) {
    console.log(`Done. Restart your shell or run: source ${installed[0]}`);
  } else {
    console.log('Done.');
  }
}

module.exports = setup;
