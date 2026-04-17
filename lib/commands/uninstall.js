'use strict';

const fs = require('fs');
const { MARKER_START, MARKER_END, getRcFiles } = require('../shell');

/**
 * Strips the pushingtag shell wrapper block from an rc file's contents.
 *
 * @param {string} contents - The full text of the rc file.
 * @returns {string} The file contents with the wrapper block removed.
 *
 * @example
 * const cleaned = removeBlock('before\n# pushingtag-start\n...\n# pushingtag-end\nafter');
 */
function removeBlock(contents) {
  const start = contents.indexOf('\n' + MARKER_START);
  const end = contents.indexOf(MARKER_END);
  if (start === -1 || end === -1) return contents;
  return contents.slice(0, start) + contents.slice(end + MARKER_END.length + 1);
}

/**
 * Removes the pushingtag shell wrapper from all rc files.
 * Skips files that do not exist or do not contain the wrapper.
 *
 * @returns {void}
 *
 * @example
 * uninstall(); // removes wrapper from ~/.zshrc, ~/.bashrc, ~/.bash_profile
 */
function uninstall() {
  for (const rc of getRcFiles()) {
    if (!fs.existsSync(rc)) continue;
    const contents = fs.readFileSync(rc, 'utf8');
    if (!contents.includes(MARKER_START)) continue;
    fs.writeFileSync(rc, removeBlock(contents));
    console.log(`Removed shell wrapper from ${rc}.`);
  }

  console.log('pushingtag uninstalled.');
}

module.exports = uninstall;
