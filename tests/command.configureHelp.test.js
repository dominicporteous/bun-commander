import { describe, expect, it } from "bun:test";
import commander from '../index.js';

it('when configure program then affects program helpInformation', () => {
  const program = new commander.Command();
  program.configureHelp({ formatHelp: () => { return 'custom'; } });
  expect(program.helpInformation()).toEqual('custom');
});

it('when configure program then affects subcommand helpInformation', () => {
  const program = new commander.Command();
  program.configureHelp({ formatHelp: () => { return 'custom'; } });
  const sub = program.command('sub');
  expect(sub.helpInformation()).toEqual('custom');
});

it('when configure with unknown property then createHelp has unknown property', () => {
  const program = new commander.Command();
  program.configureHelp({ mySecretValue: 'secret' });
  expect(program.createHelp().mySecretValue).toEqual('secret');
});

it('when configure with unknown property then helper passed to formatHelp has unknown property', () => {
  const program = new commander.Command();
  program.configureHelp({
    mySecretValue: 'secret',
    formatHelp: (cmd, helper) => {
      return helper.mySecretValue;
    }
  });
  expect(program.helpInformation()).toEqual('secret');
});
