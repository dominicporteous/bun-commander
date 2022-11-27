import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Not testing output, just testing whether an error is detected.

describe.each([true, false])('allowExcessArguments when action handler: %s', (hasActionHandler) => {
  function configureCommand(cmd) {
    cmd
      .exitOverride()
      .configureOutput({
        writeErr: () => {}
      });
    if (hasActionHandler) {
      cmd.action(() => {});
    }
  }

  it('when specify excess program argument then no error by default', () => {
    const program = new commander.Command();
    configureCommand(program);

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  it('when specify excess program argument and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .allowExcessArguments(false);

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).toThrow();
  });

  it('when specify excess program argument and allowExcessArguments() then no error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .allowExcessArguments();

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  it('when specify excess program argument and allowExcessArguments(true) then no error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .allowExcessArguments(true);

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  it('when specify excess command argument then no error (by default)', () => {
    const program = new commander.Command();
    const sub = program
      .command('sub');
    configureCommand(sub);

    expect(() => {
      program.parse(['sub', 'excess'], { from: 'user' });
    }).not.toThrow();
  });

  it('when specify excess command argument and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    const sub = program
      .command('sub')
      .allowExcessArguments(false);
    configureCommand(sub);

    expect(() => {
      program.parse(['sub', 'excess'], { from: 'user' });
    }).toThrow();
  });

  it('when specify expected arg and allowExcessArguments(false) then no error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .argument('<file>')
      .allowExcessArguments(false);

    expect(() => {
      program.parse(['file'], { from: 'user' });
    }).not.toThrow();
  });

  it('when specify excess after <arg> and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .argument('<file>')
      .allowExcessArguments(false);

    expect(() => {
      program.parse(['file', 'excess'], { from: 'user' });
    }).toThrow();
  });

  it('when specify excess after [arg] and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .argument('[file]')
      .allowExcessArguments(false);

    expect(() => {
      program.parse(['file', 'excess'], { from: 'user' });
    }).toThrow();
  });

  it('when specify args for [args...] and allowExcessArguments(false) then no error', () => {
    const program = new commander.Command();
    configureCommand(program);
    program
      .argument('[files...]')
      .allowExcessArguments(false);

    expect(() => {
      program.parse(['file1', 'file2', 'file3'], { from: 'user' });
    }).not.toThrow();
  });
});
