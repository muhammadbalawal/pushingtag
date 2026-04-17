'use strict';

const config = require('../config');
const audio = require('../audio');

async function play() {
  const cfg = config.read();
  if (!cfg.enabled) return;

  try {
    await audio.play();
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = play;
