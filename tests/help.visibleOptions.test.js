import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('visibleOptions', () => {
  it('when no options then just help visible', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['help']);
  });

  it('when no options and no help option then empty array', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    expect(helper.visibleOptions(program)).toEqual([]);
  });

  it('when add option then visible (with help)', () => {
    const program = new commander.Command();
    program.option('-v,--visible');
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['visible', 'help']);
  });

  it('when option hidden then not visible', () => {
    const program = new commander.Command();
    program
      .option('-v,--visible')
      .addOption(new commander.Option('--invisible').hideHelp());
    const helper = new commander.Help();
    const visibleOptionNames = helper.visibleOptions(program).map(option => option.name());
    expect(visibleOptionNames).toEqual(['visible', 'help']);
  });
});

describe('implicit help', () => {
  it('when default then help term is -h, --help', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    expect(helper.optionTerm(implicitHelp)).toEqual('-h, --help');
  });

  it('when short flag obscured then help term is --help', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-h, --huge').hideHelp());
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    expect(helper.optionTerm(implicitHelp)).toEqual('--help');
  });

  it('when long flag obscured then help term is --h', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-H, --help').hideHelp());
    const helper = new commander.Help();
    const implicitHelp = helper.visibleOptions(program)[0];
    expect(helper.optionTerm(implicitHelp)).toEqual('-h');
  });

  it('when help flags obscured then implicit help hidden', () => {
    const program = new commander.Command();
    program.addOption(new commander.Option('-h, --help').hideHelp());
    const helper = new commander.Help();
    expect(helper.visibleOptions(program)).toEqual([]);
  });
});
