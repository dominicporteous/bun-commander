import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('longestOptionTermLength', () => {
  it('when no option then returns zero', () => {
    const program = new commander.Command();
    program.helpOption(false);
    const helper = new commander.Help();
    expect(helper.longestOptionTermLength(program, helper)).toEqual(0);
  });

  it('when just implicit help option returns length of help flags', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.longestOptionTermLength(program, helper)).toEqual('-h, --help'.length);
  });

  it('when multiple option then returns longest length', () => {
    const longestOptionFlags = '-l, --longest <value>';
    const program = new commander.Command();
    program
      .option('--before', 'optional description of flags')
      .option(longestOptionFlags)
      .option('--after');
    const helper = new commander.Help();
    expect(helper.longestOptionTermLength(program, helper)).toEqual(longestOptionFlags.length);
  });
});
