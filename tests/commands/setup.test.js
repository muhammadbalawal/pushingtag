'use strict';

jest.mock('fs');
jest.mock('child_process');

const fs = require('fs');
const { execFileSync } = require('child_process');

let setup;

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(false);
  fs.mkdirSync.mockImplementation(() => {});
  fs.copyFileSync.mockImplementation(() => {});
  fs.chmodSync.mockImplementation(() => {});
  fs.writeFileSync.mockImplementation(() => {});
  execFileSync.mockImplementation(() => {});
  setup = require('../../lib/commands/setup');
});

it('creates hook directory', () => {
  setup();
  expect(fs.mkdirSync).toHaveBeenCalledWith(
    expect.stringContaining('hooks'),
    { recursive: true }
  );
});

it('copies the post-push hook and makes it executable', () => {
  setup();
  expect(fs.copyFileSync).toHaveBeenCalled();
  expect(fs.chmodSync).toHaveBeenCalledWith(expect.stringContaining('post-push'), '755');
});

it('sets git global core.hooksPath', () => {
  setup();
  expect(execFileSync).toHaveBeenCalledWith(
    'git',
    expect.arrayContaining(['config', '--global', 'core.hooksPath'])
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
  fs.existsSync.mockImplementation((p) => p.includes('config.json'));
  setup();
  expect(fs.writeFileSync).not.toHaveBeenCalledWith(
    expect.stringContaining('config.json'),
    expect.anything()
  );
});
