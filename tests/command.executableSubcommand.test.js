import { it } from "bun:test";
import { throws } from "node:assert";
import commander from '../index.js';
import sinon from 'sinon';

// Executable subcommand tests that didn't fit in elsewhere.

// This is the default behaviour when no default command and no action handlers
it('when no command specified and executable then display help', () => {
  // Optional. Suppress normal output to keep test output clean.
  const writeSpy = sinon.stub(Bun, 'write').callsFake(() => { });
  const program = new commander.Command();
  program
    .exitOverride((err) => { throw err; })
    .command('install', 'install description');
  throws(() => {
    program.parse(['node', 'test']);
  }, { message: '(outputHelp)' });
  writeSpy.reset();
});
