import { it, describe, expect, beforeEach, afterAll, afterEach } from 'bun:test'
import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sinon from 'sinon';
import commander from '../';

const skip = () => {}

// This file does in-process mocking. Bit clumsy but faster and less external clutter than using fixtures.
// See also command.executableSubcommand.lookup.test.js for tests using fixtures.

const gLocalDirectory = path.resolve(__dirname, 'fixtures'); // Real directory, although not actually searching for files in it.

function extractMockSpawnArgs(mock) {
  expect(mock.called).toBe(true);
  // non-Win, launchWithNode: childProcess.spawn(process.argv[0], args, { stdio: 'inherit' });
  // Win always: childProcess.spawn(process.execPath, args, { stdio: 'inherit' });
  return mock.lastCall.args[1];
}

function extractMockSpawnCommand(mock) {
  expect(mock.called).toBe(true);
  // child_process.spawn(command[, args][, options])
  return mock.lastCall.args[0];
}

const describeOrSkipOnWindows = (process.platform === 'win32') ? skip : describe;

describe('search for subcommand', () => {
  const spawnSpy = sinon.stub(childProcess, 'spawn').callsFake(() => {
    return {
      on: () => {},
      killed: true
    };
  });
  const existsSpy = sinon.stub(fs, 'existsSync');

  afterEach(() => {
    spawnSpy.resetHistory();
    existsSpy.resetHistory();
  });

  afterAll(() => {
    existsSpy.restore();
    spawnSpy.restore();
  });

  describe('whether perform search for local files', () => {
    beforeEach(() => {
      existsSpy.callsFake(() => false);
    });

    it('when no script arg or executableDir then no search for local file', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy.called).toBe(false);
    });

    it('when script arg then search for local files', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      expect(existsSpy.called).toBe(true);
    });

    it('when executableDir then search for local files)', () => {
      const program = new commander.Command();
      program.name('pm');
      program.executableDir(__dirname);
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(existsSpy.called).toBe(true);
    });
  });

  // We always use node on Windows, and don't spawn executable as the command (which may be a feature or a shortcoming!?).
  describeOrSkipOnWindows('subcommand command name with no matching local file (non-Windows)', () => {
    beforeEach(() => {
      existsSpy.callsFake(() => false);
    });

    it('when named pm and no script arg or executableDir then spawn pm-sub as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['sub'], { from: 'user' });

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
    });

    it('when named pm and script arg then still spawn pm-sub as command', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');
      program.parse(['node', 'script-name', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('pm-sub');
    });

    it('when no name and script arg then spawn script-sub as command', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');
      program.parse(['node', 'script.js', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('script-sub');
    });

    it('when named pm and script arg and executableFile then spawn executableFile as command', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description', { executableFile: 'myExecutable' });
      program.parse(['node', 'script.js', 'sub']);

      expect(extractMockSpawnCommand(spawnSpy)).toEqual('myExecutable');
    });
  });

  describe('subcommand command name with matching local file', () => {
    it('when construct with name pm and script arg then spawn local pm-sub.js', () => {
      const program = new commander.Command('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when name pm and script arg then spawn local pm-sub.js', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'pm-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when script arg then spawn local script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when name pm and script arg and only script-sub.js then fallback to spawn local script-sub.js', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      // Fallback for compatibility with Commander <= v8
      const localPath = path.resolve(gLocalDirectory, 'script-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when name pm and executableDir then spawn local pm-sub.js', () => {
      const program = new commander.Command();
      program.name('pm');
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'pm-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['sub'], { from: 'user' });

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when script arg and relative executableDir then spawn relative script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = 'exec-dir';
      program.executableDir(execDir);
      const localPath = path.resolve(gLocalDirectory, execDir, 'script-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when script arg and absolute executableDir then spawn absolute script-sub.js', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const execDir = path.resolve(gLocalDirectory, 'exec-dir');
      program.executableDir(execDir);
      const localPath = path.resolve(execDir, 'script-sub.js');
      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script-Dir', 'script'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });

    it('when script arg is link and and link-sub relative to link target then spawn local link-sub', () => {
      const program = new commander.Command();
      program.command('sub', 'executable description');

      const linkPath = path.resolve(gLocalDirectory, 'link', 'link');
      const scriptPath = path.resolve(gLocalDirectory, 'script', 'script.js');
      const scriptSubPath = path.resolve(gLocalDirectory, 'script', 'link-sub.js');
      const realPathSyncSpy = sinon.stub(fs, 'realpathSync').callsFake((path) => {
        return path === linkPath ? scriptPath : linkPath;
      });
      existsSpy.callsFake((path) => path === scriptSubPath);
      program.parse(['node', linkPath, 'sub']);
      realPathSyncSpy.restore();

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([scriptSubPath]);
    });

    it('when name pm and script arg and relative executableFile then spawn local exec.js', () => {
      const program = new commander.Command('pm');
      const localPath = path.join('relative', 'exec.js');
      const absolutePath = path.resolve(gLocalDirectory, localPath);
      program.command('sub', 'executable description', { executableFile: localPath });

      existsSpy.callsFake((path) => path === absolutePath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([absolutePath]);
    });

    it('when name pm and script arg and absolute executableFile then spawn local exec.js', () => {
      const program = new commander.Command('pm');
      const localPath = path.resolve(gLocalDirectory, 'absolute', 'exec.js');
      program.command('sub', 'executable description', { executableFile: localPath });

      existsSpy.callsFake((path) => path === localPath);
      program.parse(['node', path.resolve(gLocalDirectory, 'script.js'), 'sub']);

      expect(extractMockSpawnArgs(spawnSpy)).toEqual([localPath]);
    });
  });

  describe('search for local file', () => {
    it('when script arg then search for local script-sub.js, .ts, .tsx, .mpjs, .cjs', () => {
      existsSpy.callsFake((path) => false);
      const program = new commander.Command();
      program.command('sub', 'executable description');
      const scriptPath = path.resolve(gLocalDirectory, 'script');
      program.parse(['node', scriptPath, 'sub']);
      const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
      sourceExt.forEach((ext, i) => {
        expect(existsSpy.getCalls().find((c) => c.firstArg === path.resolve(gLocalDirectory, `script-sub${ext}`))).not.toBe(undefined);
      });
    });
  });
});
