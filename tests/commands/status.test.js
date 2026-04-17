'use strict';

jest.mock('../../lib/config');
jest.mock('fs');
jest.mock('child_process');

const config = require('../../lib/config');
const fs = require('fs');
const { execFileSync } = require('child_process');

let status;
let consoleSpy;

beforeEach(() => {
  jest.clearAllMocks();
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  status = require('../../lib/commands/status');
});

afterEach(() => consoleSpy.mockRestore());

it('prints enabled state', () => {
  config.read.mockReturnValue({ enabled: true });
  fs.existsSync.mockReturnValue(true);
  execFileSync.mockReturnValue('/home/user/.pushingtag/hooks\n');

  status();

  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Enabled: true'));
});

it('prints audio set when tag.mp3 exists', () => {
  config.read.mockReturnValue({ enabled: true });
  fs.existsSync.mockReturnValue(true);
  execFileSync.mockReturnValue('/home/user/.pushingtag/hooks\n');

  status();

  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Audio: set'));
});

it('prints audio not set when tag.mp3 is missing', () => {
  config.read.mockReturnValue({ enabled: true });
  fs.existsSync.mockReturnValue(false);
  execFileSync.mockImplementation(() => { throw new Error(); });

  status();

  expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Audio: not set'));
});
