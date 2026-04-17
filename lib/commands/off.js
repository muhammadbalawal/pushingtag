'use strict';

const config = require('../config');

/**
 * Disables pushingtag by setting `enabled: false` in the config.
 *
 * @returns {void}
 *
 * @example
 * off(); // config.enabled becomes false
 */
function off() {
  const cfg = config.read();
  config.write({ ...cfg, enabled: false });
  console.log('pushingtag disabled.');
}

module.exports = off;
