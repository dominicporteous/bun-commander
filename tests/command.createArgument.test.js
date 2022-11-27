import { describe, expect, it } from "bun:test";
import commander from '../index.js';

class MyArgument extends commander.Argument {
  constructor(name, description) {
    super(name, description);
    this.myProperty = 'MyArgument';
  }
}

class MyCommand extends commander.Command {
  createArgument(name, description) {
    return new MyArgument(name, description);
  }

  // createCommand for testing .command('sub <file>')
  createCommand(name) {
    return new MyCommand(name);
  }
}

it('when override createArgument then used for argument()', () => {
  const program = new MyCommand();
  program.argument('<file>');
  expect(program._args.length).toEqual(1);
  expect(program._args[0].myProperty).toEqual('MyArgument');
});

it('when override createArgument then used for arguments()', () => {
  const program = new MyCommand();
  program.arguments('<file>');
  expect(program._args.length).toEqual(1);
  expect(program._args[0].myProperty).toEqual('MyArgument');
});

it('when override createArgument and createCommand then used for argument of command()', () => {
  const program = new MyCommand();
  const sub = program.command('sub <file>');
  expect(sub._args.length).toEqual(1);
  expect(sub._args[0].myProperty).toEqual('MyArgument');
});
