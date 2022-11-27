import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import { throws } from 'node:assert'
import sinon from 'sinon'

describe('variadic option with required value', () => {
  it('when variadic with value missing then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: sinon.mock() })
      .option('-r,--required <value...>');

    throws(() => program.parse(['--required'], { from: 'user' }))
  });

  it('when variadic with one value then set in array', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>');

    program.parse(['--required', 'one'], { from: 'user' });
    expect(program.opts().required).toEqual(['one']);
  });

  it('when variadic with two values then set in array', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>');

    program.parse(['--required', 'one', 'two'], { from: 'user' });
    expect(program.opts().required).toEqual(['one', 'two']);
  });

  it('when variadic with repeated values then set in array', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>');

    program.parse(['--required', 'one', '--required', 'two'], { from: 'user' });
    expect(program.opts().required).toEqual(['one', 'two']);
  });

  it('when variadic used with choices and one value then set in array', () => {
    const program = new commander.Command();
    program
      .addOption(new commander.Option('-r,--required <value...>').choices(['one', 'two']));

    program.parse(['--required', 'one'], { from: 'user' });
    expect(program.opts().required).toEqual(['one']);
  });

  it('when variadic used with choices and two values then set in array', () => {
    const program = new commander.Command();
    program
      .addOption(new commander.Option('-r,--required <value...>').choices(['one', 'two']));

    program.parse(['--required', 'one', 'two'], { from: 'user' });
    expect(program.opts().required).toEqual(['one', 'two']);
  });

  it('when variadic with short combined argument then not variadic', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>')
      .argument('[arg]');

    program.parse(['-rone', 'operand'], { from: 'user' });
    expect(program.opts().required).toEqual(['one']);
  });

  it('when variadic with long combined argument then not variadic', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>')
      .argument('[arg]');

    program.parse(['--required=one', 'operand'], { from: 'user' });
    expect(program.opts().required).toEqual(['one']);
  });

  it('when variadic with value followed by option then option not eaten', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>')
      .option('-f, --flag')
      .argument('[arg]');

    program.parse(['-r', 'one', '-f'], { from: 'user' });
    const opts = program.opts();
    expect(opts.required).toEqual(['one']);
    expect(opts.flag).toBe(true);
  });

  it('when variadic with no value and default then set to default', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>', 'variadic description', 'default');

    program.parse([], { from: 'user' });
    expect(program.opts().required).toEqual('default');
  });

  it('when variadic with coercion then coercion sets value', () => {
    const program = new commander.Command();
    program
      .option('-r,--required <value...>', 'variadic description', parseFloat);

    // variadic processing reads the multiple values, but up to custom coercion what it does.
    program.parse(['--required', '1e2', '1e3'], { from: 'user' });
    expect(program.opts().required).toEqual(1000);
  });
});

// Not retesting everything, but do some tests on variadic with optional
describe('variadic option with optional value', () => {
  it('when variadic not specified then value undefined', () => {
    const program = new commander.Command();
    program
      .option('-o,--optional [value...]');

    program.parse([], { from: 'user' });
    expect(program.opts().optional).toBeUndefined();
  });

  it('when variadic used as boolean flag then value true', () => {
    const program = new commander.Command();
    program
      .option('-o,--optional [value...]');

    program.parse(['--optional'], { from: 'user' });
    expect(program.opts().optional).toBe(true);
  });

  it('when variadic with one value then set in array', () => {
    const program = new commander.Command();
    program
      .option('-o,--optional [value...]');

    program.parse(['--optional', 'one'], { from: 'user' });
    expect(program.opts().optional).toEqual(['one']);
  });

  it('when variadic with two values then set in array', () => {
    const program = new commander.Command();
    program
      .option('-o,--optional [value...]');

    program.parse(['--optional', 'one', 'two'], { from: 'user' });
    expect(program.opts().optional).toEqual(['one', 'two']);
  });
});

describe('variadic special cases', () => {
  it('when option flags has word character before dots then is variadic', () => {
    const program = new commander.Command();
    program
      .option('-c,--comma [value...]');

    expect(program.options[0].variadic).toBeTruthy();
  });

  it('when option flags has special characters before dots then not variadic', () => {
    // This might be used to describe coercion for comma separated values, and is not variadic.
    const program = new commander.Command();
    program
      .option('-c,--comma [value,...]');

    expect(program.options[0].variadic).toBeFalsy();
  });
});
