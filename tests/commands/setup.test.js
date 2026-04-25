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

describe('powershell wrapper', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../../lib/shell', () => {
      const actual = jest.requireActual('../../lib/shell');
      return {
        ...actual,
        getShellTargets: () => [
          { path: '/fake/profile.ps1', type: 'powershell' },
        ],
      };
    });
    fs = require('fs');
    ({ execFileSync } = require('child_process'));
    fs.mkdirSync.mockImplementation(() => {});
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});
    fs.appendFileSync.mockImplementation(() => {});
    fs.readFileSync.mockReturnValue('');
    execFileSync.mockImplementation(() => 'C:\\path\\pushingtag.cmd');
    setup = require('../../lib/commands/setup');
  });

  it('creates the powershell profile file if it does not exist', () => {
    setup();
    expect(fs.writeFileSync).toHaveBeenCalledWith('/fake/profile.ps1', '');
  });

  it('appends a powershell-syntax wrapper', () => {
    setup();
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      '/fake/profile.ps1',
      expect.stringContaining('function global:git')
    );
  });

  it('embeds the resolved pushingtag binary path in the wrapper', () => {
    setup();
    const appended = fs.appendFileSync.mock.calls[0][1];
    expect(appended).toContain('C:\\path\\pushingtag.cmd');
  });
});
