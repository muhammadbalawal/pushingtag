'use strict';

const config = require('../config');

/**
 * Enables pushingtag by setting `enabled: true` in the config.
 *
 * @returns {void}
 *
 * @example
 * on(); // config.enabled becomes true
 */
function on() {
  const cfg = config.read();
  config.write({ ...cfg, enabled: true });
  console.log('pushingtag enabled.');
}

module.exports = on;
