'use strict';

jest.mock('fs');
jest.mock('child_process');

let fs;
let execFileSync;
let setup;

beforeEach(() => {
  jest.resetModules();
  fs = require('fs');
  ({ execFileSync } = require('child_process'));
  fs.mkdirSync.mockImplementation(() => {});
  fs.existsSync.mockReturnValue(false);
  fs.writeFileSync.mockImplementation(() => {});
  fs.appendFileSync.mockImplementation(() => {});
  fs.readFileSync.mockReturnValue('');
  execFileSync.mockImplementation(() => Buffer.from('/usr/local/bin/pushingtag'));
  setup = require('../../lib/commands/setup');
});

it('creates config directory', () => {
  setup();
  expect(fs.mkdirSync).toHaveBeenCalledWith(
    expect.stringContaining('.pushingtag'),
    { recursive: true }
  );
});

it('writes default config.json if it does not exist', () => {
  setup();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    expect.stringContaining('config.json'),
    JSON.stringify({ enabled: true }, null, 2)
  );
});

it('does not overwrite config.json if it already exists', () => {
  fs.existsSync.mockImplementation(p => p.includes('config.json'));
  setup();
  expect(fs.writeFileSync).not.toHaveBeenCalledWith(
    expect.stringContaining('config.json'),
    expect.anything()
  );
});

it('appends shell wrapper to rc file', () => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('');
  setup();
  expect(fs.appendFileSync).toHaveBeenCalledWith(
    expect.stringMatching(/\.(zshrc|bashrc|bash_profile)/),
    expect.stringContaining('pushingtag-start')
  );
});

it('skips rc file if wrapper already installed', () => {
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('# pushingtag-start');
  setup();
  expect(fs.appendFileSync).not.toHaveBeenCalled();
});
