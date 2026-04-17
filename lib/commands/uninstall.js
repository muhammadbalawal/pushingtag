'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const MARKER_START = '# pushingtag-start';
const MARKER_END = '# pushingtag-end';

function getRcFiles() {
  const home = os.homedir();
  return [
    path.join(home, '.zshrc'),
    path.join(home, '.bashrc'),
    path.join(home, '.bash_profile'),
  ];
}

function removeBlock(contents) {
  const start = contents.indexOf('\n' + MARKER_START);
  const end = contents.indexOf(MARKER_END);
  if (start === -1 || end === -1) return contents;
  return contents.slice(0, start) + contents.slice(end + MARKER_END.length);
}

function uninstall() {
  for (const rc of getRcFiles()) {
    if (!fs.existsSync(rc)) continue;
    const contents = fs.readFileSync(rc, 'utf8');
    if (!contents.includes(MARKER_START)) continue;
    fs.writeFileSync(rc, removeBlock(contents));
    console.log(`Removed shell wrapper from ${rc}.`);
  }

  try {
    const hooksPath = execFileSync('git', ['config', '--global', 'core.hooksPath'], { encoding: 'utf8' }).trim();
    if (hooksPath.includes('.pushingtag')) {
      execFileSync('git', ['config', '--global', '--unset', 'core.hooksPath'], { stdio: 'ignore' });
    }
  } catch {}

  console.log('pushingtag uninstalled.');
}

module.exports = uninstall;
