'use strict';

const path = require('path');
const os = require('os');

const MARKER_START = '# pushingtag-start';
const MARKER_END = '# pushingtag-end';

/**
 * Returns all shell profile targets pushingtag knows how to install into.
 * Each target has a path and a shell `type` ('bash' or 'powershell') so the
 * setup command can pick the right wrapper syntax.
 *
 * @returns {Array<{path: string, type: 'bash'|'powershell'}>}
 */
function getShellTargets() {
  const home = os.homedir();
  const targets = [
    { path: path.join(home, '.zshrc'), type: 'bash' },
    { path: path.join(home, '.bashrc'), type: 'bash' },
    { path: path.join(home, '.bash_profile'), type: 'bash' },
  ];

  if (process.platform === 'win32') {
    targets.push(
      { path: path.join(home, 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1'), type: 'powershell' },
      { path: path.join(home, 'Documents', 'PowerShell', 'Microsoft.PowerShell_profile.ps1'), type: 'powershell' }
    );
  }

  return targets;
}

/**
 * Backwards-compatible accessor returning just the paths.
 * @returns {string[]}
 */
function getRcFiles() {
  return getShellTargets().map(t => t.path);
}

module.exports = { MARKER_START, MARKER_END, getRcFiles, getShellTargets };
