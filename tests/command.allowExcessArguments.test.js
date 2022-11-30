import { describe, expect, it } from "bun:test";
import { doesNotThrow, throws } from "node:assert";
import commander from '../index.js';

// Not testing output, just testing whether an error is detected.


for (const hasActionHandler of [true, false]) {

  describe(`allowExcessArguments when action handler: ${hasActionHandler}`, () => {
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

      doesNotThrow(() => {
        program.parse(['excess'], { from: 'user' });
      });
    });

    it('when specify excess program argument and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .allowExcessArguments(false);

      throws(() => {
        program.parse(['excess'], { from: 'user' });
      });
    });

    it('when specify excess program argument and allowExcessArguments() then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .allowExcessArguments();

      doesNotThrow(() => {
        program.parse(['excess'], { from: 'user' });
      });
    });

    it('when specify excess program argument and allowExcessArguments(true) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .allowExcessArguments(true);

      doesNotThrow(() => {
        program.parse(['excess'], { from: 'user' });
      });
    });

    it('when specify excess command argument then no error (by default)', () => {
      const program = new commander.Command();
      const sub = program
        .command('sub');
      configureCommand(sub);

      doesNotThrow(() => {
        program.parse(['sub', 'excess'], { from: 'user' });
      });
    });

    it('when specify excess command argument and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      const sub = program
        .command('sub')
        .allowExcessArguments(false);
      configureCommand(sub);

      throws(() => {
        program.parse(['sub', 'excess'], { from: 'user' });
      });
    });

    it('when specify expected arg and allowExcessArguments(false) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .argument('<file>')
        .allowExcessArguments(false);

      doesNotThrow(() => {
        program.parse(['file'], { from: 'user' });
      });
    });

    it('when specify excess after <arg> and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .argument('<file>')
        .allowExcessArguments(false);

      throws(() => {
        program.parse(['file', 'excess'], { from: 'user' });
      });
    });

    it('when specify excess after [arg] and allowExcessArguments(false) then error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .argument('[file]')
        .allowExcessArguments(false);

      throws(() => {
        program.parse(['file', 'excess'], { from: 'user' });
      });
    });

    it('when specify args for [args...] and allowExcessArguments(false) then no error', () => {
      const program = new commander.Command();
      configureCommand(program);
      program
        .argument('[files...]')
        .allowExcessArguments(false);

      doesNotThrow(() => {
        program.parse(['file1', 'file2', 'file3'], { from: 'user' });
      });
    });
  });

}
