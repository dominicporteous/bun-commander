import { describe, expect, it } from "bun:test";
import commander from '../index.js';

// Testing variadic arguments. Testing all the action arguments, but could test just variadicArg.

describe('variadic argument', () => {
  it('when no extra arguments specified for program then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .arguments('<id> [variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'id']);

    expect(actionMock).toHaveBeenCalledWith('id', [], program.opts(), program);
  });

  it('when extra arguments specified for program then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .arguments('<id> [variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'id', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith('id', extraArguments, program.opts(), program);
  });

  it('when no extra arguments specified for command then variadic arg is empty array', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);

    program.parse(['node', 'test', 'sub']);

    expect(actionMock).toHaveBeenCalledWith([], cmd.opts(), cmd);
  });

  it('when extra arguments specified for command then variadic arg is array of values', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    const cmd = program
      .command('sub [variadicArg...]')
      .action(actionMock);
    const extraArguments = ['a', 'b', 'c'];

    program.parse(['node', 'test', 'sub', ...extraArguments]);

    expect(actionMock).toHaveBeenCalledWith(extraArguments, cmd.opts(), cmd);
  });

  it('when program variadic argument not last then error', () => {
    const program = new commander.Command();

    expect(() => {
      program.arguments('<variadicArg...> [optionalArg]');
    }).toThrow("only the last argument can be variadic 'variadicArg'");
  });

  it('when command variadic argument not last then error', () => {
    const program = new commander.Command();

    expect(() => {
      program.command('sub <variadicArg...> [optionalArg]');
    }).toThrow("only the last argument can be variadic 'variadicArg'");
  });

  it('when variadic argument then usage shows variadic', () => {
    const program = new commander.Command();
    program
      .name('foo')
      .arguments('[args...]');

    expect(program.usage()).toBe('[options] [args...]');
  });
});
