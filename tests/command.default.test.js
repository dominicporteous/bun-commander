import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import childProcess from 'node:child_process';
import path from 'node:path';
import util from 'node:util';
import sinon from 'sinon'

const execFileAsync = util.promisify(childProcess.execFile);

describe('default executable command', () => {
  // Calling node explicitly so pm works without file suffix cross-platform.
  const pm = path.join(__dirname, './fixtures/pm');

  it('when default subcommand and no command then call default', async() => {
    const res = await execFileAsync('bun', [pm]);
    expect(res).toEqual('default\n');
  });

  it('when default subcommand and unrecognised argument then call default with argument', async() => {
    const res = await execFileAsync('bun', [pm, 'an-argument']);
    expect(res).toEqual('default\n[ "an-argument" ]\n');
  });

  it('when default subcommand and unrecognised option then call default with option', async() => {
    const res = await execFileAsync('bun', [pm, '--an-option']);
    expect(res).toEqual('default\n[ "--an-option" ]\n');
  });
});

describe('default action command', () => {
  function makeProgram() {
    const program = new commander.Command();
    const actionMock = sinon.spy();
    program
      .command('other');
    program
      .command('default', { isDefault: true })
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);
    return { program, actionMock };
  }

  it('when default subcommand and no command then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js'.split(' '));
    expect(actionMock.called).toBe(true);
  });

  it('when default subcommand and unrecognised argument then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js an-argument'.split(' '));
    expect(actionMock.called).toBe(true);
  });

  it('when default subcommand and unrecognised option then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js --an-option'.split(' '));
    expect(actionMock.called).toBe(true);
  });
});

describe('default added command', () => {
  function makeProgram() {
    const actionMock = sinon.spy();
    const defaultCmd = new commander.Command('default')
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);

    const program = new commander.Command();
    program
      .command('other');
    program
      .addCommand(defaultCmd, { isDefault: true });
    return { program, actionMock };
  }

  it('when default subcommand and no command then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js'.split(' '));
    expect(actionMock.called).toBe(true);
  });

  it('when default subcommand and unrecognised argument then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js an-argument'.split(' '));
    expect(actionMock.called).toBe(true);
  });

  it('when default subcommand and unrecognised option then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('bun test.js --an-option'.split(' '));
    expect(actionMock.called).toBe(true);
  });
});
