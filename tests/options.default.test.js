import { describe, expect, it } from "bun:test";
import { Command, Option } from '../index.js';

describe('.option() with default and option not specified in parse', () => {
  it('when boolean option with boolean default then value is default', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', false);
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe(false);
  });

  it('when boolean option with number zero default then value is zero', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 0);
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe(0);
  });

  it('when boolean option with string default then value is default', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 'default');
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe('default');
  });

  it('when required option-argument and default number then value is default', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 80);
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe(80);
  });

  it('when required option-argument and default string then value is default', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 'foo');
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe('foo');
  });

  it('when optional option-argument and default number then value is default', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe(80);
  });

  it('when optional option-argument and default string then value is default', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe('foo');
  });

  it('when negated and default string then value is default', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.option('--no-colour', 'description', 'RGB');
    program.parse([], { from: 'user' });
    expect(program.opts().colour).toBe('RGB');
  });
});

describe('Option with default and option not specified in parse', () => {
  it('when boolean option with boolean default then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default(false));
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe(false);
  });

  it('when boolean option with number zero default then value is zero', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default(0));
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe(0);
  });

  it('when boolean option with string default then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-d, --debug').default('default'));
    program.parse([], { from: 'user' });
    expect(program.opts().debug).toBe('default');
  });

  it('when required option-argument and default number then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port <port-number>').default(80));
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe(80);
  });

  it('when required option-argument and default string then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port <port-number>').default('foo'));
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe('foo');
  });

  it('when optional option-argument and default number then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port [port-number]').default(80));
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe(80);
  });

  it('when optional option-argument and default string then value is default', () => {
    const program = new Command();
    program.addOption(new Option('-p, --port [port-number]').default('foo'));
    program.parse([], { from: 'user' });
    expect(program.opts().port).toBe('foo');
  });

  it('when negated and default string then value is default', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.addOption(new Option('--no-colour').default('RGB'));
    program.parse([], { from: 'user' });
    expect(program.opts().colour).toBe('RGB');
  });
});

// Fairly obvious this needs to happen, but was broken for optional in past!
describe('default overwritten by specified option', () => {
  it('when boolean option with boolean default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', false);
    program.parse(['-d'], { from: 'user' });
    expect(program.opts().debug).toBe(true);
  });

  it('when boolean option with number zero default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 0);
    program.parse(['-d'], { from: 'user' });
    expect(program.opts().debug).toBe(true);
  });

  it('when boolean option with string default then value is true', () => {
    const program = new Command();
    program.option('-d, --debug', 'description', 'default');
    program.parse(['-d'], { from: 'user' });
    expect(program.opts().debug).toBe(true);
  });

  it('when required option-argument and default number then value is from args', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 80);
    program.parse(['-p', '1234'], { from: 'user' });
    expect(program.opts().port).toBe('1234');
  });

  it('when required option-argument and default string then value is from args', () => {
    const program = new Command();
    program.option('-p, --port <port-number>', 'description', 'foo');
    program.parse(['-p', '1234'], { from: 'user' });
    expect(program.opts().port).toBe('1234');
  });

  it('when optional option-argument and default number and option-argument specified then value is from args', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse(['-p', '1234'], { from: 'user' });
    expect(program.opts().port).toBe('1234');
  });

  it('when optional option-argument and default string and option-argument specified then value is from args', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse(['-p', '1234'], { from: 'user' });
    expect(program.opts().port).toBe('1234');
  });

  it('when optional option-argument and default number and option-argument not specified then value is true', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 80);
    program.parse(['-p'], { from: 'user' });
    expect(program.opts().port).toBe(true);
  });

  it('when optional option-argument and default string and option-argument not specified then value is true', () => {
    const program = new Command();
    program.option('-p, --port [port-number]', 'description', 'foo');
    program.parse(['-p'], { from: 'user' });
    expect(program.opts().port).toBe(true);
  });

  it('when negated and default string then value is false', () => {
    // Bit tricky thinking about what default means for a negated option, but treat as with other options.
    const program = new Command();
    program.option('--no-colour', 'description', 'RGB');
    program.parse(['--no-colour'], { from: 'user' });
    expect(program.opts().colour).toBe(false);
  });
});
