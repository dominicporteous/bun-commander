import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('optionTerm', () => {
  it('when -s flags then returns flags', () => {
    const flags = '-s';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  it('when --short flags then returns flags', () => {
    const flags = '--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  it('when -s,--short flags then returns flags', () => {
    const flags = '-s,--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  it('when -s|--short flags then returns flags', () => {
    const flags = '-s|--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });
});
