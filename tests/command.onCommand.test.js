import { describe, expect, it } from "bun:test";
import commander from '../index.js';
import sinon from 'sinon'

// The action handler used to be implemented using command events and listeners.
// Now, this is mostly just for backwards compatibility.

describe(".command('*')", () => {
  it('when action handler for subcommand then emit command:subcommand', () => {
    const mockListener = sinon.spy();
    const program = new commander.Command();
    program
      .command('sub')
      .action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    expect(mockListener.called).toBe(true);
  });

  it('when no action handler for subcommand then still emit command:subcommand', () => {
    const mockListener = sinon.spy();
    const program = new commander.Command();
    program
      .command('sub');
    program.on('command:sub', mockListener);
    program.parse(['sub'], { from: 'user' });
    expect(mockListener.called).toBe(true);
  });

  it('when subcommand has argument then emit command:subcommand with argument', () => {
    const mockListener = sinon.spy();
    const program = new commander.Command();
    program
      .command('sub <file>')
      .action(() => {});
    program.on('command:sub', mockListener);
    program.parse(['sub', 'file'], { from: 'user' });
    expect(mockListener.getCall(0).args).toEqual([['file'], []]);
  });
});
