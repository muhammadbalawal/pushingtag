'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const CONFIG_DIR = path.join(os.homedir(), '.pushingtag');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
const MARKER_START = '# pushingtag-start';
const MARKER_END = '# pushingtag-end';

function getRcFiles() {
  const home = os.homedir();
  const shell = process.env.SHELL || '';
  if (shell.includes('zsh')) return [path.join(home, '.zshrc')];
  if (shell.includes('bash')) return [path.join(home, '.bashrc'), path.join(home, '.bash_profile')];
  return [path.join(home, '.zshrc'), path.join(home, '.bashrc')];
}

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

function setup() {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify({ enabled: true }, null, 2));
  }

  let pushingtagBin;
  try {
    pushingtagBin = execFileSync('which', ['pushingtag']).toString().trim();
  } catch {
    pushingtagBin = 'pushingtag';
  }

  const fn = buildShellFunction(pushingtagBin);
  const rcFiles = getRcFiles();

  for (const rc of rcFiles) {
    if (!fs.existsSync(rc)) continue;
    const contents = fs.readFileSync(rc, 'utf8');
    if (contents.includes(MARKER_START)) {
      console.log(`Already installed in ${rc} — skipping.`);
      continue;
    }
    fs.appendFileSync(rc, fn + '\n');
    console.log(`Installed shell wrapper in ${rc}.`);
  }

  try {
    const hooksPath = execFileSync('git', ['config', '--global', 'core.hooksPath'], { encoding: 'utf8' }).trim();
    if (hooksPath.includes('.pushingtag')) {
      execFileSync('git', ['config', '--global', '--unset', 'core.hooksPath'], { stdio: 'ignore' });
    }
  } catch {}

  console.log('Done. Restart your shell or run: source ~/.zshrc');
}

module.exports = setup;
