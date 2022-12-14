import { describe, expect, it } from "bun:test";
import { throws } from "node:assert";
import commander from '../index.js';
import sinon from 'sinon'

// Running alias commands is tested in command.executableSubcommand.lookup.test.js
// Test various other behaviours for .alias

it('when command has alias then appears in help', () => {
  const program = new commander.Command();
  program
    .command('info [thing]')
    .alias('i');
  const helpInformation = program.helpInformation();
  expect(helpInformation.includes('info|i ')).toBe(true);
});

it('when command has aliases added separately then only first appears in help', () => {
  const program = new commander.Command();
  program
    .command('list [thing]')
    .alias('ls')
    .alias('dir');
  const helpInformation = program.helpInformation();
  expect(helpInformation.includes('list|ls ')).toBe(true);
});

it('when command has aliases then only first appears in help', () => {
  const program = new commander.Command();
  program
    .command('list [thing]')
    .aliases(['ls', 'dir']);
  const helpInformation = program.helpInformation();
  expect(helpInformation.includes('list|ls ')).toBe(true);
});

it('when command name = alias then error', () => {
  const program = new commander.Command();
  throws(() => {
    program
      .command('fail')
      .alias('fail');
  }, { message: "Command alias can't be the same as its name" });
});

it('when use alias then action handler called', () => {
  const program = new commander.Command();
  const actionMock = sinon.spy();
  program
    .command('list')
    .alias('ls')
    .action(actionMock);
  program.parse(['ls'], { from: 'user' });
  expect(actionMock.called).toBe(true);
});

it('when use second alias added separately then action handler called', () => {
  const program = new commander.Command();
  const actionMock = sinon.spy();
  program
    .command('list')
    .alias('ls')
    .alias('dir')
    .action(actionMock);
  program.parse(['dir'], { from: 'user' });
  expect(actionMock.called).toBe(true);
});

it('when use second of aliases then action handler called', () => {
  const program = new commander.Command();
  const actionMock = sinon.spy();
  program
    .command('list')
    .aliases(['ls', 'dir'])
    .action(actionMock);
  program.parse(['dir'], { from: 'user' });
  expect(actionMock.called).toBe(true);
});

it('when set alias then can get alias', () => {
  const program = new commander.Command();
  const alias = 'abcde';
  program.alias(alias);
  expect(program.alias()).toEqual(alias);
});

it('when set aliases then can get aliases', () => {
  const program = new commander.Command();
  const aliases = ['a', 'b'];
  program.aliases(aliases);
  expect(program.aliases()).toEqual(aliases);
});

it('when set alias on executable then can get alias', () => {
  const program = new commander.Command();
  const alias = 'abcde';
  program
    .command('external', 'external command')
    .alias(alias);
  expect(program.commands[0].alias()).toEqual(alias);
});

describe('aliases parameter is treated as readonly, per TypeScript declaration', () => {
  it('when aliases called then parameter does not change', () => {
    // Unlikely this could break, but check the API we are declaring in TypeScript.
    const original = ['b', 'bld'];
    const param = original.slice();
    new commander.Command('build').aliases(param);
    expect(param).toEqual(original);
  });

  it('when aliases called and aliases later changed then parameter does not change', () => {
    const original = ['b', 'bld'];
    const param = original.slice();
    const cmd = new commander.Command('build').aliases(param);
    cmd.alias('BBB');
    expect(param).toEqual(original);
  });

  it('when aliases called and parameter later changed then aliases does not change', () => {
    const original = ['b', 'bld'];
    const param = original.slice();
    const cmd = new commander.Command('build').aliases(param);
    param.length = 0;
    expect(cmd.aliases()).toEqual(original);
  });
});
