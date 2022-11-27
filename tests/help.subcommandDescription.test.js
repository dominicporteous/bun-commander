import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('subcommandDescription', () => {
  it('when program has no summary or description then empty string', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual('');
  });

  it('when program has summary then return summary', () => {
    const summary = 'summary';
    const program = new commander.Command();
    program.summary(summary);
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual(summary);
  });

  it('when program has description then return description', () => {
    const description = 'description';
    const program = new commander.Command();
    program.description(description);
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual(description);
  });

  it('when program has summary and description then return summary', () => {
    const summary = 'summary';
    const program = new commander.Command();
    program.summary(summary);
    program.description('description');
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual(summary);
  });
});
