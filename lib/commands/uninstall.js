'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const HOOK_PATH = path.join(os.homedir(), '.pushingtag', 'hooks', 'post-push');

function uninstall() {
  if (fs.existsSync(HOOK_PATH)) {
    fs.unlinkSync(HOOK_PATH);
  }

  try {
    execFileSync('git', ['config', '--global', '--unset', 'core.hooksPath'], { stdio: 'ignore' });
  } catch {
    // already unset
  }

  console.log('pushingtag uninstalled.');
}

module.exports = uninstall;
