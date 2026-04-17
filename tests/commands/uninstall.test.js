'use strict';

jest.mock('fs');
jest.mock('child_process');

let fs;
let execFileSync;
let uninstall;

beforeEach(() => {
  jest.resetModules();
  fs = require('fs');
  ({ execFileSync } = require('child_process'));
  fs.existsSync.mockReturnValue(true);
  fs.readFileSync.mockReturnValue('before\n# pushingtag-start\nfunction git() {}\n# pushingtag-end\nafter');
  fs.writeFileSync.mockImplementation(() => {});
  execFileSync.mockImplementation(() => Buffer.from(''));
  uninstall = require('../../lib/commands/uninstall');
});

it('removes the shell wrapper block from rc file', () => {
  uninstall();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    expect.stringMatching(/\.(zshrc|bashrc|bash_profile)/),
    expect.not.stringContaining('pushingtag-start')
  );
});

it('does not touch rc file if wrapper is not installed', () => {
  fs.readFileSync.mockReturnValue('some other content');
  uninstall();
  expect(fs.writeFileSync).not.toHaveBeenCalled();
});

it('does not throw if rc file does not exist', () => {
  fs.existsSync.mockReturnValue(false);
  expect(() => uninstall()).not.toThrow();
});
