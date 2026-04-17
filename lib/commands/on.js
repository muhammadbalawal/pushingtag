'use strict';

const config = require('../config');

function on() {
  const cfg = config.read();
  config.write({ ...cfg, enabled: true });
  console.log('pushingtag enabled.');
}

module.exports = on;
