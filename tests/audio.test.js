'use strict';

jest.mock('sound-play', () => ({
  play: jest.fn(() => Promise.resolve())
}));

jest.mock('fs');

let audio;
let fs;

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  fs = require('fs');
  audio = require('../lib/audio');
});

describe('audio.play', () => {
  it('calls play-sound with the tag path when file exists', async () => {
    fs.existsSync.mockReturnValue(true);
    await expect(audio.play()).resolves.toBeUndefined();
  });

  it('throws with helpful message when tag.mp3 does not exist', async () => {
    fs.existsSync.mockReturnValue(false);
    await expect(audio.play()).rejects.toThrow(
      'No audio set. Run: pushingtag set <path-to-mp3>'
    );
  });
});
