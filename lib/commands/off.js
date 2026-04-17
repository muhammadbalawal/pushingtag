'use strict';

const config = require('../config');

function off() {
  const cfg = config.read();
  config.write({ ...cfg, enabled: false });
  console.log('pushingtag disabled.');
}

module.exports = off;
