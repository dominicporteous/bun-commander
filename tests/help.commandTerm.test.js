import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

// subcommandTerm does not currently respect helpOption or ignore hidden options, so not testing those.
describe('subcommandTerm', () => {
  it('when plain command then returns name', () => {
    const command = new commander.Command('program');
    const helper = new commander.Help();
    expect(helper.subcommandTerm(command)).toEqual('program');
  });

  it('when command has alias then returns name|alias', () => {
    const command = new commander.Command('program')
      .alias('alias');
    const helper = new commander.Help();
    expect(helper.subcommandTerm(command)).toEqual('program|alias');
  });

  it('when command has options then returns name [options]', () => {
    const command = new commander.Command('program')
      .option('-a,--all');
    const helper = new commander.Help();
    expect(helper.subcommandTerm(command)).toEqual('program [options]');
  });

  it('when command has <argument> then returns name <argument>', () => {
    const command = new commander.Command('program')
      .argument('<argument>');
    const helper = new commander.Help();
    expect(helper.subcommandTerm(command)).toEqual('program <argument>');
  });

  it('when command has everything then returns name|alias [options] <argument>', () => {
    const command = new commander.Command('program')
      .alias('alias')
      .option('-a,--all')
      .argument('<argument>');
    const helper = new commander.Help();
    expect(helper.subcommandTerm(command)).toEqual('program|alias [options] <argument>');
  });
});
