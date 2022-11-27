import { describe, expect, it } from "bun:test";
import { throws } from 'node:assert'
import commander from '../index.js';
import sinon from 'sinon'

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

describe('variadic argument', () => {
  it('when no extra arguments specified for program then variadic arg is empty array', () => {
    const actionMock = sinon.spy();
    const program = new commander.Command();
    program
      .argument('<id>')
      .argument('[variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'id']);

    expect(actionMock.lastCall.args).toEqual(['id', [], program.opts(), program]);
  });

  it('when extra arguments specified for program then variadic arg is array of values', () => {
    const actionMock = sinon.spy();
    const program = new commander.Command();
    program
      .addArgument(new commander.Argument('<id>'))
      .argument('[variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    expect(actionMock.lastCall.args).toEqual(['id', extraArguments, program.opts(), program]);
  });

  it('when no extra arguments specified for command then variadic arg is empty array', () => {
    const actionMock = sinon.spy();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'sub']);

    expect(actionMock.lastCall.args).toEqual([[], cmd.opts(), cmd]);
  });

  it('when extra arguments specified for command then variadic arg is array of values', () => {
    const actionMock = sinon.spy();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    expect(actionMock.lastCall.args).toEqual([extraArguments, cmd.opts(), cmd]);
  });

  it('when program variadic argument not last then error', () => {
    const program = new commander.Command();

    throws(() => {
      program
        .argument('<variadicArg...>')
        .argument('[optionalArg]');
    }, { message: "only the last argument can be variadic 'variadicArg'" });
  });

  it('when command variadic argument not last then error', () => {
    const program = new commander.Command();

    throws(() => {
      program.command('sub <variadicArg...> [optionalArg]');
    }, { message: "only the last argument can be variadic 'variadicArg'" });
  });

  it('when variadic argument then usage shows variadic', () => {
    const program = new commander.Command();
    program
      .name('foo')
      .argument('[args...]');

    expect(program.usage()).toBe('[options] [args...]');
  });

  it('when variadic used with choices and one value then set in array', () => {
    const program = new commander.Command();
    let passedArg;
    program
      .addArgument(new commander.Argument('<value...>').choices(['one', 'two']))
      .action((value) => { passedArg = value; });

    program.parse(['one'], { from: 'user' });
    expect(passedArg).toEqual(['one']);
  });

  it('when variadic used with choices and two values then set in array', () => {
    const program = new commander.Command();
    let passedArg;
    program
      .addArgument(new commander.Argument('<value...>').choices(['one', 'two']))
      .action((value) => { passedArg = value; });

    program.parse(['one', 'two'], { from: 'user' });
    expect(passedArg).toEqual(['one', 'two']);
  });
});
