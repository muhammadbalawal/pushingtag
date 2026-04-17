#!/usr/bin/env node
'use strict';

const { program } = require('commander');

const setup = require('../lib/commands/setup');
const set = require('../lib/commands/set');
const play = require('../lib/commands/play');
const on = require('../lib/commands/on');
const off = require('../lib/commands/off');
const status = require('../lib/commands/status');
const uninstall = require('../lib/commands/uninstall');

program
  .name('pushingtag')
  .description('Play your producer tag on every git push')
  .version('1.0.0');

program
  .command('setup')
  .description('Set up the global git hook')
  .action(setup);

program
  .command('set <audioPath>')
  .description('Set your producer tag MP3')
  .action(set);

program
  .command('play')
  .description('Play your producer tag now')
  .action(play);

program
  .command('on')
  .description('Enable the producer tag')
  .action(on);

program
  .command('off')
  .description('Disable the producer tag')
  .action(off);

program
  .command('status')
  .description('Show current status')
  .action(status);

program
  .command('uninstall')
  .description('Remove the global git hook')
  .action(uninstall);

program.parse(process.argv);
