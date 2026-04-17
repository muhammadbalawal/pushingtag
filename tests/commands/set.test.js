'use strict';

jest.mock('fs');
const fs = require('fs');

let set;

beforeEach(() => {
  jest.clearAllMocks();
  set = require('../../lib/commands/set');
});

it('copies the mp3 to ~/.pushingtag/tag.mp3', () => {
  fs.existsSync.mockReturnValue(true);
  fs.copyFileSync.mockImplementation(() => {});

  set('/some/path/beat.mp3');

  expect(fs.copyFileSync).toHaveBeenCalledWith(
    '/some/path/beat.mp3',
    expect.stringContaining('tag.mp3')
  );
});

it('throws if source file does not exist', () => {
  fs.existsSync.mockReturnValue(false);

  expect(() => set('/missing/beat.mp3')).toThrow('File not found: /missing/beat.mp3');
});

it('throws if file is not an mp3', () => {
  fs.existsSync.mockReturnValue(true);

  expect(() => set('/some/beat.wav')).toThrow('Only .mp3 files are supported.');
});
