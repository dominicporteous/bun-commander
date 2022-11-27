import { beforeAll, afterEach, afterAll, describe, expect, it } from "bun:test";
import { silentCommand } from './util/silent';

// Checking for detection of unknown options, including regression tests for some past issues.

describe('unknownOption', () => {

  it('when specify unknown option with subcommand and action handler then error', () => {
    const program = silentCommand();
    program
      .exitOverride()
      .command('info')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'info', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toEqual('commander.unknownOption');
  });

  it('when specify unknown option with subcommand argument and action handler then error', () => {
    const program = silentCommand();
    program
      .exitOverride()
      .command('info <file>')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  it('when specify unknown option with program and action handler then error', () => {
    const program = silentCommand();
    program
      .exitOverride()
      .argument('[file]')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  it('when specify unknown option with program argument and action handler then error', () => {
    // Regression test from #965
    const program = silentCommand();
    program
      .exitOverride()
      .argument('[file]')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  it('when specify unknown option with simple program then error', () => {
    const program = silentCommand();
    program
      .exitOverride();
    let caughtErr;
    try {
      program.parse(['node', 'test', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  it('when specify unknown global option before subcommand then error', () => {
    const program = silentCommand();
    program
      .exitOverride();
    program.command('sub');

    let caughtErr;
    try {
      program.parse(['--NONSENSE', 'sub'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });
});
