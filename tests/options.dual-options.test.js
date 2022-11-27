import { describe, expect, it } from "bun:test";
import { Command } from '../index.js';
import { Option, DualOptions } from '../lib/option'

// This tests an internal helper class which is not currently exposed on the package.

it('when positive option then stored in positiveOptions', () => {
  const program = new Command();
  program.option('--one');
  const helper = new DualOptions(program.options);
  expect(helper.positiveOptions.size).toEqual(1);
  expect(helper.negativeOptions.size).toEqual(0);
  expect(helper.dualOptions.size).toEqual(0);
});

it('when negative option then stored in negativeOptions', () => {
  const program = new Command();
  program.option('--no-one');
  const helper = new DualOptions(program.options);
  expect(helper.positiveOptions.size).toEqual(0);
  expect(helper.negativeOptions.size).toEqual(1);
  expect(helper.dualOptions.size).toEqual(0);
});

it('when unrelated positive and negative options then no dual options', () => {
  const program = new Command();
  program
    .option('--one')
    .option('--no-two');
  const helper = new DualOptions(program.options);
  expect(helper.dualOptions.size).toEqual(0);
});

it('when related positive and negative options then stored as dual option', () => {
  const program = new Command();
  program
    .option('--one')
    .option('--no-one');
  const helper = new DualOptions(program.options);
  expect(helper.dualOptions.size).toEqual(1);
});

it('when related negative and positive options then stored as dual option', () => {
  const program = new Command();
  program
    .option('--no-one')
    .option('--one');
  const helper = new DualOptions(program.options);
  expect(helper.dualOptions.size).toEqual(1);
});

describe('valueFromOption with boolean option', () => {
  const positiveOption = new Option('--one');
  const negativeOption = new Option('--no-one');
  const options = [positiveOption, negativeOption];

  it('when negativeOption with false then return true', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption(false, negativeOption)).toBe(true);
  });

  it('when negativeOption with true then return false', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption(true, negativeOption)).toBe(false);
  });

  it('when positiveOption with false then return false', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption(false, positiveOption)).toBe(false);
  });

  it('when positiveOption with true then return true', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption(true, positiveOption)).toBe(true);
  });
});

describe('valueFromOption with option expecting value and negative with preset', () => {
  const positiveOption = new Option('--one <value>');
  const negativeOption = new Option('--no-one').preset('FALSE');
  const options = [positiveOption, negativeOption];

  it('when negativeOption with FALSE then return true', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption('FALSE', negativeOption)).toBe(true);
  });

  it('when negativeOption with string then return false', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption('foo', negativeOption)).toBe(false);
  });

  it('when positiveOption with FALSE then return false', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption('FALSE', positiveOption)).toBe(false);
  });

  it('when positiveOption with true then return true', () => {
    const helper = new DualOptions(options);
    expect(helper.valueFromOption('foo', positiveOption)).toBe(true);
  });
});
