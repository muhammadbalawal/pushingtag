'use strict';

jest.mock('../../lib/config');
jest.mock('../../lib/audio');

const config = require('../../lib/config');
const audio = require('../../lib/audio');

let play;

beforeEach(() => {
  jest.clearAllMocks();
  play = require('../../lib/commands/play');
});

it('calls audio.play when enabled is true', async () => {
  config.read.mockReturnValue({ enabled: true });
  audio.play.mockResolvedValue();

  await play();

  expect(audio.play).toHaveBeenCalled();
});

it('does not call audio.play when enabled is false', async () => {
  config.read.mockReturnValue({ enabled: false });

  await play();

  expect(audio.play).not.toHaveBeenCalled();
});

it('prints helpful message when audio.play throws missing audio error', async () => {
  config.read.mockReturnValue({ enabled: true });
  audio.play.mockRejectedValue(new Error('No audio set. Run: pushingtag set <path-to-mp3>'));

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  await play();

  expect(consoleSpy).toHaveBeenCalledWith('No audio set. Run: pushingtag set <path-to-mp3>');
  consoleSpy.mockRestore();
});
