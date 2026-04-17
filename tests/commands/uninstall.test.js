'use strict';

jest.mock('fs');
jest.mock('child_process');

const fs = require('fs');
const { execFileSync } = require('child_process');

let uninstall;

beforeEach(() => {
  jest.clearAllMocks();
  fs.existsSync.mockReturnValue(true);
  fs.unlinkSync.mockImplementation(() => {});
  execFileSync.mockImplementation(() => {});
  uninstall = require('../../lib/commands/uninstall');
});

it('removes the post-push hook file', () => {
  uninstall();
  expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('post-push'));
});

it('unsets git global core.hooksPath', () => {
  uninstall();
  expect(execFileSync).toHaveBeenCalledWith(
    'git',
    ['config', '--global', '--unset', 'core.hooksPath'],
    expect.anything()
  );
});

it('does not throw if hook file is already missing', () => {
  fs.existsSync.mockReturnValue(false);
  expect(() => uninstall()).not.toThrow();
});
