import { describe, expect, it } from "bun:test";
import commander from '../index.js';

class MyOption extends commander.Option {
  constructor(flags, description) {
    super(flags, description);
    this.myProperty = 'MyOption';
  }
}

class MyCommand extends commander.Command {
  createOption(flags, description) {
    return new MyOption(flags, description);
  }
}

it('when override createOption then used for option()', () => {
  const program = new MyCommand();
  program.option('-a, --alpha');
  expect(program.options.length).toEqual(1);
  expect(program.options[0].myProperty).toEqual('MyOption');
});

it('when override createOption then used for requiredOption()', () => {
  const program = new MyCommand();
  program.requiredOption('-a, --alpha');
  expect(program.options.length).toEqual(1);
  expect(program.options[0].myProperty).toEqual('MyOption');
});

it('when override createOption then used for version()', () => {
  const program = new MyCommand();
  program.version('1.2.3');
  expect(program.options.length).toEqual(1);
  expect(program.options[0].myProperty).toEqual('MyOption');
});

it('when override createOption then used for help option in visibleOptions', () => {
  const program = new MyCommand();
  const visibleOptions = program.createHelp().visibleOptions(program);
  expect(visibleOptions.length).toEqual(1);
  expect(visibleOptions[0].myProperty).toEqual('MyOption');
});
