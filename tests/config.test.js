'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

jest.mock('fs');

const CONFIG_DIR = path.join(os.homedir(), '.pushingtag');
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');

let config;

beforeEach(() => {
  jest.clearAllMocks();
  config = require('../lib/config');
});

describe('config.read', () => {
  it('returns default config when file does not exist', () => {
    fs.existsSync.mockReturnValue(false);
    expect(config.read()).toEqual({ enabled: true });
  });

  it('returns parsed config when file exists', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(JSON.stringify({ enabled: false }));
    expect(config.read()).toEqual({ enabled: false });
  });
});

describe('config.write', () => {
  it('creates directory if missing and writes config', () => {
    fs.existsSync.mockReturnValue(false);
    fs.mkdirSync.mockImplementation(() => {});
    fs.writeFileSync.mockImplementation(() => {});

    config.write({ enabled: true });

    expect(fs.mkdirSync).toHaveBeenCalledWith(CONFIG_DIR, { recursive: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CONFIG_PATH,
      JSON.stringify({ enabled: true }, null, 2)
    );
  });

  it('does not call mkdirSync if directory already exists', () => {
    fs.existsSync.mockReturnValue(true);
    fs.writeFileSync.mockImplementation(() => {});

    config.write({ enabled: false });

    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      CONFIG_PATH,
      JSON.stringify({ enabled: false }, null, 2)
    );
  });
});
