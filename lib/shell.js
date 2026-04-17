'use strict';

const path = require('path');
const os = require('os');

const MARKER_START = '# pushingtag-start';
const MARKER_END = '# pushingtag-end';

/**
 * Returns paths to all candidate shell rc files.
 *
 * @returns {string[]} Array of absolute paths to rc files.
 *
 * @example
 * getRcFiles(); // ['/Users/you/.zshrc', '/Users/you/.bashrc', '/Users/you/.bash_profile']
 */
function getRcFiles() {
  const home = os.homedir();
  return [
    path.join(home, '.zshrc'),
    path.join(home, '.bashrc'),
    path.join(home, '.bash_profile'),
  ];
}

module.exports = { MARKER_START, MARKER_END, getRcFiles };
