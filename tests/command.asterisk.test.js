import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

// .command('*') is the old main/default command handler. It adds a listener
// for 'command:*'. It has been somewhat replaced by the program action handler,
// so most uses are probably old code. Current plan is keep the code backwards compatible
// and put work in elsewhere for new code (e.g. evolving behaviour for program action handler).
//
// The event 'command:*' is also listened for directly for testing for unknown commands
// due to an example in the README.
//
// Historical: the event 'command:*' used to also be shared by the action handler on the program.

describe(".command('*')", () => {
  it('when no arguments then asterisk action not called', () => {
    const writeMock = sinon.stub(Bun, 'write').callsFake(() => { });
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .exitOverride() // to catch help
      .command('*')
      .action(mockAction);
    try {
      program.parse(['node', 'test']);
    } catch (err) {

    }
    expect(mockAction.called).toBe(false);
    writeMock.restore();
  });

  it('when unrecognised argument then asterisk action called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('*')
      .argument('[args...]')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction.called).toBe(true);
  });

  it('when recognised command then asterisk action not called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install')
      .action(() => { });
    program
      .command('*')
      .action(mockAction);
    program.parse(['node', 'test', 'install']);
    expect(mockAction.called).toBe(false);
  });

  it('when unrecognised command/argument then asterisk action called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install');
    program
      .command('*')
      .argument('[args...]')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction.called).toBe(true);
  });

  it('when unrecognised argument and known option then asterisk action called', () => {
    // This tests for a regression between v4 and v5. Known default option should not be rejected by program.
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install');
    const star = program
      .command('*')
      .argument('[args...]')
      .option('-d, --debug')
      .action(mockAction);
    program.parse(['node', 'test', 'unrecognised-command', '--debug']);
    expect(mockAction.called).toBe(true);
    expect(star.opts().debug).toEqual(true);
  });

  it('when non-command argument and unknown option then error for unknown option', () => {
    // This is a change in behaviour from v2 which did not error, but is consistent with modern better detection of invalid options
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({
        writeErr: () => {}
      })
      .command('install');
    program
      .command('*')
      .argument('[args...]')
      .action(mockAction);
    let caughtErr;
    try {
      program.parse(['node', 'test', 'some-argument', '--unknown']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toEqual('commander.unknownOption');
    expect(mockAction.called).toBe(false);
  });
});

// Test .on explicitly rather than assuming covered by .command
describe(".on('command:*')", () => {
  it('when no arguments then listener not called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test']);
    expect(mockAction.called).toBe(false);
  });

  it('when unrecognised argument then listener called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction.called).toBe(true);
  });

  it('when recognised command then listener not called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install')
      .action(() => { });
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'install']);
    expect(mockAction.called).toBe(false);
  });

  it('when unrecognised command/argument then listener called', () => {
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install');
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'unrecognised-command']);
    expect(mockAction.called).toBe(true);
  });

  it('when unrecognised command/argument and unknown option then listener called', () => {
    // Give listener a chance to make a suggestion for misspelled command. The option
    // could only be unknown because the command is not correct.
    // Regression identified in https://github.com/tj/commander.js/issues/1460#issuecomment-772313494
    const mockAction = sinon.spy();
    const program = new commander.Command();
    program
      .command('install');
    program
      .on('command:*', mockAction);
    program.parse(['node', 'test', 'intsall', '--unknown']);
    expect(mockAction.called).toBe(true);
  });
});
