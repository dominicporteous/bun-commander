import { expect, it } from "bun:test";
import childProcess from 'node:child_process';
import path from 'node:path';
import util from 'node:util';

const execFileAsync = util.promisify(childProcess.execFile);

// Calling node explicitly so pm works without file suffix cross-platform.
// This file does end-to-end tests actually spawning program.
// See also command.executableSubcommand.search.test.js

// WIP: We do not support windows at the moment
const testOrSkipOnWindows = it;//const testOrSkipOnWindows = (process.platform === 'win32') ? test.skip : test;
const pm = path.join(__dirname, './fixtures/pm');

it('when subcommand file missing then error', () => {
  return execFileAsync('bun', [pm, 'list']).catch((err) => {
    /*
    // WIP: We do not support windows at the moment
    
    if (process.platform === 'win32') {
      // Get uncaught thrown error on Windows
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.stderr).toBeDefined();
      return
    }*/
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.message.includes('Executable not found')).toBe(true);
    //}
  });
});

it('when alias subcommand file missing then error', () => {
  return execFileAsync('bun', [pm, 'lst']).catch((err) => {
    /*
    // WIP: We do not support windows at the moment
    if (process.platform === 'win32') {
      // Get uncaught thrown error on Windows
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.stderr).toBeDefined();
      return
    }*/
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.message.includes('Executable not found')).toBe(true);
    //}
  });
});

it('when subcommand file has no suffix then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'install']);
  expect(res).toBe('install\n');
});

it('when alias subcommand file has no suffix then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'i']);
  expect(res).toBe('install\n');
});

it('when subcommand target executablefile has no suffix then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'specifyInstall']);
  expect(res).toBe('install\n');
});

it('when subcommand file suffix .js then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'publish']);
  expect(res).toBe('publish\n');
});

it('when alias subcommand file suffix .js then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'p']);
  expect(res).toBe('publish\n');
});

it('when subcommand target executablefile has suffix .js then lookup succeeds', async() => {
  const res = await execFileAsync('bun', [pm, 'specifyPublish']);
  expect(res).toBe('publish\n');
});

testOrSkipOnWindows('when subcommand file is symlink then lookup succeeds', async() => {
  const pmlink = path.join(__dirname, 'fixtures', 'pmlink');
  const res = await execFileAsync('bun', [pmlink, 'install']);
  expect(res).toBe('install\n');
});

testOrSkipOnWindows('when subcommand file is double symlink then lookup succeeds', async() => {
  const pmlink = path.join(__dirname, 'fixtures', 'another-dir', 'pm');
  const res = await execFileAsync('bun', [pmlink, 'install']);
  expect(res).toBe('install\n');
});

it('when subcommand suffix is .ts then lookup succeeds', async() => {
  // We support looking for ts files for ts-node in particular, but don't need to test ts-node itself.
  // The subcommand is both plain JavaScript code for this test.
  const binLinkTs = path.join(__dirname, 'fixtures-extensions', 'pm.js');
  // childProcess.execFile('node', ['-r', 'ts-node/register', binLinkTs, 'install'], function(_error, stdout, stderr) {
  const res = await execFileAsync('bun', [binLinkTs, 'try-ts']);
  expect(res).toBe('found .ts\n');
});

it('when subcommand suffix is .cjs then lookup succeeds', async() => {
  const binLinkTs = path.join(__dirname, 'fixtures-extensions', 'pm.js');
  const res = await execFileAsync('bun', [binLinkTs, 'try-cjs']);
  expect(res).toBe('found .cjs\n');
});

it('when subcommand suffix is .mjs then lookup succeeds', async() => {
  const binLinkTs = path.join(__dirname, 'fixtures-extensions', 'pm.js');
  const res = await execFileAsync('bun', [binLinkTs, 'try-mjs']);
  expect(res).toBe('found .mjs\n');
});

it('when subsubcommand then lookup sub-sub-command', async() => {
  const res = await execFileAsync('bun', [pm, 'cache', 'clear']);
  expect(res).toBe('cache-clear\n');
});
