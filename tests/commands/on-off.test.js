'use strict';

jest.mock('../../lib/config');
const config = require('../../lib/config');

beforeEach(() => {
  jest.clearAllMocks();
  config.read.mockReturnValue({ enabled: false });
  config.write.mockImplementation(() => {});
});

describe('on', () => {
  it('sets enabled to true', () => {
    const on = require('../../lib/commands/on');
    on();
    expect(config.write).toHaveBeenCalledWith({ enabled: true });
  });
});

describe('off', () => {
  it('sets enabled to false', () => {
    config.read.mockReturnValue({ enabled: true });
    const off = require('../../lib/commands/off');
    off();
    expect(config.write).toHaveBeenCalledWith({ enabled: false });
  });
});
